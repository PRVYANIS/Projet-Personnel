# Cahier des charges — Site vitrine du Bureau d’études Kamel Moulouel

**Version :** 1.0 — 15 octobre 2026  
**Objet :** Document de cadrage pour conception UI/UX et développement.

## 1. Synthèse du projet
Créer un site vitrine premium, moderne et crédible pour un bureau d’études implanté en Algérie. Le site doit capter l’attention, valoriser le sérieux technique et la capacité à intervenir sur des projets immobiliers d’envergure, puis faciliter une prise de contact directe. Il ne s’agit ni d’une boutique ni d’une plateforme de commande en ligne.

## 2. Objectifs et indicateurs
- **Objectif principal :** renforcer la visibilité et l’image professionnelle du bureau d’études afin de susciter des demandes de contact qualifiées.
- **Objectifs secondaires :** présenter les compétences, illustrer le type de projets traités et rassurer les prospects.
- **Indicateurs proposés :** clics sur téléphone, clics sur adresse e-mail, messages reçus via formulaire, consultation des sections Projets et Services.

## 3. Publics cibles
- **Cible prioritaire :** promoteurs immobiliers et professionnels développant des immeubles résidentiels, ensembles de logements ou lotissements.
- **Cible secondaire :** particuliers souhaitant construire ou faire étudier une villa ou un autre projet.
- Le discours et les visuels doivent prioriser la rigueur, la maîtrise des projets et la lisibilité technique plutôt qu’une approche uniquement décorative.

## 4. Positionnement et identité
- **Dénomination de travail :** « Bureau d’études Kamel Moulouel » (orthographe et dénomination légale à valider).
- **Style :** sobre, contemporain, élégant, technique, institutionnel sans être froid.
- **Palette indicative :** bleu nuit `#101F32`, anthracite `#15191F`, blanc cassé `#F5F6F7`, gris acier `#8B98A7` ; accent discret à déterminer.
- **Typographies proposées :** sans-serif contemporaine, très lisible, hiérarchie forte et espacement généreux.
- **Logo :** non disponible à ce stade ; prévoir une signature typographique temporaire, sans inventer de logo définitif.

## 5. Périmètre fonctionnel
Un site **one-page en français**, responsive, avec navigation par ancres vers les sections. L’architecture doit permettre une évolution ultérieure vers plusieurs langues sans l’implémenter dans la première version.

### Sections recommandées, dans l’ordre
1. **Accueil / Hero :** image ou rendu architectural de logements collectifs, accroche concise, sous-texte de positionnement et appel à l’action « Nous contacter ».
2. **Présentation :** identité du bureau, approche et proposition de valeur ; éviter les chiffres, qualifications ou années d’expérience non confirmés.
3. **Domaines d’intervention :** cartes de services dont les intitulés exacts seront validés (études techniques, conception, plans, modélisation, suivi, etc., uniquement si réellement proposés).
4. **Projets / univers visuel :** galerie éditoriale présentant principalement immeubles, logements et lotissements ; villas et plans en complément.
5. **Méthode de travail :** processus simple, par exemple échange initial, étude, conception, accompagnement, sous réserve de validation métier.
6. **Contact :** téléphone cliquable, e-mail cliquable et formulaire de contact ; localisation générale uniquement si confirmée.
7. **Pied de page :** nom du bureau, coordonnées validées, liens d’ancrage, mentions légales et politique de confidentialité.

## 6. Direction artistique et expérience utilisateur
- Composition minimaliste, forte grille d’alignement, marges confortables et images grand format.
- Animations verticales fluides et discrètes au défilement : apparition progressive, légers déplacements, transitions de section sans rupture.
- Navigation sticky discrète, ancres avec défilement doux et indication de section active si pertinente.
- Aucun effet qui gêne la lecture, aucun défilement forcé, aucune animation longue ou excessive.
- Respect de `prefers-reduced-motion` ; animations réduites ou supprimées pour les personnes qui le demandent.
- Version mobile pensée spécifiquement : navigation accessible, textes courts, visuels recadrés et CTA de contact évident.

## 7. Visuels et confidentialité
- Employer des visuels originaux synthétiques ou génériques : rendus 3D d’immeubles et d’ensembles résidentiels, plans 2D, maquettes volumétriques et vues techniques.
- Ne pas utiliser de plans réels, dossiers clients, adresses, noms de projets ou documents confidentiels du bureau sans autorisation.
- Ne pas présenter les visuels fictifs comme des réalisations effectives : utiliser « Illustrations conceptuelles », « Visuels de démonstration » ou un libellé équivalent.
- Prévoir des emplacements remplaçables et un système de nommage des assets ; fournir des versions optimisées WebP/AVIF et leurs textes alternatifs.

