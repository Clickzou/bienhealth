/**
 * Clients Supabase.
 * - supabasePublic : lecture côté navigateur/serveur (clé publishable, RLS appliqué).
 * - supabaseAdmin  : écriture côté serveur uniquement (clé service, RLS contourné).
 *
 * Supabase héberge le contenu éditorial (blog, FAQ, quiz, pages, leads),
 * PAS les produits/commandes/clients (qui restent dans Shopify).
 *
 * Variables d'environnement (voir .env.local.example) :
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *   SUPABASE_SERVICE_ROLE_KEY  (jamais exposée au client)
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(url && publishableKey);

export function getSupabasePublic() {
  if (!url || !publishableKey) {
    throw new Error(
      "Supabase non configuré : définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  return createClient(url, publishableKey);
}

export function getSupabaseAdmin() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin non configuré : définissez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
