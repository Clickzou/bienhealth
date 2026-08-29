/**
 * Injecte un bloc de données structurées schema.org (JSON-LD) pour le SEO.
 *
 * `JSON.stringify` n'échappe pas `<` : une donnée venue de Shopify ou d'un avis
 * client contenant `</script>` refermerait la balise, et la suite serait
 * interprétée comme du HTML — soit une XSS déclenchée par un simple titre de
 * produit. On neutralise donc le caractère en amont (audit sécurité du
 * 29/08/2026, § 4).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const safe = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
