import { useEffect, useRef, useState } from 'react'
import { MotionConfig, motion, useReducedMotion } from 'motion/react'
import { site, navigation, services, steps } from './data/site.js'
import { images } from './data/images.js'
import { publicAssetUrl, publicAssetSrcSet } from './utils/public-assets.js'
import LegalDialog from './components/LegalDialog.jsx'

function Icon({ name = 'arrow', className = '', ...props }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    diagonal: <path d="M6 18 18 6M6 6h12v12" />,
    down: <path d="M12 4v16m-6-6 6 6 6-6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <><path d="M3 8h18M3 16h18" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    phone: <path d="m5 3 4 1-1 5a14 14 0 0 0 7 7l5-1 1 4c-6 6-24-12-18-16Z" />,
    structure: <><path d="M4 21V7l8-4 8 4v14M4 10h16M4 16h16M9 5v16m6-16v16M2 21h20" /></>,
    plan: <><path d="M3 3h18v18H3zM3 10h10V3m0 7v11m0-7h8M7 3v3M3 17h4" /></>,
    model: <><path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5m-9 5v10M7.5 4.5l9 5v10" /></>,
    compass: <><circle cx="12" cy="6" r="2" /><path d="m11 8-6 13m8-13 6 13M7 17h10M12 2v2" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`} aria-hidden="true" {...props}>{paths[name] || paths.arrow}</svg>
}

function Picture({ image, className = '', sizes = '(max-width: 760px) 100vw, 50vw', priority = false, ...props }) {
  return <picture className={className}>
    <source type="image/avif" srcSet={publicAssetSrcSet(image.avifSrcSet)} sizes={sizes} />
    <img src={publicAssetUrl(image.src)} srcSet={publicAssetSrcSet(image.srcSet)} sizes={sizes} width={image.width} height={image.height} alt={image.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" {...props} />
  </picture>
}

function Reveal({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion()
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.55, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function SectionLabel({ number, children, light = false }) {
  return <p className={`section-label ${light ? 'section-label-light' : ''}`}><span>{number}</span><span className="label-rule" />{children}</p>
}

function Header() {
  const [active, setActive] = useState('accueil')
  const dialog = useRef(null)
  const trigger = useRef(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 })
    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const media = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => { if (media.matches) dialog.current?.close() }
    media.addEventListener('change', closeOnDesktop)
    return () => { document.body.style.overflow = previous; media.removeEventListener('change', closeOnDesktop) }
  }, [open])

  const closeMenu = () => dialog.current?.close()
  return <>
    <header className="site-header">
      <div className="header-inner container">
        <a href="#accueil" className="brand"><span className="brand-descriptor">Bureau d’études</span><span className="brand-name">Kamal Moulouel<span className="brand-dot">.</span></span></a>
        <nav className="desktop-nav" aria-label="Navigation principale">{navigation.filter((item) => item.id !== 'accueil' && item.id !== 'contact').map((item) => <a key={item.id} href={`#${item.id}`} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}</nav>
        <a href="#contact" className="header-contact">Nous contacter<Icon name="diagonal" /></a>
        <button ref={trigger} className="menu-trigger" aria-label="Ouvrir le menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => { dialog.current.showModal(); setOpen(true) }}><Icon name="menu" /></button>
      </div>
    </header>
    <dialog id="mobile-navigation" ref={dialog} className="mobile-menu" aria-labelledby="menu-title" onClose={() => { setOpen(false); trigger.current?.focus() }} onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}>
      <div className="mobile-menu-top"><p id="menu-title">Navigation</p><button className="icon-button" aria-label="Fermer le menu" onClick={closeMenu}><Icon name="close" /></button></div>
      <nav aria-label="Navigation mobile">{navigation.map((item, index) => <a key={item.id} href={`#${item.id}`} onClick={closeMenu} aria-current={active === item.id ? 'location' : undefined}><span aria-hidden="true">0{index + 1}</span>{item.label}<Icon name="diagonal" /></a>)}</nav>
      <p className="mobile-menu-location">Azazga · Tizi Ouzou · Algérie</p>
    </dialog>
  </>
}

