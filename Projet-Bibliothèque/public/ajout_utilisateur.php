<?php
require_once('../includes/connexion.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $nom = $_POST['nom'];
    $email = $_POST['email'];

    // Vérifier si l'email existe déjà
    $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email = ?");
    $stmt->execute([$email]);
    $existe = $stmt->fetch();

    if ($existe) {
        header("Location: index.php?error=email");
        exit;
    }

    // Sinon insertion
    $stmt = $pdo->prepare("INSERT INTO utilisateur (nom, email) VALUES (?, ?)");
    $stmt->execute([$nom, $email]);

    header("Location: index.php?success=utilisateur");
    exit;
}
?>