## 8. Parcours de conversion et contact
- CTA principal « Nous contacter » visible dans le premier écran et répété dans la page sans insistance excessive.
- Liens téléphone via `tel:` et e-mail via `mailto:`, avec coordonnées à fournir.
- Formulaire minimal recommandé : nom, e-mail ou téléphone, type de projet (optionnel), message et consentement requis selon les obligations applicables.
- Envoi réel via service ou backend sécurisé, validation des champs, protection anti-spam, message de confirmation et gestion claire des erreurs.
- Ne pas afficher de formulaire factice : si l’envoi n’est pas opérationnel, retirer le formulaire avant mise en ligne.

## 9. Exigences techniques
- Site rapide, responsive sur mobile, tablette et ordinateur ; compatibilité avec les navigateurs modernes.
- HTML sémantique, contraste et navigation clavier soignés, textes alternatifs, labels de formulaire et focus visibles.
- SEO de base : `title` et `meta description` uniques, structure H1–Hn cohérente, Open Graph, sitemap, `robots.txt`, données structurées adaptées si pertinentes.
- Optimisation : images adaptées aux écrans, lazy-loading hors hero, polices maîtrisées, limitation des scripts d’animation.
- Sécurité : HTTPS, secrets non exposés côté client, traitement sécurisé des messages, anti-spam et mises à jour des dépendances.
- Éviter les cookies non essentiels par défaut ; si analytics ou traceurs sont ajoutés, gérer l’information et le consentement applicables.
- Architecture et composants maintenables ; technologie proposée par le prestataire, avec justification (ex. React/Next.js ou solution statique légère).

## 10. Contenus à produire
- Textes professionnels en français : titre principal, proposition de valeur, présentation, services, légendes et appels à l’action.
- Le contenu métier devra être relu et approuvé par Kamel Moulouel ; ne pas inventer diplômes, agréments, références clients ou réalisations.
- Prévoir une courte mention expliquant que les images génériques sont illustratives et non des projets réalisés.

## 11. Livrables attendus
- Maquette responsive desktop et mobile ou prototype validable avant développement.
- Code source complet, structuré et commenté lorsque nécessaire, avec instructions d’installation et de lancement.
- Assets graphiques optimisés, composants réutilisables et styles cohérents.
- Formulaire de contact fonctionnel, si retenu, et procédure de configuration du service d’envoi.
- Déploiement sur hébergement à confirmer, configuration du domaine, HTTPS et tests de recette.
- Documentation courte pour modifier les textes, images, coordonnées et éventuellement ajouter une langue.

## 12. Critères de recette
- La page est utilisable sur téléphone, tablette et ordinateur, sans débordement horizontal.
- Toutes les ancres, boutons, liens `tel:` et `mailto:` fonctionnent.
- Les animations restent fluides, n’empêchent pas la lecture et respectent la réduction des mouvements.
- Le formulaire, s’il existe, envoie réellement les demandes et gère les erreurs.
- Les contenus fictifs sont explicitement signalés ; aucune donnée confidentielle n’apparaît.
- Le site est accessible au clavier et dispose de bases SEO et de performances satisfaisantes.

## 13. Phasage proposé
1. Validation du contenu métier, de la charte et de la structure.
2. Wireframe et maquettes.
3. Création et sélection des visuels.
4. Développement et intégration.
5. Tests, corrections et validation.
6. Déploiement et transfert des accès.

## 14. Points à confirmer avant développement
- Dénomination exacte, statut et éventuelle ville du bureau.
- Liste réelle des prestations et types de projets pris en charge.
- Coordonnées publiques (téléphone, e-mail) et canal de réception des messages.
- Références réelles autorisées à publication ou choix d’une galerie entièrement illustrative.
- Existence d’un nom de domaine, hébergement et budget prévisionnel.
- Choix du formulaire et de son prestataire technique, mentions légales et politique de confidentialité.
- Éventuelles préférences pour la charte graphique et exemples de sites appréciés.

**Statut :** Document de cadrage prêt à transmettre pour consultation / devis. Les propositions et éléments « à confirmer » ne constituent pas des décisions métier définitives.