function Hero() {
  const reduced = useReducedMotion()
  return <section id="accueil" className="hero" aria-labelledby="hero-title">
    <Picture image={images.residence} className="hero-picture" priority sizes="100vw" />
    <div className="hero-overlay" />
    <div className="hero-grid" aria-hidden="true" />
    <div className="container hero-content">
      <motion.div initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: 'easeOut' }}>
        <p className="eyebrow hero-eyebrow"><span />Bureau d’études · Ingénierie du bâtiment</p>
        <h1 id="hero-title">La précision technique.<br /><span>La vision d’ensemble.</span></h1>
        <p className="hero-description">Penser le bâtiment dans sa globalité.<br className="desktop-break" /> Donner à chaque projet des bases claires.</p>
        <div className="hero-actions"><a href="#contact" className="button button-white">Nous contacter<Icon name="diagonal" /></a><a href="#expertises" className="hero-secondary">Découvrir nos domaines<Icon /></a></div>
      </motion.div>
    </div>
    <div className="container hero-bottom"><a href="#bureau" className="scroll-link"><span className="scroll-circle"><Icon name="down" /></span>Explorer le bureau</a><p>Logements collectifs<br /><span>Illustration conceptuelle · Image générée par IA</span></p></div>
    <span className="hero-coordinate" aria-hidden="true">ÉTUDE / CONCEPTION / VISION</span>
  </section>
}

function Bureau() {
  return <section id="bureau" className="section section-bureau" aria-labelledby="bureau-title">
    <div className="container">
      <SectionLabel number="01">Le bureau</SectionLabel>
      <div className="intro-grid">
        <Reveal><h2 id="bureau-title">Des idées claires.<br /><span className="text-muted">Des bases solides.</span></h2></Reveal>
        <Reveal delay={0.08}><p className="lead">Une approche du bâtiment où la réflexion technique donne du sens à chaque ligne.</p><p className="body-copy">À Azazga, le Bureau d’études Kamal Moulouel développe son identité autour d’une conviction : un projet se construit d’abord par la compréhension de ses enjeux, de son contexte et de ses contraintes.</p><p className="body-copy">Logements collectifs, ensembles résidentiels ou projets individuels : la lisibilité des choix et la cohérence d’ensemble guident cette démarche.</p><a href="#methode" className="text-link">Comprendre notre approche<Icon name="diagonal" /></a></Reveal>
      </div>
      <Reveal className="bureau-visual">
        <Picture image={images.structure} sizes="(max-width: 760px) 100vw, 70vw" />
        <div className="visual-note"><span className="small-caps">De la structure à l’ensemble</span><p>Comprendre les éléments.<br />Penser leurs interactions.</p><span className="note-line" /><span className="visual-note-bottom">Une démarche de précision</span></div>
        <p className="image-caption">Ossature en béton armé · Illustration générée par IA</p>
      </Reveal>
    </div>
  </section>
}

