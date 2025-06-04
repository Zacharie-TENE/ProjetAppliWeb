#!/bin/bash
# filepath: dependance.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Installation des dépendances Next.js${NC}"
echo -e "${BLUE}============================================${NC}"

# Sauvegarde du répertoire de départ
INITIAL_DIR=$(pwd)

# Chemin vers votre projet Next.js
FRONTEND_DIR="$INITIAL_DIR/web-app"

# Vérification de l'existence du répertoire
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Erreur: Le répertoire frontend '$FRONTEND_DIR' n'existe pas.${NC}"
    exit 1
fi

# Vérification de Node.js et npm
echo -e "${YELLOW}Vérification de Node.js et npm...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    echo -e "${YELLOW}Vous pouvez l'installer via : https://nodejs.org/en/download/${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm n'est pas installé. Veuillez l'installer avant de continuer.${NC}"
    exit 1
fi

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}Node.js version: $NODE_VERSION${NC}"
echo -e "${GREEN}npm version: $NPM_VERSION${NC}"

# Installation des dépendances
echo -e "${YELLOW}Installation des dépendances Next.js...${NC}"
cd "$FRONTEND_DIR" || { echo -e "${RED}Impossible d'accéder au répertoire frontend${NC}"; exit 1; }

# Vérification du package.json
if [ ! -f "package.json" ]; then
    echo -e "${RED}Erreur: package.json non trouvé dans $FRONTEND_DIR${NC}"
    echo -e "${RED}Vérifiez que vous avez le bon répertoire pour votre projet Next.js${NC}"
    cd "$INITIAL_DIR"
    exit 1
fi

# Nettoyage de node_modules si demandé
read -p "Voulez-vous nettoyer node_modules avant l'installation? (y/n): " cleanup
if [[ $cleanup == "y" || $cleanup == "Y" ]]; then
    echo -e "${YELLOW}Nettoyage de node_modules...${NC}"
    rm -rf node_modules
    rm -f package-lock.json
    echo -e "${GREEN}Nettoyage terminé.${NC}"
fi

# Installation des dépendances
echo -e "${YELLOW}Exécution de npm install...${NC}"
npm install

# Vérification du résultat
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Installation des dépendances réussie!${NC}"
else
    echo -e "${RED}Erreur lors de l'installation des dépendances.${NC}"
    cd "$INITIAL_DIR"
    exit 1
fi

# Retour au répertoire initial
cd "$INITIAL_DIR"

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Installation terminée avec succès!${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Vous pouvez maintenant lancer le projet avec : source start.sh${NC}"
