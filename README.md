# Site vitrine bilingue (Astro, statique)

## Installer / lancer
    npm ci            # installer (registre npm uniquement)
    npm run dev       # serveur local
    npm run build     # produit dist/ (12 pages + sitemap + robots)
    npm run verify    # contrôles sur dist/ (pages, hreflang, h1, poids, JS, mailto, contraste AA)

## Où modifier
- Textes de page : `src/content/{fr,en}/<page>.md` (frontmatter `title`, `description`, + listes `services` / `cases`).
- Nom, téléphone, e-mail, SIRET, adresse, hébergeur, sujet/corps du mail de rappel (`callbackSubject`, `callbackBody`), libellés d'interface : `src/data/site.json`.
- Mentions légales : bloc éditeur généré depuis `site.json`, le reste dans `src/content/{fr,en}/mentions-legales.md` (page `/mentions-legales/` et `/en/mentions-legales/`).
- Portrait (carré) : remplacer `public/img/portrait-400.jpg`, `portrait-800.jpg`, `portrait-800.webp` ; texte alternatif dans `ui.<lang>.portraitAlt`.
- Domaine : `site` dans `astro.config.mjs`, `Sitemap:` dans `public/robots.txt`, ajouter `public/CNAME`.
- Polices : Lora et DM Sans (OFL) sont dans `public/fonts/`, déclarées en tête de `src/styles/global.css`.

## Ajouter une page
1. Ajouter le slug dans `SLUGS` (et `NAV_SLUGS` si la page est dans le menu) dans `src/lib/content.ts`.
2. Créer `src/content/fr/<slug>.md` et `src/content/en/<slug>.md`.
3. Ajouter le libellé dans `ui.<lang>.nav` de `site.json`.
Le gabarit est `src/pages/[...slug].astro` (ajouter un bloc conditionnel si la page a un rendu spécifique).

## Ajouter une langue (ex. `de`)
1. Ajouter `'de'` à `LANGS` et au type `Lang` (`src/lib/content.ts`).
2. Créer `src/content/de/*.md` (un fichier par page).
3. Ajouter `ui.de` dans `site.json` et `jobTitle.de`.
4. Déclarer `de: 'de-DE'` dans l'option `i18n` du sitemap (`astro.config.mjs`).
5. Le bouton de bascule n'affiche que « l'autre » langue : pour 3 langues et plus, adapter `Header.astro` (boucle sur les langues).

## Déploiement
`.github/workflows/deploy.yml` est écrit mais non activé (déclenchement manuel, `push` commenté).
