<?php
require_once('../includes/connexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $titre = $_POST['titre'];
    $auteur = $_POST['auteur'];

    $stmt = $pdo->prepare("INSERT INTO livre (titre, auteur) VALUES (?, ?)");
    $stmt->execute([$titre, $auteur]);

    $id_livre = $pdo->lastInsertId();

    $stmt = $pdo->prepare("INSERT INTO exemplaire (id_livre) VALUES (?)");
    $stmt->execute([$id_livre]);

    header("Location: index.php?success=livre");
    exit;
}
?>