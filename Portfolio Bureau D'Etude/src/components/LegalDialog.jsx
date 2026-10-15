import { useEffect, useId, useRef } from 'react'
import { site } from '../data/site'

function Mentions() {
  return (
    <>
      <p>
        Ce site est une présentation provisoire du projet « {site.name} ».
        Cette dénomination de travail doit être validée avant publication.
      </p>
      <h3>Identification</h3>
      <dl className="legal-details">
        <div><dt>Pays</dt><dd>{site.country}</dd></div>
        <div><dt>Dénomination légale</dt><dd>{site.legalName || 'À renseigner après validation.'}</dd></div>
        <div><dt>Statut</dt><dd>{site.legalStatus || 'À renseigner après validation.'}</dd></div>
        <div><dt>Ville</dt><dd>{site.city || 'Non communiquée.'}</dd></div>
        <div><dt>Adresse</dt><dd>{site.address || 'À renseigner.'}</dd></div>
        <div><dt>Région</dt><dd>{site.region || 'À renseigner.'}</dd></div>
        <div><dt>Courriel</dt><dd>{site.email || 'À renseigner.'}</dd></div>
        <div>
          <dt>Téléphone</dt>
          <dd>
            {site.phoneProvisional
              ? `${site.phoneDisplay} — numéro provisoire, à remplacer.`
              : site.phone || 'À renseigner.'}
          </dd>
        </div>
      </dl>
      <p>
        L’identité du responsable de publication et les informations complètes
        de l’éditeur restent à confirmer.
      </p>
      <h3>Hébergement</h3>
      <p>
        {site.hostName || 'Hébergeur à renseigner avant publication.'}
        {site.hostAddress ? ` Adresse : ${site.hostAddress}.` : ''}
        {site.hostContact ? ` Contact : ${site.hostContact}.` : ''}
      </p>
      <h3>Contenus et illustrations</h3>
      <p>
        {site.servicesValidated
          ? 'Le périmètre de chaque mission doit être précisé lors d’un échange avec le bureau.'
          : 'Les domaines présentés sont envisagés et restent à confirmer. Ils ne constituent pas une attestation de compétences, d’agréments ou de prestations disponibles.'}
      </p>
      <p>
        Les visuels générés par IA sont des illustrations d’ambiance.
        Ils ne représentent pas des réalisations, des clients ou des chantiers
        du bureau.
      </p>
    </>
  )
}

function Privacy() {
  return (
    <>
      <p>
        Cette information décrit la version actuelle du site. Les informations
        relatives à l’éditeur et à l’hébergement restent à compléter avant
        publication.
      </p>
      <h3>Contact et transmission des données</h3>
      <p>
        Le site ne propose pas de formulaire de contact. Le lien de contact par
        courriel ouvre votre application de messagerie externe avec l’adresse
        {` ${site.email} `}comme destinataire. Aucun courriel n’est envoyé
        automatiquement par le site : vous choisissez de l’envoyer depuis votre
        messagerie.
      </p>
      <p>
        Si vous envoyez un courriel, son contenu et vos coordonnées sont
        transmis au destinataire par les services de messagerie utilisés. Les
        modalités de gestion de ces échanges et leur durée de conservation
        restent à préciser par le responsable du bureau.
      </p>
      <h3>Cookies et mesure d’audience</h3>
      <p>
        Cette version du site n’installe pas de cookies et n’intègre aucun
        traceur publicitaire ni outil de mesure d’audience. Elle ne conserve
        aucune information dans le stockage local de votre navigateur.
      </p>
      <h3>Hébergement et informations à compléter</h3>
      <p>
        Le traitement éventuel des journaux techniques par l’hébergeur devra
        être documenté une fois celui-ci choisi. Les coordonnées du responsable,
        les destinataires et les modalités de conservation des éventuelles
        données de contact restent à renseigner.
      </p>
    </>
  )
}

export default function LegalDialog({ type, onClose }) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const isOpen = type === 'mentions' || type === 'privacy'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!isOpen) {
      if (dialog.open) dialog.close()
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!dialog.open) dialog.showModal()

    return () => {
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [isOpen])

  function handleBackdropClick(event) {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const outside =
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    if (outside) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="legal-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={handleBackdropClick}
    >
      <div className="legal-dialog-header">
        <h2 id={titleId}>
          {type === 'privacy' ? 'Confidentialité' : 'Mentions du site'}
        </h2>
        <button type="button" className="legal-dialog-close" onClick={onClose} autoFocus>
          Fermer <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="legal-dialog-content">
        {type === 'privacy' ? <Privacy /> : <Mentions />}
      </div>
    </dialog>
  )
}
