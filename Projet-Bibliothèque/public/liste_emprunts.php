<?php
require_once('../includes/connexion.php');

$stmt = $pdo->query("
    SELECT 
        emprunt.id_emprunt,
        utilisateur.nom AS nom_utilisateur,
        livre.titre AS titre_livre,
        emprunt.date_emprunt
    FROM emprunt
    JOIN utilisateur ON emprunt.id_utilisateur = utilisateur.id_utilisateur
    JOIN exemplaire ON emprunt.id_exemplaire = exemplaire.id_exemplaire
    JOIN livre ON exemplaire.id_livre = livre.id_livre
");

$emprunts = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste des emprunts</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
    <div class="navbar-inner">
        <div class="logo">BIBLIOTHEQUE</div>
        <a href="index.php" class="nav-link">Accueil</a>
    </div>
</nav>

<div class="page">

    <header class="hero">
        <h1>Liste des emprunts</h1>
        <p>Visualisez et gérez les emprunts en cours</p>
    </header>

    <main class="list-container">

        <?php if (empty($emprunts)): ?>

            <div class="card">
                <p>Aucun emprunt pour le moment</p>
            </div>

        <?php else: ?>

            <?php foreach ($emprunts as $emprunt): ?>

                <div class="card emprunt-item">
                    <div class="emprunt-content">
                        <div class="emprunt-info">
                            <span class="user"><?= htmlspecialchars($emprunt['nom_utilisateur']); ?></span>
                            <span class="text">a emprunté</span>
                            <span class="livre"><?= htmlspecialchars($emprunt['titre_livre']); ?></span>
                        </div>

                        <div class="emprunt-meta">
                            <span class="date"><?= $emprunt['date_emprunt']; ?></span>
                            <a href="retour_emprunt.php?id=<?= $emprunt['id_emprunt']; ?>" class="return-btn">
                                Rendre
                            </a>
                        </div>
                    </div>
                </div>

            <?php endforeach; ?>

        <?php endif; ?>

    </main>

</div>

</body>
</html>