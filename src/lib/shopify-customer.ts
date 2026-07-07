/**
 * Comptes clients Shopify (API Storefront, comptes « classiques »).
 * Server-only : utilise le token Storefront + le customer access token (cookie httpOnly).
 *
 * Le customer access token identifie le client connecté ; il ne doit JAMAIS
 * être exposé au navigateur en clair (stocké en cookie httpOnly par les routes).
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;
const version = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2025-04";

export const isCustomerAuthConfigured = Boolean(domain && token);
export const CUSTOMER_COOKIE = "bien_customer_token";

async function customerFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  if (!domain || !token) throw new Error("Shopify non configuré");
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // données client : jamais mises en cache
  });
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify customer API: ${JSON.stringify(json.errors)}`);
  return json.data;
}

export type UserError = { code?: string; field?: string[] | null; message: string };

/* --------------------------------- Connexion -------------------------------- */

export async function login(email: string, password: string): Promise<{ token?: string; expiresAt?: string; errors: UserError[] }> {
  const data = await customerFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: UserError[];
    };
  }>(
    `mutation($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken { accessToken expiresAt }
        customerUserErrors { code field message }
      }
    }`,
    { input: { email, password } },
  );
  const r = data.customerAccessTokenCreate;
  return { token: r.customerAccessToken?.accessToken, expiresAt: r.customerAccessToken?.expiresAt, errors: r.customerUserErrors };
}

/* -------------------------------- Inscription ------------------------------- */

export async function register(input: {
  email: string; password: string; firstName?: string; lastName?: string; acceptsMarketing?: boolean;
}): Promise<{ errors: UserError[] }> {
  const data = await customerFetch<{
    customerCreate: { customer: { id: string } | null; customerUserErrors: UserError[] };
  }>(
    `mutation($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer { id }
        customerUserErrors { code field message }
      }
    }`,
    { input },
  );
  return { errors: data.customerCreate.customerUserErrors };
}

/* ------------------------------ Déconnexion --------------------------------- */

export async function logout(customerToken: string): Promise<void> {
  try {
    await customerFetch(
      `mutation($token: String!) { customerAccessTokenDelete(customerAccessToken: $token) { deletedAccessToken userErrors { message } } }`,
      { token: customerToken },
    );
  } catch {
    /* best-effort */
  }
}

/* --------------------------------- Profil ----------------------------------- */

export type CustomerOrder = {
  orderNumber: number;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  statusUrl: string;
  total: { amount: string; currencyCode: string };
  items: { title: string; quantity: number }[];
};

export type Address = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip: string | null;
  province: string | null;
  country: string | null;
  phone: string | null;
  formatted: string[];
};

export type Customer = {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  defaultAddress: Address | null;
  orders: CustomerOrder[];
};

export async function getCustomer(customerToken: string): Promise<Customer | null> {
  try {
    const data = await customerFetch<{
      customer: {
        firstName: string | null; lastName: string | null; email: string | null; phone: string | null;
        defaultAddress: Address | null;
        orders: {
          nodes: {
            orderNumber: number; processedAt: string; financialStatus: string | null; fulfillmentStatus: string; statusUrl: string;
            currentTotalPrice: { amount: string; currencyCode: string };
            lineItems: { nodes: { title: string; quantity: number }[] };
          }[];
        };
      } | null;
    }>(
      `query($token: String!) {
        customer(customerAccessToken: $token) {
          firstName lastName email phone
          defaultAddress { id firstName lastName address1 address2 city zip province country phone formatted }
          orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
            nodes {
              orderNumber processedAt financialStatus fulfillmentStatus statusUrl
              currentTotalPrice { amount currencyCode }
              lineItems(first: 20) { nodes { title quantity } }
            }
          }
        }
      }`,
      { token: customerToken },
    );
    const c = data.customer;
    if (!c) return null;
    return {
      firstName: c.firstName, lastName: c.lastName, email: c.email, phone: c.phone,
      defaultAddress: c.defaultAddress,
      orders: c.orders.nodes.map((o) => ({
        orderNumber: o.orderNumber, processedAt: o.processedAt,
        financialStatus: o.financialStatus, fulfillmentStatus: o.fulfillmentStatus, statusUrl: o.statusUrl,
        total: o.currentTotalPrice,
        items: o.lineItems.nodes,
      })),
    };
  } catch {
    return null; // token invalide/expiré
  }
}

/* ----------------------------- Mise à jour profil --------------------------- */

export async function updateProfile(
  customerToken: string,
  input: { firstName?: string; lastName?: string; phone?: string | null },
): Promise<{ errors: UserError[] }> {
  const data = await customerFetch<{
    customerUpdate: { customerUserErrors: UserError[] };
  }>(
    `mutation($token: String!, $customer: CustomerUpdateInput!) {
      customerUpdate(customerAccessToken: $token, customer: $customer) {
        customerUserErrors { code field message }
      }
    }`,
    { token: customerToken, customer: input },
  );
  return { errors: data.customerUpdate.customerUserErrors };
}

/* ------------------------------ Adresse par défaut -------------------------- */

export type AddressInput = {
  firstName?: string; lastName?: string; address1?: string; address2?: string;
  city?: string; zip?: string; province?: string; country?: string; phone?: string;
};

export async function saveDefaultAddress(
  customerToken: string,
  address: AddressInput,
  existingId?: string | null,
): Promise<{ errors: UserError[] }> {
  if (existingId) {
    const data = await customerFetch<{
      customerAddressUpdate: { customerUserErrors: UserError[] };
    }>(
      `mutation($token: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $token, id: $id, address: $address) {
          customerUserErrors { code field message }
        }
      }`,
      { token: customerToken, id: existingId, address },
    );
    return { errors: data.customerAddressUpdate.customerUserErrors };
  }

  // Création + définition par défaut.
  const data = await customerFetch<{
    customerAddressCreate: { customerAddress: { id: string } | null; customerUserErrors: UserError[] };
  }>(
    `mutation($token: String!, $address: MailingAddressInput!) {
      customerAddressCreate(customerAccessToken: $token, address: $address) {
        customerAddress { id }
        customerUserErrors { code field message }
      }
    }`,
    { token: customerToken, address },
  );
  const created = data.customerAddressCreate;
  if (created.customerAddress?.id) {
    await customerFetch(
      `mutation($token: String!, $id: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $token, addressId: $id) {
          customerUserErrors { message }
        }
      }`,
      { token: customerToken, id: created.customerAddress.id },
    );
  }
  return { errors: created.customerUserErrors };
}
