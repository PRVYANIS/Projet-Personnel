<?php
session_start();

if (isset($_SESSION["user_id"])) {
    header("Location: dashboard.php");
    exit();
}

require_once '../config/database.php';

$message = "";

if (empty($_SESSION["csrf_token"])) {
    $_SESSION["csrf_token"] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST["csrf_token"]) || $_POST["csrf_token"] !== $_SESSION["csrf_token"]) {
        die("Requête invalide.");
    }

    $nom = trim($_POST["nom"]);
    $email = trim($_POST["email"]);
    $mot_de_passe = $_POST["mot_de_passe"];

    if (empty($nom) || empty($email) || empty($mot_de_passe)) {
        $message = "Tous les champs sont obligatoires.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "L'adresse email n'est pas valide.";
    } elseif (strlen($mot_de_passe) < 8) {
        $message = "Le mot de passe doit contenir au moins 8 caractères.";
    } else {
        $mot_de_passe_hash = password_hash($mot_de_passe, PASSWORD_DEFAULT);

        try {
            $stmt = $pdo->prepare("INSERT INTO utilisateur (nom, email, mot_de_passe) VALUES (?, ?, ?)");
            $stmt->execute([$nom, $email, $mot_de_passe_hash]);

            $message = "Compte créé avec succès. Vous pouvez maintenant vous connecter.";
        } catch (PDOException $e) {
            $message = "Cet email est déjà utilisé.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<header class="header">
    <nav class="navbar">
        <a href="inscription.php" class="logo">LOGIN<br>SÉCURISÉ</a>

        <div class="nav-links">
            <a href="inscription.php">Inscription</a>
            <a href="connexion.php">Connexion</a>
        </div>
    </nav>
</header>

<main class="auth-page">
    <section class="auth-container">
        <h1>Créer un compte</h1>

        <p class="subtitle">
            Inscris-toi avec un email unique et un mot de passe sécurisé.
        </p>

        <?php if (!empty($message)) : ?>
            <p class="message"><?= htmlspecialchars($message) ?></p>
        <?php endif; ?>

        <form method="POST">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION["csrf_token"]) ?>">

            <div class="form-group">
                <label for="nom">Nom</label>
                <input type="text" id="nom" name="nom" autocomplete="name">
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email">
            </div>

            <div class="form-group">
                <label for="mot_de_passe">Mot de passe</label>
                <input type="password" id="mot_de_passe" name="mot_de_passe" autocomplete="new-password">
            </div>

            <button type="submit" class="btn btn-full">Créer le compte</button>
        </form>

        <p class="auth-link">
            Déjà un compte ?
            <a href="connexion.php">Se connecter</a>
        </p>
    </section>
</main>

</body>
</html>