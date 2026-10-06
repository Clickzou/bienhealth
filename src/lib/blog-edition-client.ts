/**
 * Relecture des articles par la cliente, depuis son espace Clickzou
 * (clickzou.fr/espace-client, onglet « Articles programmés » ; demande de JC du
 * 6 octobre 2026, sur le modèle d'Alps Ski Transfers et d'Un Seul Souffle).
 *
 * La cliente modifie le TEXTE d'un article programmé ; Clickzou contrôle ses
 * modifications puis les écrit dans `blog-corrections-client.json` (commit
 * GitHub sur main) ; le registre les applique au chargement
 * (`ARTICLES = ARTICLES_REDIGES.map(appliquerCorrections)` dans `blog.ts`).
 *
 * Modifiables : introduction, paragraphes, intertitres H3, éléments de liste,
 * questions et réponses de la FAQ, en français ET en anglais (le site est
 * bilingue : la version anglaise doit suivre).
 * Verrouillés (absents de `champsEditables`, refusés par `appliquerCorrections`) :
 * titre (H1), metaTitle, metaDescription, extrait, catégorie, intertitres H2,
 * slug, date, couverture, requête cible (`motCle`), et les liens.
 *
 * Format du texte échangé avec Clickzou. Les paragraphes du blog sont en HTML
 * léger ; la cliente, elle, voit un texte lisible :
 *   <a href="X">ancre</a>  →  [ancre](X)     (Clickzou refuse tout lien perdu,
 *                                              ajouté ou changé ; on revérifie ici)
 *   <strong>x</strong>     →  **x**
 *   <em>x</em>             →  *x*
 *   &amp;                  →  &
 * Au retour, tout le texte est échappé (aucune balise ne peut être injectée),
 * puis gras, italique et liens sont reconstruits ; chaque lien reprend sa
 * balise d'origine (target, rel…). Un champ dont les liens ne correspondent
 * plus exactement est ignoré : le texte d'origine reste en ligne.
 *
 * Import du JSON en chemin relatif, et des types seulement depuis `blog.ts`
 * (dépendance circulaire sans effet à l'exécution).
 */
import type { Article, ArticleL10n, Block } from "./blog";
import corrections from "./blog-corrections-client.json";

export type ChampEditable = {
  /** Adresse du texte dans l'objet article : « blocks.4.p », « en.faq.2.a ». */
  chemin: string;
  /** Regroupement à l'écran : « Introduction », « Section 2 — <titre H2> », « Questions fréquentes ». */
  section: string;
  libelle: string;
  texte: string;
};

type CorrectionsClient = Record<string, { champs: Record<string, string>; modifieLe?: string; par?: string }>;

/** Fichier écrit par Clickzou (chemin relatif à la racine du dépôt). */
export const FICHIER_CORRECTIONS = "src/lib/blog-corrections-client.json";

/* ─────────── Conversion HTML léger ⇄ texte lisible ─────────── */

const LIEN_HTML = /<a\s[^>]*?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g;
const LIEN_TEXTE = /\[([^\]]+)\]\(([^)]+)\)/g;

/** HTML léger du blog → texte lisible ; `null` s'il contient une balise inattendue. */
export function versTexte(html: string): string | null {
  const t = html
    .replace(LIEN_HTML, (_m, href: string, ancre: string) => `[${ancre}](${href})`)
    .replace(/<strong>([\s\S]*?)<\/strong>/g, "**$1**")
    .replace(/<em>([\s\S]*?)<\/em>/g, "*$1*")
    .replace(/&amp;/g, "&");
  return /<\/?[a-zA-Z]/.test(t) ? null : t;
}

const liensTexte = (t: string) => [...t.matchAll(LIEN_TEXTE)].map((m) => `${m[1]}→${m[2]}`);

/**
 * Texte lisible corrigé → HTML, en reprenant les balises de lien de l'original.
 * `null` si les liens ne sont plus exactement les mêmes (ancre, adresse, ordre).
 */
export function versHtml(texte: string, original: string): string | null {
  const avant = versTexte(original);
  if (avant === null || liensTexte(texte).join("|") !== liensTexte(avant).join("|")) return null;
  const ouvertures = [...original.matchAll(LIEN_HTML)].map((m) => m[0].slice(0, m[0].indexOf(">") + 1));
  let i = 0;
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(LIEN_TEXTE, (_m, ancre: string) => `${ouvertures[i++]}${ancre}</a>`)
    .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+?)\*/g, "<em>$1</em>");
}

/** Texte brut (FAQ, H3 : rendus comme texte par React) : aucune balise admise. */
const texteBrutValide = (t: string) => !/[<>]/.test(t);

/* ─────────── Champs modifiables ─────────── */

type Nature = "html" | "brut";

/**
 * Nature d'un chemin relatif à une version (FR ou EN), ou `null` s'il est
 * verrouillé. Le type du bloc est vérifié : `blocks.3.h2` n'est jamais modifiable.
 */
