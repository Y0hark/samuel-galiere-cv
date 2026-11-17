import site from '../data/site.json';

export type Lang = 'fr' | 'en';
export const LANGS: Lang[] = ['fr', 'en'];
export const DEFAULT_LANG: Lang = 'fr';
export const SLUGS = ['', 'services', 'cas', 'a-propos', 'contact', 'mentions-legales'] as const;
/** Pages affichées dans la navigation (la page légale n'est liée que depuis le pied de page). */
export const NAV_SLUGS = ['', 'services', 'cas', 'a-propos', 'contact'] as const;

const files = import.meta.glob('/src/content/*/*.md', { eager: true }) as Record<string, any>;

export function getPage(lang: Lang, slug: string) {
  const f = files[`/src/content/${lang}/${slug || 'index'}.md`];
  if (!f) throw new Error(`Missing content: ${lang}/${slug || 'index'}.md`);
  return { data: f.frontmatter as Record<string, any>, Content: f.Content };
}
export const ui = (lang: Lang) => (site.ui as Record<string, any>)[lang];
/** Chemin d'une page ("" = accueil) dans une langue. */
export function pagePath(lang: Lang, slug: string) {
  const base = lang === DEFAULT_LANG ? '/' : `/${lang}/`;
  return slug ? `${base}${slug}/` : base;
}
export { site };