function Expertises() {
  return <section id="expertises" className="section section-expertises" aria-labelledby="expertises-title">
    <div className="container">
      <SectionLabel number="02">Domaines d’intervention</SectionLabel>
      <div className="section-heading"><Reveal><h2 id="expertises-title">Une lecture complète<br />de votre projet.</h2></Reveal><Reveal><p className="section-summary">Du premier échange à la représentation technique, des domaines complémentaires pour penser le bâtiment avec méthode.</p><p className="provisional-note">{site.servicesValidated ? 'Le périmètre de chaque mission est défini ensemble.' : 'Domaines envisagés · Périmètre des prestations à confirmer avec le bureau.'}</p></Reveal></div>
      <div className="services-grid">{services.map((service, index) => <Reveal className="service-card" key={service.number} delay={index * 0.04}><div className="service-top"><Icon name={service.icon} /><span>{service.number}</span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-bottom"><span>Définir votre besoin</span><a href="#contact" className="service-action" aria-label={`Échanger à propos de : ${service.title}`}><Icon name="diagonal" /></a></div></Reveal>)}</div>
      <p className="expertise-footnote"><span className="status-dot" />Chaque projet commence par un échange sur vos besoins.</p>
    </div>
  </section>
}

const galleryItems = [
  { image: 'maquette', category: 'collectif', title: 'Penser l’ensemble résidentiel', detail: 'Maquette volumétrique · Logements collectifs', tags: ['collectif', 'technique'] },
  { image: 'lotissement', category: 'collectif', title: 'Organiser les volumes et les usages', detail: 'Vue d’ensemble · Lotissement résidentiel', tags: ['collectif'] },
  { image: 'plan', category: 'technique', title: 'Rendre l’espace lisible', detail: 'Plan d’étage · Quatre logements', tags: ['technique'] },
  { image: 'villaAxono', category: 'individuel', title: 'Explorer un projet individuel', detail: 'Axonométrie · Habitat individuel', tags: ['individuel', 'technique'] },
]
const filters = [{ id: 'tous', label: 'Tous les visuels' }, { id: 'collectif', label: 'Ensembles résidentiels' }, { id: 'technique', label: 'Plans & modèles' }, { id: 'individuel', label: 'Habitat individuel' }]

function Gallery() {
  const [filter, setFilter] = useState('tous')
  const [selected, setSelected] = useState(null)
  const dialog = useRef(null)
  const filtered = galleryItems.filter((item) => filter === 'tous' || item.tags.includes(filter))
  const showImage = (item) => { setSelected(item); dialog.current.showModal() }

  useEffect(() => {
    if (!selected) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [selected])

  return <section id="projets" className="section section-gallery" aria-labelledby="gallery-title">
    <div className="container">
      <SectionLabel number="03">Univers visuel</SectionLabel>
      <div className="section-heading"><Reveal><h2 id="gallery-title">De l’idée<br /><span className="text-muted">à la représentation.</span></h2></Reveal><Reveal><p className="section-summary">Volumes, structures, espaces. Une sélection de visuels pour explorer différents regards sur le bâtiment.</p><p className="gallery-disclaimer">Illustrations conceptuelles générées par IA. Ces images ne représentent pas des réalisations du bureau.</p></Reveal></div>
      <div className="gallery-filters" role="group" aria-label="Filtrer les illustrations">{filters.map((item) => <button key={item.id} type="button" aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}{filter === item.id && <span aria-hidden="true"> /</span>}</button>)}</div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{filtered.length} illustration{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}.</p>
      <div className="gallery-grid">{filtered.map((item) => <article key={item.image} className={`gallery-card ${item.image === 'plan' ? 'gallery-card-plan' : ''}`}>
        <button className="gallery-image-button" onClick={() => showImage(item)} aria-label={`Agrandir : ${item.title} — Illustration conceptuelle`}><Picture image={images[item.image]} sizes="(max-width: 760px) 100vw, 50vw" /><span className="gallery-image-tag">Illustration conceptuelle</span><span className="gallery-expand"><Icon name="plus" /></span></button>
        <div className="gallery-card-caption"><div><p>{item.detail}</p><h3>{item.title}</h3></div><span className="gallery-card-index" aria-hidden="true">0{galleryItems.indexOf(item) + 1}</span></div>
      </article>)}</div>
    </div>
    <dialog ref={dialog} className="image-dialog" aria-labelledby="image-dialog-title" onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current.close() }}>
      {selected && <div className="image-dialog-inner"><div className="image-dialog-top"><h3 id="image-dialog-title">{selected.title}</h3><button className="icon-button" aria-label="Fermer l’illustration" onClick={() => dialog.current.close()}><Icon name="close" /></button></div><Picture image={images[selected.image]} sizes="90vw" priority /><p>Illustration conceptuelle générée par IA · Aucune réalisation réelle présentée</p></div>}
    </dialog>
  </section>
}

