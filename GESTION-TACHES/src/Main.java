import javafx.application.Application;
import javafx.beans.binding.Bindings;
import javafx.collections.transformation.FilteredList;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.*;
import javafx.stage.Stage;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Optional;

public class Main extends Application {

    private GestionnaireTaches gestionnaire;
    private FilteredList<Tache> tachesFiltrees;

    @Override
    public void start(Stage stage) {
        gestionnaire = new GestionnaireTaches();
        gestionnaire.chargerTaches();
        tachesFiltrees = new FilteredList<>(gestionnaire.getTaches(), tache -> true);

        LocalDate aujourdHui = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE. d MMM", Locale.FRENCH);
        String dateCourte = aujourdHui.format(formatter);

        Label titreSidebar = new Label("Aujourd’hui");
        titreSidebar.getStyleClass().add("titre-sidebar");

        Label dateSidebar = new Label(dateCourte);
        dateSidebar.getStyleClass().add("date-sidebar");

        HBox headerSidebar = new HBox(8, titreSidebar, dateSidebar);
        headerSidebar.getStyleClass().add("header-sidebar");

        TextField recherche = new TextField();
        recherche.setPromptText("Rechercher une tâche...");
        recherche.getStyleClass().add("recherche");

        ComboBox<String> filtre = new ComboBox<>();
        filtre.getItems().addAll("Toutes", "En cours", "Terminées");
        filtre.setValue("Toutes");
        filtre.getStyleClass().add("filtre");

        Label statistiques = new Label();
        statistiques.getStyleClass().add("statistiques");

        statistiques.textProperty().bind(Bindings.createStringBinding(() -> {
            int total = gestionnaire.getTaches().size();
            long terminees = gestionnaire.getTaches().stream().filter(Tache::isTerminee).count();
            long enCours = total - terminees;

            return "Total : " + total + " | En cours : " + enCours + " | Terminées : " + terminees;
        }, gestionnaire.getTaches()));

        ListView<Tache> listeTaches = new ListView<>();
        listeTaches.setItems(tachesFiltrees);
        listeTaches.getStyleClass().add("liste-taches");

        Label messageListeVide = new Label("Aucune tâche pour le moment.");
        messageListeVide.getStyleClass().add("message-liste-vide");
        messageListeVide.visibleProperty().bind(Bindings.isEmpty(gestionnaire.getTaches()));
        messageListeVide.managedProperty().bind(Bindings.isEmpty(gestionnaire.getTaches()));

        VBox sidebar = new VBox(18, headerSidebar, recherche, filtre, statistiques, messageListeVide, listeTaches);
        sidebar.getStyleClass().add("sidebar");

        Label messageAucuneSelection = new Label("Aucune tâche sélectionnée");
        messageAucuneSelection.getStyleClass().add("message-selection");

        Label detailTitre = new Label();
        detailTitre.getStyleClass().add("detail-titre");

        Label detailDescription = new Label();
        detailDescription.getStyleClass().add("detail-description");
        detailDescription.setWrapText(true);

        Label detailDateCreation = new Label();
        Label detailDateFin = new Label();
        Label detailPriorite = new Label();
        Label detailAvancement = new Label();
        Label detailEtat = new Label();

        VBox detailsInfos = new VBox(
                detailDateCreation,
                detailDateFin,
                detailPriorite,
                detailAvancement,
                detailEtat
        );
        detailsInfos.getStyleClass().add("details-infos");

        Button boutonModifier = new Button("Modifier");
        Button boutonSupprimer = new Button("Supprimer");
        Button boutonTerminer = new Button("Terminer / En cours");

        boutonModifier.getStyleClass().add("bouton-secondaire");
        boutonSupprimer.getStyleClass().add("bouton-danger");
        boutonTerminer.getStyleClass().add("bouton-secondaire");

        HBox actionsDetails = new HBox(10, boutonModifier, boutonSupprimer, boutonTerminer);
        actionsDetails.getStyleClass().add("actions");

        VBox panneauDetails = new VBox(18, detailTitre, detailDescription, detailsInfos, actionsDetails);
        panneauDetails.getStyleClass().add("panneau-details");
        panneauDetails.setVisible(false);
        panneauDetails.setManaged(false);

        TextField champTitre = new TextField();
        champTitre.setPromptText("Nom de la tâche");

        TextArea champDescription = new TextArea();
        champDescription.setPromptText("Description");
        champDescription.setPrefRowCount(4);

        DatePicker champDateFin = new DatePicker();
        champDateFin.setPromptText("Date de fin");

        ComboBox<String> champPriorite = new ComboBox<>();
        champPriorite.getItems().addAll("Basse", "Moyenne", "Haute", "Très haute");
        champPriorite.setValue("Moyenne");

        Spinner<Integer> champAvancement = new Spinner<>(0, 100, 0);
        champAvancement.setEditable(true);

        Button boutonValiderAjout = new Button("Ajouter");
        Button boutonValiderModification = new Button("Enregistrer");
        Button boutonAnnuler = new Button("Annuler");

        boutonValiderAjout.getStyleClass().add("bouton-principal");
        boutonValiderModification.getStyleClass().add("bouton-principal");
        boutonAnnuler.getStyleClass().add("bouton-secondaire");

        HBox actionsFormulaire = new HBox(10, boutonValiderAjout, boutonValiderModification, boutonAnnuler);

        VBox formulaire = new VBox(
                new Label("Nouvelle tâche"),
                champTitre,
                champDescription,
                champDateFin,
                champPriorite,
                champAvancement,
                actionsFormulaire
        );
        formulaire.getStyleClass().add("formulaire");
        formulaire.setVisible(false);
        formulaire.setManaged(false);

        Button boutonOuvrirAjout = new Button("+ Ajouter une tâche");
        boutonOuvrirAjout.getStyleClass().add("bouton-ajouter");

        StackPane zoneCentrale = new StackPane(messageAucuneSelection, panneauDetails, formulaire);
        zoneCentrale.getStyleClass().add("zone-centrale");

        BorderPane panneauDroite = new BorderPane();
        panneauDroite.setCenter(zoneCentrale);
        panneauDroite.setBottom(boutonOuvrirAjout);
        panneauDroite.getStyleClass().add("panneau-droite");

        BorderPane.setAlignment(boutonOuvrirAjout, javafx.geometry.Pos.BOTTOM_RIGHT);

        filtre.setOnAction(e -> appliquerFiltres(filtre, recherche));

        recherche.textProperty().addListener((obs, ancienneValeur, nouvelleValeur) -> {
            appliquerFiltres(filtre, recherche);
        });

        listeTaches.getSelectionModel().selectedItemProperty().addListener((obs, ancienneTache, nouvelleTache) -> {
            if (nouvelleTache != null) {
                afficherDetails(
                        nouvelleTache,
                        messageAucuneSelection,
                        panneauDetails,
                        formulaire,
                        boutonOuvrirAjout,
                        detailTitre,
                        detailDescription,
                        detailDateCreation,
                        detailDateFin,
                        detailPriorite,
                        detailAvancement,
                        detailEtat
                );
            }
        });

        boutonOuvrirAjout.setOnAction(e -> {
            listeTaches.getSelectionModel().clearSelection();
            viderFormulaire(champTitre, champDescription, champDateFin, champPriorite, champAvancement);

            messageAucuneSelection.setVisible(false);
            messageAucuneSelection.setManaged(false);
            panneauDetails.setVisible(false);
            panneauDetails.setManaged(false);
            formulaire.setVisible(true);
            formulaire.setManaged(true);
            boutonOuvrirAjout.setVisible(false);
            boutonOuvrirAjout.setManaged(false);

            boutonValiderAjout.setVisible(true);
            boutonValiderAjout.setManaged(true);
            boutonValiderModification.setVisible(false);
            boutonValiderModification.setManaged(false);
        });

        boutonValiderAjout.setOnAction(e -> {
            if (champTitre.getText().isEmpty() || champDateFin.getValue() == null) {
                afficherErreur("Champs obligatoires manquants", "Le titre et la date de fin sont obligatoires.");
                return;
            }

            Tache nouvelleTache = new Tache(
                    champTitre.getText(),
                    champDescription.getText(),
                    champDateFin.getValue(),
                    champPriorite.getValue()
            );

            nouvelleTache.setAvancement(champAvancement.getValue());
            gestionnaire.ajouterTache(nouvelleTache);

            appliquerFiltres(filtre, recherche);
            listeTaches.getSelectionModel().select(nouvelleTache);
            boutonOuvrirAjout.setVisible(true);
            boutonOuvrirAjout.setManaged(true);
        });

        boutonModifier.setOnAction(e -> {
            Tache tacheSelectionnee = listeTaches.getSelectionModel().getSelectedItem();

            if (tacheSelectionnee == null) {
                afficherAvertissement("Aucune tâche sélectionnée", "Sélectionne une tâche avant de la modifier.");
                return;
            }

            champTitre.setText(tacheSelectionnee.getTitre());
            champDescription.setText(tacheSelectionnee.getDescription());
            champDateFin.setValue(tacheSelectionnee.getDateFin());
            champPriorite.setValue(tacheSelectionnee.getPriorite());
            champAvancement.getValueFactory().setValue(tacheSelectionnee.getAvancement());

            messageAucuneSelection.setVisible(false);
            messageAucuneSelection.setManaged(false);
            panneauDetails.setVisible(false);
            panneauDetails.setManaged(false);
            formulaire.setVisible(true);
            formulaire.setManaged(true);
            boutonOuvrirAjout.setVisible(false);
            boutonOuvrirAjout.setManaged(false);

            boutonValiderAjout.setVisible(false);
            boutonValiderAjout.setManaged(false);
            boutonValiderModification.setVisible(true);
            boutonValiderModification.setManaged(true);
        });

        boutonValiderModification.setOnAction(e -> {
            Tache tacheSelectionnee = listeTaches.getSelectionModel().getSelectedItem();

            if (tacheSelectionnee == null) {
                afficherAvertissement("Aucune tâche sélectionnée", "Aucune tâche à modifier.");
                return;
            }

            if (champTitre.getText().isEmpty() || champDateFin.getValue() == null) {
                afficherErreur("Champs obligatoires manquants", "Le titre et la date de fin sont obligatoires.");
                return;
            }

            gestionnaire.modifierTache(
                    tacheSelectionnee,
                    champTitre.getText(),
                    champDescription.getText(),
                    champDateFin.getValue(),
                    champPriorite.getValue(),
                    champAvancement.getValue()
            );

            appliquerFiltres(filtre, recherche);
            listeTaches.refresh();

            afficherDetails(
                    tacheSelectionnee,
                    messageAucuneSelection,
                    panneauDetails,
                    formulaire,
                    boutonOuvrirAjout,
                    detailTitre,
                    detailDescription,
                    detailDateCreation,
                    detailDateFin,
                    detailPriorite,
                    detailAvancement,
                    detailEtat
            );
        });

        boutonSupprimer.setOnAction(e -> {
            Tache tacheSelectionnee = listeTaches.getSelectionModel().getSelectedItem();

            if (tacheSelectionnee == null) {
                afficherAvertissement("Aucune tâche sélectionnée", "Sélectionne une tâche avant de la supprimer.");
                return;
            }

            Alert confirmation = new Alert(Alert.AlertType.CONFIRMATION);
            confirmation.setTitle("Confirmation");
            confirmation.setHeaderText("Supprimer cette tâche ?");
            confirmation.setContentText("Cette action supprimera définitivement la tâche sélectionnée.");

            Optional<ButtonType> reponse = confirmation.showAndWait();

            if (reponse.isPresent() && reponse.get() == ButtonType.OK) {
                gestionnaire.supprimerTache(tacheSelectionnee);
                appliquerFiltres(filtre, recherche);
                listeTaches.getSelectionModel().clearSelection();

                panneauDetails.setVisible(false);
                panneauDetails.setManaged(false);
                formulaire.setVisible(false);
                formulaire.setManaged(false);
                messageAucuneSelection.setVisible(true);
                messageAucuneSelection.setManaged(true);
                boutonOuvrirAjout.setVisible(true);
                boutonOuvrirAjout.setManaged(true);
            }
        });

        boutonTerminer.setOnAction(e -> {
            Tache tacheSelectionnee = listeTaches.getSelectionModel().getSelectedItem();

            if (tacheSelectionnee == null) {
                afficherAvertissement("Aucune tâche sélectionnée", "Sélectionne une tâche avant de changer son état.");
                return;
            }

            gestionnaire.changerEtatTache(tacheSelectionnee);
            appliquerFiltres(filtre, recherche);
            listeTaches.refresh();

            afficherDetails(
                    tacheSelectionnee,
                    messageAucuneSelection,
                    panneauDetails,
                    formulaire,
                    boutonOuvrirAjout,
                    detailTitre,
                    detailDescription,
                    detailDateCreation,
                    detailDateFin,
                    detailPriorite,
                    detailAvancement,
                    detailEtat
            );
        });

        boutonAnnuler.setOnAction(e -> {
            formulaire.setVisible(false);
            formulaire.setManaged(false);
            boutonOuvrirAjout.setVisible(true);
            boutonOuvrirAjout.setManaged(true);

            Tache tacheSelectionnee = listeTaches.getSelectionModel().getSelectedItem();

            if (tacheSelectionnee == null) {
                messageAucuneSelection.setVisible(true);
                messageAucuneSelection.setManaged(true);
                panneauDetails.setVisible(false);
                panneauDetails.setManaged(false);
            } else {
                afficherDetails(
                        tacheSelectionnee,
                        messageAucuneSelection,
                        panneauDetails,
                        formulaire,
                        boutonOuvrirAjout,
                        detailTitre,
                        detailDescription,
                        detailDateCreation,
                        detailDateFin,
                        detailPriorite,
                        detailAvancement,
                        detailEtat
                );
            }
        });

        HBox racine = new HBox(sidebar, panneauDroite);
        racine.getStyleClass().add("racine");

        Scene scene = new Scene(racine, 1150, 720);
        scene.getStylesheets().add(getClass().getResource("style.css").toExternalForm());

        stage.setTitle("Projet Java - Gestionnaire de tâches");
        stage.setScene(scene);
        stage.show();
    }

