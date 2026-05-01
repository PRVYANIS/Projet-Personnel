public class Main {
    public static void main(String[] args) {
        FileAttente file = new FileAttente();

        Client c1 = new Client(1, 0, 2, 4);
        Client c2 = new Client(2, 1, 1, 3);
        Client c3 = new Client(3, 2, 2, 2);
        
        file.ajouterClient(c1);
        file.ajouterClient(c2);
        file.ajouterClient(c3);

        System.out.println("Prochain client : " + file.voirProchainClient());
        System.out.println("Client retiré : " + file.retirerClient());
        System.out.println("Nouveau prochain client : " + file.voirProchainClient());
    }
}
