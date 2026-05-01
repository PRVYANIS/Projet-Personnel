package PROJET.Simulation;

import java.util.ArrayList;

public class Simulation {

    private int temps;
    private FileAttente file;
    private Client clientEnCours;
    private int tempsRestant;
    private ArrayList<Client> clientsAVenir;

    public Simulation() {
        this.temps = 0;
        this.file = new FileAttente();
        this.clientEnCours = null;
        this.tempsRestant = 0;
        this.clientsAVenir = new ArrayList<>();
    }

    public void ajouterClientAVenir(Client client) {
        clientsAVenir.add(client);
    }

    public void gererArrivees() {
        for (int i = 0; i < clientsAVenir.size(); i++) {
            Client client = clientsAVenir.get(i);

            if (client.getTempsArrivee() == temps) {
                file.ajouterClient(client);
                System.out.println("Arrivée du client : " + client);
                clientsAVenir.remove(i);
                i--;
            }
        }
    }

    public void avancerTemps() {
        System.out.println("Temps : " + temps);

        gererArrivees();

        if (clientEnCours == null && !file.estVide()) {
            clientEnCours = file.retirerClient();
            tempsRestant = clientEnCours.getTempsTraitement();
            System.out.println("Nouveau client en cours : " + clientEnCours);
        }

        if (clientEnCours != null) {
            tempsRestant--;
            System.out.println("Traitement en cours : " + clientEnCours + " | temps restant : " + tempsRestant);

            if (tempsRestant == 0) {
                System.out.println("Client terminé : " + clientEnCours);
                clientEnCours = null;
            }
        }

        System.out.println("File : " + file);
        System.out.println("----------------------");

        temps++;
    }
}
