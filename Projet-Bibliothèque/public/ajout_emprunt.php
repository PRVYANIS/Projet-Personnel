<?php
require_once('../includes/connexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $date_emprunt = $_POST['date_emprunt'];
    $id_utilisateur = $_POST['id_utilisateur'];
    $id_exemplaire = $_POST['id_exemplaire'];

    // Vérifier si l'utilisateur existe
    $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE id_utilisateur = ?");
    $stmt->execute([$id_utilisateur]);
    $utilisateur = $stmt->fetch();

    if (!$utilisateur) {
        echo "Utilisateur introuvable";
        exit;
    }

    // Vérifier si l'exemplaire existe
    $stmt = $pdo->prepare("SELECT * FROM exemplaire WHERE id_exemplaire = ?");
    $stmt->execute([$id_exemplaire]);
    $exemplaire = $stmt->fetch();

    if (!$exemplaire) {
        echo "Exemplaire introuvable";
        exit;
    }

    // Vérifier si l'exemplaire est déjà emprunté
    $stmt = $pdo->prepare("SELECT * FROM emprunt WHERE id_exemplaire = ?");
    $stmt->execute([$id_exemplaire]);
    $emprunt_existant = $stmt->fetch();

    if ($emprunt_existant) {
        echo "Cet exemplaire est déjà emprunté";
        exit;
    }

    // Ajouter l'emprunt
    $stmt = $pdo->prepare("INSERT INTO emprunt (date_emprunt, id_utilisateur, id_exemplaire) VALUES (?, ?, ?)");
    $stmt->execute([$date_emprunt, $id_utilisateur, $id_exemplaire]);

    header("Location: index.php?success=emprunt");
    exit;
}
?>