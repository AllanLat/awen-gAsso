
# Guide de Démarrage de l'API Awen GAsso

Ce guide vous aidera à démarrer l'API Awen GAsso localement sur votre machine. Suivez les étapes ci-dessous pour configurer et tester l'API.

## Configuration Initiale

### 1. Cloner le Projet

Clonez le projet depuis le dépôt distant en utilisant la commande suivante dans votre terminal :


git clone -b [nom_de_la_branche] https://github.com/AllanLat/awen-gAsso.git


Assurez-vous de remplacer `[nom_de_la_branche]` par le nom de la branche à partir de laquelle vous souhaitez travailler.

### 2. Installation de npm

Si vous n'avez pas npm installé sur votre machine, suivez les instructions d'installation disponibles [ici](https://www.npmjs.com/get-npm).

### 3. Importation de la Base de Données

- Téléchargez et extrayez le fichier `gasso.db.zip`.
- Installez WAMP ou un autre serveur local compatible.
- Importez la base de données dans PHPMyAdmin.

### 4. Installation de Postman

Installez Postman depuis [leur site officiel](https://www.postman.com/downloads/) pour tester les requêtes API.

### 5. Configuration du Fichier .env

Créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :


DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=loulou22
DB_PORT=8889
CRYPT=TABARNAK


Assurez-vous de modifier les valeurs selon votre configuration.

## Démarrage de l'API

Une fois toutes les étapes précédentes terminées, vous pouvez démarrer l'API en exécutant la commande suivante dans le terminal, toujours à la racine du projet :


npm start


L'API devrait maintenant être accessible localement à l'adresse spécifiée dans le projet.

---

N'hésitez pas à me faire savoir si vous avez des questions ou des problèmes avec ces instructions !
