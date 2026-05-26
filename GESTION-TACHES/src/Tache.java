import java.time.LocalDate;

public class Tache {

    private String titre;
    private String description;
    private LocalDate dateCreation;
    private LocalDate dateFin;
    private String priorite;
    private int avancement;
    private boolean terminee;

    public Tache(String titre, String description, LocalDate dateFin, String priorite) {
        this.titre = titre;
        this.description = description;
        this.dateCreation = LocalDate.now();
        this.dateFin = dateFin;
        this.priorite = priorite;
        this.avancement = 0;
        this.terminee = false;
    }

    public Tache(String titre, String description, LocalDate dateCreation, LocalDate dateFin, String priorite, int avancement, boolean terminee) {
        this.titre = titre;
        this.description = description;
        this.dateCreation = dateCreation;
        this.dateFin = dateFin;
        this.priorite = priorite;
        this.avancement = avancement;
        this.terminee = terminee;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }

    public String getPriorite() {
        return priorite;
    }

    public void setPriorite(String priorite) {
        this.priorite = priorite;
    }

    public int getAvancement() {
        return avancement;
    }

    public void setAvancement(int avancement) {
        if (avancement < 0) {
            this.avancement = 0;
        } else if (avancement > 100) {
            this.avancement = 100;
        } else {
            this.avancement = avancement;
        }

        this.terminee = this.avancement == 100;
    }

    public boolean isTerminee() {
        return terminee;
    }

    public void setTerminee(boolean terminee) {
        this.terminee = terminee;

        if (terminee) {
            this.avancement = 100;
        }
    }

    @Override
    public String toString() {
        String etat = terminee ? "Terminée" : "En cours";
        return titre + " | " + etat + " | " + avancement + "% | Priorité : " + priorite;
    }
}