<?php
require_once '../config/auth.php';

verifierConnexion();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dashboard</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body>

<header class="header">
    <nav class="navbar">
        <a href="dashboard.php" class="logo">LOGIN<br>SÉCURISÉ</a>

        <div class="nav-links">
            <a href="dashboard.php">Dashboard</a>
            <a href="deconnexion.php">Déconnexion</a>
        </div>
    </nav>
</header>

<main class="dashboard">
    <section class="dashboard-container">
        <div class="dashboard-layout">

            <div class="dashboard-card">
                <p class="dashboard-label">Espace utilisateur</p>

                <h1>Bienvenue <?= htmlspecialchars($_SESSION["user_nom"]) ?></h1>

                <p>
                    Vous êtes connecté à votre espace sécurisé.
                    Cette page est accessible uniquement après authentification.
                </p>

                <div class="dashboard-actions">
                    <a href="deconnexion.php" class="btn">Se déconnecter</a>
                    <a href="dashboard.php" class="btn btn-secondary">Session active</a>
                </div>
            </div>

            <div class="security-panel">
                <h2>Sécurité activée</h2>

                <div class="security-item">
                    <span>01</span>
                    <div>
                        <h3>Mot de passe hashé</h3>
                        <p>Le mot de passe réel n’est jamais stocké dans la base de données.</p>
                    </div>
                </div>

                <div class="security-item">
                    <span>02</span>
                    <div>
                        <h3>Session protégée</h3>
                        <p>L’accès au dashboard est bloqué si l’utilisateur n’est pas connecté.</p>
                    </div>
                </div>

                <div class="security-item">
                    <span>03</span>
                    <div>
                        <h3>Protection XSS</h3>
                        <p>Les données affichées sont sécurisées avec htmlspecialchars.</p>
                    </div>
                </div>

                <div class="security-item">
                    <span>04</span>
                    <div>
                        <h3>Token CSRF</h3>
                        <p>Les formulaires vérifient que la requête vient bien du site.</p>
                    </div>
                </div>
            </div>

        </div>
    </section>
</main>

</body>
</html>