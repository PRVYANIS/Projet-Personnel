// Renseigner ici les coordonnées et informations vérifiées avant publication.
// Cette dénomination est une dénomination de travail, à valider.
export const site = {
  name: 'Bureau d’études Kamal Moulouel',
  shortName: 'Kamal Moulouel',
  tagline: 'Donner forme aux idées, avec méthode.',
  country: 'Algérie',
  email: 'kamal.moulouel@gmail.com',
  phone: '',
  phoneDisplay: '+213 (0) 00 00 00 00',
  phoneProvisional: true,
  city: 'Azazga',
  address: 'Rue des Chouhada, Azazga, Tizi Ouzou — Kabylie, Algérie',
  region: 'Tizi Ouzou · Kabylie',
  legalName: '',
  legalStatus: '',
  hostName: '',
  hostAddress: '',
  hostContact: '',
  contactEndpoint: '',
  servicesValidated: false,
  siteUrl: '',
}

export const navigation = [
  { id: 'accueil', label: 'Accueil' },
  { id: 'bureau', label: 'Le bureau' },
  { id: 'expertises', label: 'Expertises' },
  { id: 'projets', label: 'Galerie' },
  { id: 'methode', label: 'Méthodologie' },
  { id: 'contact', label: 'Contact' },
]

// Domaines envisagés — à confirmer avec le bureau avant de les présenter
// comme des prestations disponibles. Aucun agrément ni compétence spécifique
// n’est attesté par cette liste.
export const services = [
  {
    number: '01',
    title: 'Études techniques',
    description:
      'Analyser les besoins, les contraintes et les choix techniques pour poser les bases du projet.',
    icon: 'structure',
  },
  {
    number: '02',
    title: 'Conception & plans',
    description:
      'Traduire une intention en documents lisibles et articuler les volumes, les espaces et les usages.',
    icon: 'plan',
  },
  {
    number: '03',
    title: 'Modélisation 3D',
    description:
      'Explorer les volumes et faciliter la compréhension du bâtiment grâce à la représentation en trois dimensions.',
    icon: 'model',
  },
  {
    number: '04',
    title: 'Accompagnement technique',
    description:
      'Clarifier les questions du projet et structurer les échanges autour du périmètre de la mission.',
    icon: 'compass',
  },
]

// Démarche indicative : les étapes et livrables seront adaptés à chaque
// demande après confirmation du périmètre des prestations.
export const steps = [
  {
    number: '01',
    title: 'Comprendre le besoin',
    description:
      'Échanger sur le contexte, les objectifs et les documents disponibles pour clarifier la demande.',
  },
  {
    number: '02',
    title: 'Définir le cadre',
    description:
      'Préciser les possibilités d’intervention, les informations nécessaires et les livrables envisageables.',
  },
  {
    number: '03',
    title: 'Développer la réponse',
    description:
      'Organiser le travail prévu et les échanges de validation selon le périmètre convenu.',
  },
  {
    number: '04',
    title: 'Partager les livrables',
    description:
      'Prévoir une restitution lisible et un échange sur les documents établis, selon la mission retenue.',
  },
]