function nature(v: ArticleL10n, relatif: string): Nature | null {
  if (relatif === "intro") return "html";
  let m = /^blocks\.(\d+)\.(p|h3)$/.exec(relatif);
  if (m) {
    const b = v.blocks[Number(m[1])] as Record<string, unknown> | undefined;
    return b && typeof b[m[2]] === "string" ? (m[2] === "p" ? "html" : "brut") : null;
  }
  m = /^blocks\.(\d+)\.ul\.(\d+)$/.exec(relatif);
  if (m) {
    const b = v.blocks[Number(m[1])];
    return b && "ul" in b && typeof b.ul[Number(m[2])] === "string" ? "html" : null;
  }
  m = /^faq\.(\d+)\.(q|a)$/.exec(relatif);
  if (m) return v.faq[Number(m[1])] ? "brut" : null;
  return null;
}

/** La version visée par un chemin (« en. » = anglais) et le chemin relatif à elle. */
function cible(a: Article, chemin: string): { v: ArticleL10n; relatif: string } | null {
  if (chemin.startsWith("en.")) return a.en ? { v: a.en, relatif: chemin.slice(3) } : null;
  return { v: a, relatif: chemin };
}

function lire(v: ArticleL10n, relatif: string): string | undefined {
  let courant: unknown = v;
  for (const e of relatif.split(".")) {
    if (courant === null || typeof courant !== "object") return undefined;
    courant = (courant as Record<string, unknown>)[e];
  }
  return typeof courant === "string" ? courant : undefined;
}

function champsDe(v: ArticleL10n, prefixe: string, etiquette: string): ChampEditable[] {
  const champs: ChampEditable[] = [];
  const ajouter = (relatif: string, section: string, libelle: string, html: string, n: Nature) => {
    const texte = n === "html" ? versTexte(html) : html;
    if (texte && texte.trim()) champs.push({ chemin: prefixe + relatif, section: etiquette + section, libelle, texte });
  };
  ajouter("intro", "Introduction", "Introduction", v.intro, "html");

  // Les H2 ne sont pas modifiables : ils servent d'en-tête de section à l'écran.
  let section = "Début de l'article";
  let n = 0;
  v.blocks.forEach((b: Block, bi) => {
    if ("h2" in b) {
      n += 1;
      section = `Section ${n} — ${b.h2}`;
    } else if ("p" in b) ajouter(`blocks.${bi}.p`, section, "Paragraphe", b.p, "html");
    else if ("h3" in b) ajouter(`blocks.${bi}.h3`, section, "Intertitre", b.h3, "brut");
    else b.ul.forEach((li, i) => ajouter(`blocks.${bi}.ul.${i}`, section, `Liste — élément ${i + 1}`, li, "html"));
  });

  v.faq.forEach((f, fi) => {
    ajouter(`faq.${fi}.q`, "Questions fréquentes", `Question ${fi + 1}`, f.q, "brut");
    ajouter(`faq.${fi}.a`, "Questions fréquentes", `Réponse ${fi + 1}`, f.a, "brut");
  });
  return champs;
}

/** Les textes modifiables d'un article : français, puis anglais. */
export function champsEditables(a: Article): ChampEditable[] {
  return [...champsDe(a, "", ""), ...(a.en ? champsDe(a.en, "en.", "Version anglaise — ") : [])];
}

/* ─────────── Application des corrections ─────────── */

/** Pose un texte à son adresse, seulement si un texte s'y trouve déjà. */
function poser(objet: unknown, relatif: string, texte: string) {
  const etapes = relatif.split(".");
  let courant: unknown = objet;
  for (const e of etapes.slice(0, -1)) {
    if (courant === null || typeof courant !== "object") return;
    courant = (courant as Record<string, unknown>)[e];
  }
  const dernier = etapes.at(-1)!;
  if (courant && typeof courant === "object" && typeof (courant as Record<string, unknown>)[dernier] === "string") {
    (courant as Record<string, unknown>)[dernier] = texte;
  }
}

export function appliquerCorrections(a: Article): Article {
  const c = (corrections as CorrectionsClient)[a.slug];
  if (!c?.champs) return a;
  const copie = structuredClone(a);
  for (const [chemin, texte] of Object.entries(c.champs)) {
    if (typeof texte !== "string" || !texte.trim()) continue;
    const t = cible(a, chemin);
    if (!t) continue;
    const n = nature(t.v, t.relatif);
    const original = lire(t.v, t.relatif);
    if (!n || original === undefined) continue;
    const valeur = n === "html" ? versHtml(texte, original) : texteBrutValide(texte) ? texte : null;
    if (valeur === null) {
      console.warn(`[blog] correction ignorée (${a.slug} › ${chemin}) : liens modifiés ou balise interdite`);
      continue;
    }
    const versionCopie = chemin.startsWith("en.") ? copie.en : copie;
    poser(versionCopie, t.relatif, valeur);
  }
  return copie;
}
