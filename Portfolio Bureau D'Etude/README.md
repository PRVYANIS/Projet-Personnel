# Portfolio — Bureau d’études de Kamel Moulouel

Site vitrine React en français consacré au bureau d’études de Kamel Moulouel. Le cahier des charges de référence est `documents/cahier-des-charges.md`.

Les visuels présentent des illustrations générées par IA. Ils ne constituent pas des références de projets réalisés par le bureau.

## Installation et développement

Prérequis : **Node.js 22.12 ou supérieur** et npm. Node.js 24 convient à ce projet.

Dans un terminal ouvert à la racine du portfolio :

```powershell
npm install
npm run dev
```

Ouvrir ensuite l’adresse locale affichée par Vite. Le serveur de développement doit rester actif pendant la consultation.

Les images optimisées sont préparées dans `public/site/media`. Relancer la commande suivante **après remplacement ou modification des images sources**, puis vérifier le rendu :

```powershell
npm run images
```

Cette commande génère les versions WebP et AVIF et régénère `src/data/images.js` à partir des dimensions réelles des sources. Elle conserve les fichiers originaux dans `public/images`. Il n’est pas nécessaire de la lancer à chaque démarrage du site.

### Certificats sous Windows

Si l’installation échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur équivalente de chaîne de certificats, Node.js ne reconnaît pas nécessairement l’autorité de certification utilisée par le système ou le réseau.

Avec Node.js 24, utiliser les certificats système dans la session PowerShell, puis relancer l’installation :

```powershell
$env:NODE_OPTIONS = '--use-system-ca'
npm install
```

Si l’erreur persiste, faire vérifier la chaîne de certificats du système ou du proxy. Ne pas désactiver la vérification TLS : ne pas utiliser `strict-ssl=false` ni `NODE_TLS_REJECT_UNAUTHORIZED=0`.

## Compilation et vérification locale

```powershell
npm run build
npm run preview
```

La compilation produit le dossier `dist`. La commande `preview` permet de consulter cette version localement à l’adresse indiquée dans le terminal.

Sur Windows, les contrôles utilisent automatiquement Chrome ou Edge s’il est installé. Le chemin d’un autre navigateur Chromium peut être fourni dans `CHROME_PATH`. Sans navigateur local, installer celui de Playwright :

```powershell
npx playwright install chromium
npm run test:browser
```

Pour vérifier uniquement les apparitions au défilement avec les animations autorisées : `npm run test:browser -- --motion-only`. Les rapports sont enregistrés dans `test-results/report.json` et `test-results/motion-report.json` ; les captures desktop et mobile se trouvent dans le même dossier.

Ces commandes décrivent la procédure de vérification. Leurs résultats doivent être constatés lors de l’exécution ; ce document ne constitue pas un compte rendu de tests réussis.

## Organisation des fichiers

```text
src/
  App.jsx                       Page principale et interactions
  styles.css                    Mise en page et styles adaptatifs
  data/
    site.js                     Contenus, coordonnées et réglages publics
    images.js                   Manifest des images optimisées, régénéré
  components/
    LegalDialog.jsx             Mentions légales et confidentialité
scripts/
  optimize-images.mjs            Génération WebP et AVIF
  generate-seo.mjs               Génération des éléments SEO
  check-browser.mjs              Vérifications dans le navigateur
public/
  images/                       Images sources conservées
  site/
    media/                      Images dérivées distribuées sur le site
documents/
  cahier-des-charges.md          Cahier des charges de référence
```

Vite utilise `public/site` comme `publicDir`. Les originaux de `public/images` restent dans le projet et ne sont pas copiés dans le site compilé. Seules les versions optimisées de ces images sont distribuées. Ne pas supprimer les sources.

Pour remplacer une illustration, mettre à jour son fichier source et, si son nom change, son entrée dans `scripts/optimize-images.mjs`. Lancer ensuite `npm run images`. Les noms des fichiers dérivés restent en ASCII et les dimensions de leurs variantes ne dépassent jamais celles des originaux.

## Contenus et coordonnées à valider

Les informations publiques se modifient dans `src/data/site.js` :

- Courriel : `kamel.moulouel@gmail.com`.
- Adresse : Rue des Chouhada, Azazga, Tizi Ouzou, Kabylie, Algérie.
- Téléphone : le numéro provisoire commençant par `+213 (0)00…` est fictif et n’est pas cliquable.

Pour activer le lien téléphonique, renseigner un vrai numéro dans `phone`, sa présentation lisible dans `phoneDisplay`, puis mettre `phoneProvisional` à `false`. Conserver l’état provisoire tant que le numéro réel n’est pas fourni.

Les services et leur formulation doivent être relus et confirmés par le bureau avant de passer `servicesValidated` à `true`. Vérifier aussi l’ensemble des textes, les coordonnées et les mentions légales avant publication.

La version initiale utilise un lien `mailto:` pour contacter le bureau, conformément au cahier des charges. Ce lien ouvre le logiciel de messagerie du visiteur ; l’envoi lui appartient. Il n’y a pas de formulaire, de serveur de traitement ni de confirmation artificielle d’envoi.

## Domaine, SEO et mise en ligne

Avant une compilation destinée à la publication, renseigner le vrai domaine HTTPS dans `site.siteUrl`, dans `src/data/site.js`, ou fournir la variable d’environnement `SITE_URL` :

```powershell
$env:SITE_URL = 'https://votre-domaine.fr'
npm run build
```

L’adresse ci-dessus est un exemple à remplacer. La génération SEO utilise le domaine configuré pour les URL absolues du sitemap, de la balise canonique et des métadonnées Open Graph. Sans domaine configuré, le site reste en `noindex` et le fichier `robots.txt` interdit l’exploration de la version provisoire.

Les mentions légales restent à compléter avec le statut et les informations exactes de l’éditeur, ainsi que l’identité et les coordonnées de l’hébergeur. Le nom de domaine, l’hébergement et la configuration HTTPS ne sont pas effectués par la création du projet local. Préparer ces éléments, compiler avec le domaine réel, puis publier le contenu de `dist` sur l’hébergement choisi.
