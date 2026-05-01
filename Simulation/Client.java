package PROJET.Simulation;

public class Client {
    private int id;
    private int tempsArrivee;
    private int priorite;
    private int tempsTraitement;

    public Client(int id, int tempsArrivee, int priorite, int tempsTraitement){
        this.id = id;
        this.tempsArrivee = tempsArrivee;
        this.priorite = priorite;
        this.tempsTraitement = tempsTraitement;
    }

    public int getId() {
        return id;
    }

    public int getTempsArrivee() {
        return tempsArrivee;
    }

    public int getPriorite() {
        return priorite;
    }

    public int getTempsTraitement() {
        return tempsTraitement;
    }

    @Override
    public String toString() {
        return "Client{id=" + id +
                ", arrivee=" + tempsArrivee +
                ", priorite=" + priorite +
                ", traitement=" + tempsTraitement + "}";
    }
}
