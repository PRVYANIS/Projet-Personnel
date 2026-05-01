import java.util.PriorityQueue;
import java.util.Comparator;

public class FileAttente {
    private PriorityQueue<Client> file;

    public FileAttente() {
        file = new PriorityQueue<>(new Comparator<Client>() {
            @Override
            public int compare(Client c1, Client c2) {
                if (c1.getPriorite() != c2.getPriorite()) {
                    return c1.getPriorite() - c2.getPriorite();
                }
                return c1.getTempsArrivee() - c2.getTempsArrivee();
            }
        });
    }

    public void ajouterClient(Client client) {
        file.add(client);
    }

    public Client retirerClient() {
        return file.poll();
    }

    public Client voirProchainClient() {
        return file.peek();
    }

    public boolean estVide() {
        return file.isEmpty();
    }

    public int taille() {
        return file.size();
    }

    @Override
    public String toString() {
        return file.toString();
    }
}
