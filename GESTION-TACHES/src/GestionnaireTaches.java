import javafx.collections.FXCollections;
import javafx.collections.ObservableList;

import java.io.*;
import java.time.LocalDate;

public class GestionnaireTaches {

    private ObservableList<Tache> taches;
    private final String nomFichier = "taches.txt";

    public GestionnaireTaches() {
        this.taches = FXCollections.observableArrayList();
    }

    public ObservableList<Tache> getTaches() {
        return taches;
    }

    public void ajouterTache(Tache tache) {
        taches.add(tache);
        sauvegarderTaches();
    }

    public void supprimerTache(Tache tache) {
        taches.remove(tache);
        sauvegarderTaches();
    }

    public void modifierTache(Tache tache, String titre, String description, LocalDate dateFin, String priorite, int avancement) {
        tache.setTitre(titre);
        tache.setDescription(description);
        tache.setDateFin(dateFin);
        tache.setPriorite(priorite);
        tache.setAvancement(avancement);
        sauvegarderTaches();
    }

    public void changerEtatTache(Tache tache) {
        tache.setTerminee(!tache.isTerminee());
        sauvegarderTaches();
    }

    public void sauvegarderTaches() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(nomFichier))) {
            for (Tache tache : taches) {
                writer.write(
                        tache.getTitre() + ";" +
                        tache.getDescription() + ";" +
                        tache.getDateCreation() + ";" +
                        tache.getDateFin() + ";" +
                        tache.getPriorite() + ";" +
                        tache.getAvancement() + ";" +
                        tache.isTerminee()
                );
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Erreur lors de la sauvegarde : " + e.getMessage());
        }
    }

    public void chargerTaches() {
        File fichier = new File(nomFichier);

        if (!fichier.exists()) {
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(nomFichier))) {
            String ligne;

            while ((ligne = reader.readLine()) != null) {
                String[] donnees = ligne.split(";", -1);

                if (donnees.length == 7) {
                    String titre = donnees[0];
                    String description = donnees[1];
                    LocalDate dateCreation = LocalDate.parse(donnees[2]);
                    LocalDate dateFin = LocalDate.parse(donnees[3]);
                    String priorite = donnees[4];
                    int avancement = Integer.parseInt(donnees[5]);
                    boolean terminee = Boolean.parseBoolean(donnees[6]);

                    Tache tache = new Tache(titre, description, dateCreation, dateFin, priorite, avancement, terminee);
                    taches.add(tache);
                }
            }
        } catch (IOException e) {
            System.out.println("Erreur lors du chargement : " + e.getMessage());
        }
    }
}