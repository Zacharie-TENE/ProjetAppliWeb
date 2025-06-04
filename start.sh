#!/bin/bash
# filepath: start.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Lancement du projet complet${NC}"
echo -e "${BLUE}============================================${NC}"

# Sauvegarde du répertoire de départ
INITIAL_DIR=$(pwd)

# Définition des chemins
DB_DIR="$INITIAL_DIR/db"
BACKEND_DIR="$INITIAL_DIR/n7"
FRONTEND_DIR="$INITIAL_DIR/web-app"

# Vérification de l'existence des répertoires
if [ ! -d "$DB_DIR" ]; then
    echo -e "${RED}Erreur: Le répertoire de base de données '$DB_DIR' n'existe pas.${NC}"
    return 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}Erreur: Le répertoire backend '$BACKEND_DIR' n'existe pas.${NC}"
    return 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Erreur: Le répertoire frontend '$FRONTEND_DIR' n'existe pas.${NC}"
    return 1
fi

# Fonction pour afficher un message de démarrage
start_component() {
    echo -e "${YELLOW}Démarrage de $1...${NC}"
}

# Fonction pour vérifier si un port est disponible
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# 1. Démarrage de la base de données dans un terminal séparé
start_component "la base de données"
if [ ! -f "$DB_DIR/start.sh" ]; then
    echo -e "${RED}Erreur: Le script start.sh n'existe pas dans le répertoire de la BD.${NC}"
    return 1
fi

# Lancement de la BD dans un terminal séparé

mate-terminal --tab --title="HSQLDB Database" --working-directory="$DB_DIR" -- bash -c "source start.sh; exec bash"

# Attente que la BD soit prête (vérification du port 9001, port par defaut de hsqldb)
echo "Attente du démarrage complet de la base de données..."
for i in {1..30}; do
    if check_port 9001; then
        echo -e "${GREEN}Base de données démarrée avec succès!${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}Timeout: La base de données n'a pas démarré dans le délai imparti.${NC}"
        return 1
    fi
    sleep 1
    echo -n "."
done
echo ""

# 2. Démarrage du backend
start_component "le backend Spring Boot"
cd "$BACKEND_DIR" || { echo -e "${RED}Impossible d'accéder au répertoire backend${NC}"; return 1; }

# Lancement du backend Spring Boot dans un terminal séparé
mate-terminal  --tab --title="Backend Spring Boot" --working-directory="$BACKEND_DIR" -- bash -c "./mvnw spring-boot:run; exec bash"

# Retour au répertoire initial
cd "$INITIAL_DIR"

# Attente que le backend soit prêt (port 8080 par défaut de mon Spring Boot)
echo "Attente du démarrage complet du backend..."
for i in {1..60}; do
    if check_port 8080; then
        echo -e "${GREEN}Backend démarré avec succès!${NC}"
        break
    fi
    if [ $i -eq 60 ]; then
        echo -e "${YELLOW}Attention: Le backend ne semble pas avoir démarré dans le délai imparti.${NC}"
        echo -e "${YELLOW}Nous continuons quand même avec le démarrage du frontend.${NC}"
        break
    fi
    sleep 1
    echo -n "."
done
echo ""

# 3. Démarrage du frontend
start_component "le frontend Next.js"


# Lancement du frontend Next.js dans un terminal séparé
mate-terminal  --tab --title="Frontend Next.js" --working-directory="$FRONTEND_DIR" -- bash -c "npm run dev; exec bash"


# Retour au répertoire initial
cd "$INITIAL_DIR"

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Tous les composants ont été lancés!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "- Base de données: Démarrée sur port 9001"
echo -e "- Backend: Port 8080"
echo -e "- Frontend: Port 3000"
echo -e ""
echo -e "${YELLOW}Pour arrêter les services, fermez les terminaux ouverts.${NC}"
