<?php
require_once('../includes/connexion.php');

if (isset($_GET['id'])) {
    $id_emprunt = $_GET['id'];

    $stmt = $pdo->prepare("DELETE FROM emprunt WHERE id_emprunt = ?");
    $stmt->execute([$id_emprunt]);

    header("Location: liste_emprunts.php");
    exit;
}
?>