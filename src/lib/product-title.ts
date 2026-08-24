/**
 * Les noms Shopify portent souvent un descriptif après un tiret
 * (« MUSHGLOW - Supermix 6-en-1 »). Affiché au même corps que la marque, il
 * fait passer le titre sur deux lignes et déséquilibre la carte : partout où
 * le nom est mis en avant, le descriptif est rendu en second, plus petit.
 *
 * Coupe au premier tiret — court, demi-cadratin ou cadratin — entouré
 * d'espaces, pour ne pas casser un nom composé comme « L-Théanine ».
 */
export function splitProductTitle(title: string): { main: string; sub: string | null } {
  const m = title.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  return m ? { main: m[1], sub: m[2] } : { main: title, sub: null };
}
