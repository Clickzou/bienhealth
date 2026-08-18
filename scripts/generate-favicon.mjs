/**
 * Génère `src/app/apple-icon.png` à partir de `src/app/icon.svg`.
 *
 * `icon.svg` porte le monogramme officiel du client (le B avec le champignon
 * en contre-forme, `public/brand/monogram.svg`) : il suffit aux navigateurs,
 * mais iOS réclame un PNG pour l'écran d'accueil. Un seul fichier source, donc
 * pas de divergence possible entre les deux pastilles.
 *
 *   node scripts/generate-favicon.mjs           → rendu tel quel (fond navy)
 *   node scripts/generate-favicon.mjs white     → monogramme noir sur blanc
 *
 * La variante `white` réécrit aussi `icon.svg` : c'est l'alternative laissée
 * ouverte au client, qui décrivait son logo « en noir sur fond blanc ».
 */
import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const ICON = "src/app/icon.svg";
const APPLE = "src/app/apple-icon.png";

const NAVY = { bg: "#00112b", mark: "#f9f8f6" };
const WHITE = { bg: "#ffffff", mark: "#000000" };

const variant = process.argv[2] === "white" ? WHITE : NAVY;
const other = variant === WHITE ? NAVY : WHITE;

let svg = await readFile(ICON, "utf8");
if (svg.includes(other.bg)) {
  svg = svg.replaceAll(other.bg, variant.bg).replaceAll(other.mark, variant.mark);
  await writeFile(ICON, svg);
  console.log(`écrit ${ICON} (fond ${variant.bg})`);
}

// iOS applique lui-même son masque arrondi : on lui donne un carré plein, donc
// sans le rx du SVG, et un peu plus de marge autour du monogramme.
const apple = svg
  .replace(/rx="\d+"/, 'rx="0"')
  .replace(/translate\([\d. ]+\) scale\([\d.]+\)/, "translate(11.5 10) scale(0.28)");

await sharp(Buffer.from(apple), { density: 900 })
  .resize(180, 180)
  .png({ compressionLevel: 9 })
  .toFile(APPLE);
console.log(`écrit ${APPLE} (180 px)`);
