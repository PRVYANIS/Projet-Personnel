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

    $email = trim($_POST["email"]);
    $mot_de_passe = $_POST["mot_de_passe"];

    if (empty($email) || empty($mot_de_passe)) {
        $message = "Tous les champs sont obligatoires.";
    } else {
        $stmt = $pdo->prepare("SELECT * FROM utilisateur WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($mot_de_passe, $user["mot_de_passe"])) {
            session_regenerate_id(true);

            $_SESSION["user_id"] = $user["id_utilisateur"];
            $_SESSION["user_nom"] = $user["nom"];

            header("Location: dashboard.php");
            exit();
        } else {
            $message = "Email ou mot de passe incorrect.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion</title>
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
        <h1>Connexion</h1>

        <p class="subtitle">
            Connecte-toi pour accéder à ton espace sécurisé.
        </p>

        <?php if (!empty($message)) : ?>
            <p class="message"><?= htmlspecialchars($message) ?></p>
        <?php endif; ?>

        <form method="POST">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION["csrf_token"]) ?>">

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email">
            </div>

            <div class="form-group">
                <label for="mot_de_passe">Mot de passe</label>
                <input type="password" id="mot_de_passe" name="mot_de_passe" autocomplete="current-password">
            </div>

            <button type="submit" class="btn btn-full">Se connecter</button>
        </form>

        <p class="auth-link">
            Pas encore de compte ?
            <a href="inscription.php">Créer un compte</a>
        </p>
    </section>
</main>

</body>
</html>