    private void appliquerFiltres(ComboBox<String> filtre, TextField recherche) {
        String choix = filtre.getValue();
        String texteRecherche = recherche.getText().toLowerCase();

        tachesFiltrees.setPredicate(tache -> {
            boolean correspondEtat;

            if (choix.equals("Toutes")) {
                correspondEtat = true;
            } else if (choix.equals("En cours")) {
                correspondEtat = !tache.isTerminee();
            } else {
                correspondEtat = tache.isTerminee();
            }

            boolean correspondRecherche = tache.getTitre().toLowerCase().contains(texteRecherche);

            return correspondEtat && correspondRecherche;
        });
    }

    private void afficherDetails(
            Tache tache,
            Label messageAucuneSelection,
            VBox panneauDetails,
            VBox formulaire,
            Button boutonOuvrirAjout,
            Label detailTitre,
            Label detailDescription,
            Label detailDateCreation,
            Label detailDateFin,
            Label detailPriorite,
            Label detailAvancement,
            Label detailEtat
    ) {
        detailTitre.setText(tache.getTitre());
        detailDescription.setText(tache.getDescription().isEmpty() ? "Aucune description." : tache.getDescription());
        detailDateCreation.setText("Créée le : " + tache.getDateCreation());
        detailDateFin.setText("Date de fin : " + tache.getDateFin());
        detailPriorite.setText("Priorité : " + tache.getPriorite());
        detailAvancement.setText("Avancement : " + tache.getAvancement() + "%");
        detailEtat.setText("État : " + (tache.isTerminee() ? "Terminée" : "En cours"));

        messageAucuneSelection.setVisible(false);
        messageAucuneSelection.setManaged(false);
        formulaire.setVisible(false);
        formulaire.setManaged(false);
        panneauDetails.setVisible(true);
        panneauDetails.setManaged(true);
        boutonOuvrirAjout.setVisible(true);
        boutonOuvrirAjout.setManaged(true);
    }

    private void afficherErreur(String titre, String message) {
        Alert alerte = new Alert(Alert.AlertType.ERROR);
        alerte.setTitle("Erreur");
        alerte.setHeaderText(titre);
        alerte.setContentText(message);
        alerte.showAndWait();
    }

    private void afficherAvertissement(String titre, String message) {
        Alert alerte = new Alert(Alert.AlertType.WARNING);
        alerte.setTitle("Avertissement");
        alerte.setHeaderText(titre);
        alerte.setContentText(message);
        alerte.showAndWait();
    }

    private void viderFormulaire(
            TextField champTitre,
            TextArea champDescription,
            DatePicker champDateFin,
            ComboBox<String> champPriorite,
            Spinner<Integer> champAvancement
    ) {
        champTitre.clear();
        champDescription.clear();
        champDateFin.setValue(null);
        champPriorite.setValue("Moyenne");
        champAvancement.getValueFactory().setValue(0);
    }

    public static void main(String[] args) {
        launch(args);
    }
}