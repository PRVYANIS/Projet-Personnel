<?php
require_once('../includes/connexion.php');

$stmt = $pdo->query("SELECT id_utilisateur, nom FROM utilisateur");
$utilisateurs = $stmt->fetchAll();

$stmt = $pdo->query("
    SELECT exemplaire.id_exemplaire, livre.titre
    FROM exemplaire
    JOIN livre ON exemplaire.id_livre = livre.id_livre
    WHERE exemplaire.id_exemplaire NOT IN (
        SELECT id_exemplaire FROM emprunt
    )
");
$exemplaires = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion bibliothèque</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<nav class="navbar">
    <div class="navbar-inner">
        <div class="logo">BIBLIOTHEQUE</div>
        <a href="liste_emprunts.php" class="nav-link">Liste des emprunts</a>
    </div>
</nav>

<div class="page">

    <header class="hero">
        <h1>Gestion de bibliothèque</h1>
        <p>Ajoutez des utilisateurs, des livres et des emprunts dans une interface centralisée</p>
    </header>

    <?php
    if (isset($_GET['success'])) {
        if ($_GET['success'] == 'utilisateur') {
            echo "<div class='message success'>Utilisateur ajouté avec succès</div>";
        }
        if ($_GET['success'] == 'livre') {
            echo "<div class='message success'>Livre ajouté avec succès</div>";
        }
        if ($_GET['success'] == 'emprunt') {
            echo "<div class='message success'>Emprunt ajouté avec succès</div>";
        }
    }
    ?>
    <?php
    if (isset($_GET['error'])) {
        if ($_GET['error'] == 'email') {
            echo "<p style='color:red;'>Cet email existe déjà</p>";
        }
    }
    ?>

    <main class="grid">
        <section class="card">
            <h2>Ajouter un utilisateur</h2>
            <form action="ajout_utilisateur.php" method="POST">
                <div class="form-group">
                    <label for="nom">Nom</label>
                    <input type="text" name="nom" id="nom" required>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required>
                </div>

                <button type="submit">Ajouter</button>
            </form>
        </section>

        <section class="card">
            <h2>Ajouter un livre</h2>
            <form action="ajout_livre.php" method="POST">
                <div class="form-group">
                    <label for="titre">Titre</label>
                    <input type="text" name="titre" id="titre" required>
                </div>

                <div class="form-group">
                    <label for="auteur">Auteur</label>
                    <input type="text" name="auteur" id="auteur" required>
                </div>

                <button type="submit">Ajouter</button>
            </form>
        </section>

        <section class="card">
            <h2>Ajouter un emprunt</h2>
            <form action="ajout_emprunt.php" method="POST">
                <div class="form-group">
                    <label for="date_emprunt">Date d'emprunt</label>
                    <input type="date" name="date_emprunt" id="date_emprunt" required>
                </div>

                <div class="form-group">
                    <label for="id_utilisateur">Utilisateur</label>
                    <select name="id_utilisateur" id="id_utilisateur" required>
                        <?php foreach ($utilisateurs as $utilisateur): ?>
                            <option value="<?= $utilisateur['id_utilisateur']; ?>">
                                <?= htmlspecialchars($utilisateur['nom']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="form-group">
                    <label for="id_exemplaire">Exemplaire</label>
                    <?php if (empty($exemplaires)): ?>
                        <p class="empty-info">Aucun exemplaire disponible</p>
                    <?php else: ?>
                        <select name="id_exemplaire" id="id_exemplaire" required>
                            <?php foreach ($exemplaires as $exemplaire): ?>
                                <option value="<?= $exemplaire['id_exemplaire']; ?>">
                                    Exemplaire <?= $exemplaire['id_exemplaire']; ?> - <?= htmlspecialchars($exemplaire['titre']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    <?php endif; ?>
                </div>

                <button type="submit">Ajouter</button>
            </form>
        </section>
    </main>

    <section class="bottom-link-card">
        <a href="liste_emprunts.php" class="bottom-link">Voir la liste des emprunts</a>
    </section>

</div>

</body>
</html>