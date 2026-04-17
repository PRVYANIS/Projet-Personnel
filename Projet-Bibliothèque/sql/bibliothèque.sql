CREATE TABLE livre (
    id_livre INT PRIMARY KEY AUTO_INCREMENT,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    annee_publication INT,
    genre VARCHAR(100)
);

CREATE TABLE utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,/*parceque sql dans l'encodage ne supporte pas le 255 pour UNIQUE*/
    telephone VARCHAR(20),
    date_inscription DATE NOT NULL
);

CREATE TABLE exemplaire (
    id_exemplaire INT PRIMARY KEY AUTO_INCREMENT,
    code_barre VARCHAR(50) NOT NULL UNIQUE,
    etat VARCHAR(100),
    disponible BOOLEAN NOT NULL DEFAULT TRUE,
    id_livre INT NOT NULL,
    FOREIGN KEY (id_livre) REFERENCES livre(id_livre)
);

CREATE TABLE emprunt (
    id_emprunt INT PRIMARY KEY AUTO_INCREMENT,
    date_emprunt DATE NOT NULL,
    date_retour_prevue DATE NOT NULL,
    date_retour_effective DATE,
    statut VARCHAR(50) NOT NULL,
    id_utilisateur INT NOT NULL,
    id_exemplaire INT NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES utilisateur(id_utilisateur),
    FOREIGN KEY (id_exemplaire) REFERENCES exemplaire(id_exemplaire)
);