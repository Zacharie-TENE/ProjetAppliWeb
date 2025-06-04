#!/bin/bash
# filepath: git.sh

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Valeurs par défaut
DEFAULT_MESSAGE="mise à jour"
DEFAULT_BRANCH="main"

# Message d'en-tête
echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Assistant Git - Commit et Push${NC}"
echo -e "${BLUE}============================================${NC}"

# Vérification que nous sommes dans un dépôt Git
if [ ! -d ".git" ]; then
    echo -e "${RED}Erreur: Ce répertoire n'est pas un dépôt Git.${NC}"
    exit 1
fi

# Afficher le statut Git actuel
echo -e "${YELLOW}Statut Git actuel:${NC}"
git status -s
echo ""

# Confirmation pour continuer
read -p "Voulez-vous continuer avec le commit et push? (y/n): " CONTINUE
if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Opération annulée.${NC}"
    exit 0
fi

# Gestion du message de commit
echo -e "${YELLOW}Message de commit par défaut: ${GREEN}\"$DEFAULT_MESSAGE\"${NC}"
read -p "Souhaitez-vous utiliser le message par défaut? (y/n): " USE_DEFAULT_MESSAGE
USE_DEFAULT_MESSAGE=$(echo "$USE_DEFAULT_MESSAGE" | tr '[:upper:]' '[:lower:]')

if [[ $USE_DEFAULT_MESSAGE == "y" ]]; then
    COMMIT_MESSAGE="$DEFAULT_MESSAGE"
else
    read -p "Entrez votre message de commit: " COMMIT_MESSAGE
    # Si l'utilisateur n'entre rien, utiliser le message par défaut
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="$DEFAULT_MESSAGE"
        echo -e "${YELLOW}Message vide, utilisation du message par défaut.${NC}"
    fi
fi

# Gestion de la branche
echo -e "${YELLOW}Branche par défaut: ${GREEN}\"$DEFAULT_BRANCH\"${NC}"
read -p "Souhaitez-vous utiliser la branche par défaut? (y/n): " USE_DEFAULT_BRANCH
USE_DEFAULT_BRANCH=$(echo "$USE_DEFAULT_BRANCH" | tr '[:upper:]' '[:lower:]')

if [[ $USE_DEFAULT_BRANCH == "y" ]]; then
    BRANCH="$DEFAULT_BRANCH"
else
    # Afficher les branches disponibles
    echo -e "${YELLOW}Branches disponibles:${NC}"
    git branch
    read -p "Entrez le nom de la branche pour le push: " BRANCH
    # Si l'utilisateur n'entre rien, utiliser la branche par défaut
    if [ -z "$BRANCH" ]; then
        BRANCH="$DEFAULT_BRANCH"
        echo -e "${YELLOW}Nom de branche vide, utilisation de la branche par défaut.${NC}"
    fi
fi

# Vérifier si la branche existe
if ! git show-ref --quiet --verify refs/heads/$BRANCH; then
    echo -e "${RED}Erreur: La branche '$BRANCH' n'existe pas.${NC}"
    read -p "Voulez-vous créer cette branche? (y/n): " CREATE_BRANCH
    if [[ $CREATE_BRANCH =~ ^[Yy]$ ]]; then
        git checkout -b $BRANCH
    else
        echo -e "${YELLOW}Opération annulée.${NC}"
        exit 0
    fi
fi

# Exécution des commandes Git
echo -e "${BLUE}============================================${NC}"
echo -e "${YELLOW}Exécution des commandes Git:${NC}"
echo -e "${GREEN}git add .${NC}"
git add .

echo -e "${GREEN}git commit -m \"$COMMIT_MESSAGE\"${NC}"
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors du commit. Vérifiez votre configuration Git.${NC}"
    exit 1
fi

echo -e "${GREEN}git push origin $BRANCH${NC}"
git push origin $BRANCH

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors du push. Vérifiez votre connexion et vos droits d'accès au dépôt.${NC}"
    exit 1
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}Opération réussie!${NC}"
echo -e "${YELLOW}Commit et push effectués sur la branche ${GREEN}$BRANCH${YELLOW} avec le message: ${GREEN}\"$COMMIT_MESSAGE\"${NC}"