function Method() {
  return <section id="methode" className="section section-method" aria-labelledby="method-title"><div className="container">
    <SectionLabel number="04" light>Notre démarche</SectionLabel>
    <div className="section-heading"><Reveal><h2 id="method-title">Chaque étape compte.<br /><span>Chaque détail aussi.</span></h2></Reveal><Reveal><p className="section-summary">Un cadre de travail lisible, du besoin initial aux choix techniques. Une démarche indicative, à adapter au périmètre de chaque mission.</p></Reveal></div>
    <div className="method-grid">{steps.map((step, index) => <Reveal key={step.number} className="method-step" delay={index * 0.06}><div className="method-number"><span>{step.number}</span><Icon name="plus" /></div><h3>{step.title}</h3><p>{step.description}</p></Reveal>)}</div>
    <div className="method-closing"><span className="crosshair" aria-hidden="true" /><p>La clarté dans les échanges.<span> La cohérence dans les choix.</span></p><a href="#contact" className="text-link text-link-light">Parlons de votre projet<Icon name="diagonal" /></a></div>
  </div></section>
}

function Contact() {
  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent('Prise de contact — Projet de bâtiment')}`
  return <section id="contact" className="section section-contact" aria-labelledby="contact-title"><div className="container">
    <SectionLabel number="05">Entrons en contact</SectionLabel>
    <div className="contact-grid"><Reveal><p className="eyebrow contact-eyebrow">Une idée, un terrain, un projet ?</p><h2 id="contact-title">Donnons forme<br />à votre réflexion<span className="contact-period">.</span></h2><p className="contact-description">Présentez-nous votre besoin, sa localisation et les premières questions que vous vous posez. Le dialogue est le premier trait du projet.</p>{site.email && <a className="button button-navy" href={emailHref}>Écrire au bureau<Icon name="diagonal" /></a>}<p className="contact-small">Votre application de messagerie s’ouvrira.</p></Reveal>
      <Reveal className="contact-details" delay={0.08}>
        <div className="contact-detail"><Icon name="mail" /><div><h3>Par e-mail</h3>{site.email ? <a href={emailHref}>{site.email}<Icon name="diagonal" /></a> : <p>Adresse e-mail à confirmer</p>}</div></div>
        <div className="contact-detail"><Icon name="phone" /><div><h3>Par téléphone {site.phoneProvisional && <span className="provisional-badge">Provisoire</span>}</h3>{site.phone && !site.phoneProvisional ? <a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`}>{site.phoneDisplay || site.phone}<Icon name="diagonal" /></a> : <><p className="provisional-phone">{site.phoneDisplay || 'Numéro à renseigner'}</p><span className="detail-note">Numéro de présentation · à remplacer</span></>}</div></div>
        <div className="contact-detail"><Icon name="pin" /><div><h3>Nous situer</h3><p>Rue des Chouhada, {site.city}</p><span className="detail-note">{site.region} · {site.country}</span></div></div>
        <div className="contact-context"><span className="status-dot" /><p>Le périmètre de votre demande sera précisé lors de notre échange.</p></div>
      </Reveal></div>
  </div></section>
}

function Footer({ onLegal }) {
  return <footer className="site-footer"><div className="container">
    <div className="footer-top"><a href="#accueil" className="brand footer-brand"><span className="brand-descriptor">Bureau d’études</span><span className="brand-name">Kamal Moulouel<span className="brand-dot">.</span></span></a><p>La précision technique.<br />La vision d’ensemble.</p><a href="#accueil" className="back-top">Retour en haut<Icon name="down" /></a></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} · {site.name}</p><div><button onClick={() => onLegal('mentions')}>Mentions légales</button><button onClick={() => onLegal('privacy')}>Confidentialité</button></div><span>Azazga, Algérie</span></div>
    <p className="footer-disclaimer">Signature typographique et contenus métier provisoires, à valider. Visuels conceptuels générés par IA, sans référence à des projets réalisés.</p>
  </div></footer>
}

export default function App() {
  const [legalType, setLegalType] = useState(null)
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#contenu">Aller au contenu</a><Header /><main id="contenu" tabIndex={-1}><Hero /><Bureau /><Expertises /><Gallery /><Method /><Contact /></main><Footer onLegal={setLegalType} /><LegalDialog type={legalType} onClose={() => setLegalType(null)} /></MotionConfig>
}
