/**
 * Utilitaires de tri pour l'application sportive
 * Fournit différentes fonctions de tri pour les différentes entités 
 * (compétitions, équipes, joueurs, médias, matchs, etc.)
 */

/**
 * Trie un tableau par ordre alphabétique selon une propriété spécifiée
 * @param {Array} array - Le tableau à trier
 * @param {string} property - La propriété à utiliser pour le tri
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortAlphabetically = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    if (!a[property] && !b[property]) return 0;
    if (!a[property]) return ascending ? 1 : -1;
    if (!b[property]) return ascending ? -1 : 1;
    
    const valueA = a[property].toString().toLowerCase();
    const valueB = b[property].toString().toLowerCase();
    
    return ascending 
      ? valueA.localeCompare(valueB) 
      : valueB.localeCompare(valueA);
  });
};

/**
 * Trie un tableau par date selon une propriété spécifiée
 * @param {Array} array - Le tableau à trier
 * @param {string} property - La propriété contenant la date
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortByDate = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    if (!a[property] && !b[property]) return 0;
    if (!a[property]) return ascending ? 1 : -1;
    if (!b[property]) return ascending ? -1 : 1;
    
    const dateA = new Date(a[property]);
    const dateB = new Date(b[property]);
    
    return ascending 
      ? dateA - dateB 
      : dateB - dateA;
  });
};

/**
 * Trie un tableau par valeur numérique selon une propriété spécifiée
 * @param {Array} array - Le tableau à trier
 * @param {string} property - La propriété contenant la valeur numérique
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortByNumber = (array, property, ascending = true) => {
  return [...array].sort((a, b) => {
    if (a[property] === undefined && b[property] === undefined) return 0;
    if (a[property] === undefined) return ascending ? 1 : -1;
    if (b[property] === undefined) return ascending ? -1 : 1;
    
    const numA = Number(a[property]);
    const numB = Number(b[property]);
    
    if (isNaN(numA) && isNaN(numB)) return 0;
    if (isNaN(numA)) return ascending ? 1 : -1;
    if (isNaN(numB)) return ascending ? -1 : 1;
    
    return ascending ? numA - numB : numB - numA;
  });
};

/**
 * Trie un tableau de compétitions selon différents critères
 * @param {Array} competitions - Le tableau de compétitions à trier
 * @param {string} sortBy - Le critère de tri (name, startDate, endDate, status, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortCompetitions = (competitions, sortBy, ascending = true) => {
  // Mapping des priorités pour le statut des compétitions
  const statusPriority = {
    'IN_PROGRESS': 1,
    'UPCOMING': 2,
    'COMPLETED': 3,
    'CANCELLED': 4
  };

  switch (sortBy) {
    case 'name':
      return sortAlphabetically(competitions, 'name', ascending);
    
    case 'organizerName':
      return sortAlphabetically(competitions, 'organizerName', ascending);
    
    case 'startDate':
      return sortByDate(competitions, 'startDate', ascending);
    
    case 'endDate':
      return sortByDate(competitions, 'endDate', ascending);
    
    case 'createdAt':
      return sortByDate(competitions, 'createdAt', ascending);
    
    case 'status':
      // Tri par statut avec priorité personnalisée
      return [...competitions].sort((a, b) => {
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;
        
        return ascending 
          ? priorityA - priorityB 
          : priorityB - priorityA;
      });
    
    case 'registeredTeams':
      return sortByNumber(competitions, 'registeredTeams', ascending);
    
    default:
      return [...competitions];
  }
};

/**
 * Trie un tableau de matchs selon différents critères
 * @param {Array} matches - Le tableau de matchs à trier
 * @param {string} sortBy - Le critère de tri (scheduledDateTime, title, status, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortMatches = (matches, sortBy, ascending = true) => {
  // Mapping des priorités pour le statut des matchs
  const statusPriority = {
    'IN_PROGRESS': 1,
    'SCHEDULED': 2,
    'COMPLETED': 3,
    'POSTPONED': 4,
    'CANCELLED': 5
  };

  switch (sortBy) {
    case 'title':
      return sortAlphabetically(matches, 'title', ascending);
    
    case 'scheduledDateTime':
      return sortByDate(matches, 'scheduledDateTime', ascending);
    
    case 'competitionName':
      return sortAlphabetically(matches, 'competitionName', ascending);
    
    case 'homeTeamName':
      return sortAlphabetically(matches, 'homeTeamName', ascending);
    
    case 'awayTeamName':
      return sortAlphabetically(matches, 'awayTeamName', ascending);
    
    case 'status':
      // Tri par statut avec priorité personnalisée
      return [...matches].sort((a, b) => {
        const priorityA = statusPriority[a.status] || 99;
        const priorityB = statusPriority[b.status] || 99;
        
        return ascending 
          ? priorityA - priorityB 
          : priorityB - priorityA;
      });
    
    case 'score':
      // Tri par score total (somme des scores)
      return [...matches].sort((a, b) => {
        const scoreA = (a.homeTeamScore || 0) + (a.awayTeamScore || 0);
        const scoreB = (b.homeTeamScore || 0) + (b.awayTeamScore || 0);
        
        return ascending 
          ? scoreA - scoreB 
          : scoreB - scoreA;
      });
    
    default:
      return [...matches];
  }
};

/**
 * Trie un tableau d'équipes selon différents critères
 * @param {Array} teams - Le tableau d'équipes à trier
 * @param {string} sortBy - Le critère de tri (name, category, playerCount, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortTeams = (teams, sortBy, ascending = true) => {
  // Mapping des priorités pour les catégories d'équipes
  const categoryPriority = {
    'JUNIOR': 1,
    'SENIOR': 2,
    'VETERAN': 3
  };

  switch (sortBy) {
    case 'name':
      return sortAlphabetically(teams, 'name', ascending);
    
    case 'coachName':
      return sortAlphabetically(teams, 'coachName', ascending);
    
    case 'playerCount':
      return sortByNumber(teams, 'playerCount', ascending);
    
    case 'competitionCount':
      return sortByNumber(teams, 'competitionCount', ascending);
    
    case 'createdAt':
      return sortByDate(teams, 'createdAt', ascending);
    
    case 'category':
      // Tri par catégorie avec priorité personnalisée
      return [...teams].sort((a, b) => {
        const priorityA = categoryPriority[a.category] || 99;
        const priorityB = categoryPriority[b.category] || 99;
        
        return ascending 
          ? priorityA - priorityB 
          : priorityB - priorityA;
      });
    
    default:
      return [...teams];
  }
};

/**
 * Trie un tableau de joueurs selon différents critères
 * @param {Array} players - Le tableau de joueurs à trier
 * @param {string} sortBy - Le critère de tri (lastName, position, teamName, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortPlayers = (players, sortBy, ascending = true) => {
  // Mapping des priorités pour les positions des joueurs
  const positionPriority = {
    'GOALKEEPER': 1,
    'DEFENDER': 2,
    'MIDFIELDER': 3,
    'FORWARD': 4
  };

  switch (sortBy) {
    case 'lastName':
      return sortAlphabetically(players, 'lastName', ascending);
    
    case 'firstName':
      return sortAlphabetically(players, 'firstName', ascending);
    
    case 'userName':
      return sortAlphabetically(players, 'userName', ascending);
    
    case 'teamName':
      return sortAlphabetically(players, 'teamName', ascending);
    
    case 'position':
      // Tri par position avec priorité personnalisée
      return [...players].sort((a, b) => {
        const priorityA = positionPriority[a.position] || 99;
        const priorityB = positionPriority[b.position] || 99;
        
        return ascending 
          ? priorityA - priorityB 
          : priorityB - priorityA;
      });
    
    case 'status':
      return sortAlphabetically(players, 'status', ascending);
    
    default:
      return [...players];
  }
};

/**
 * Trie un tableau de performances de joueurs selon différents critères
 * @param {Array} performances - Le tableau de performances à trier
 * @param {string} sortBy - Le critère de tri (totalGoals, totalMatches, rating, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortPlayerPerformances = (performances, sortBy, ascending = true) => {
  switch (sortBy) {
    case 'playerName':
      return sortAlphabetically(performances, 'playerName', ascending);
    
    case 'competitionName':
      return sortAlphabetically(performances, 'competitionName', ascending);
    
    case 'totalMatches':
      return sortByNumber(performances, 'totalMatches', ascending);
    
    case 'totalGoals':
      return sortByNumber(performances, 'totalGoals', ascending);
    
    case 'totalAssists':
      return sortByNumber(performances, 'totalAssists', ascending);
    
    case 'totalMinutesPlayed':
      return sortByNumber(performances, 'totalMinutesPlayed', ascending);
    
    case 'rating':
      return sortByNumber(performances, 'rating', ascending);
    
    // Autres statistiques
    case 'totalYellowCards':
      return sortByNumber(performances, 'totalYellowCards', ascending);
    
    case 'totalRedCards':
      return sortByNumber(performances, 'totalRedCards', ascending);
    
    case 'passAccuracy':
      return sortByNumber(performances, 'passAccuracy', ascending);
    
    case 'savePercentage':
      return sortByNumber(performances, 'savePercentage', ascending);
    
    default:
      return [...performances];
  }
};

/**
 * Trie un tableau de médias selon différents critères
 * @param {Array} media - Le tableau de médias à trier
 * @param {string} sortBy - Le critère de tri (title, uploadedAt, viewCount, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortMedia = (media, sortBy, ascending = true) => {
  // Mapping des priorités pour les types de médias
  const typePriority = {
    'IMAGE': 1,
    'VIDEO': 2,
    'DOCUMENT': 3
  };

  switch (sortBy) {
    case 'title':
      return sortAlphabetically(media, 'title', ascending);
    
    case 'uploaderName':
      return sortAlphabetically(media, 'uploaderName', ascending);
    
    case 'teamName':
      return sortAlphabetically(media, 'teamName', ascending);
    
    case 'competitionName':
      return sortAlphabetically(media, 'competitionName', ascending);
    
    case 'uploadedAt':
      return sortByDate(media, 'uploadedAt', ascending);
    
    case 'viewCount':
      return sortByNumber(media, 'viewCount', ascending);
    
    case 'mediaType':
      // Tri par type de média avec priorité personnalisée
      return [...media].sort((a, b) => {
        const priorityA = typePriority[a.mediaType] || 99;
        const priorityB = typePriority[b.mediaType] || 99;
        
        return ascending 
          ? priorityA - priorityB 
          : priorityB - priorityA;
      });
    
    default:
      return [...media];
  }
};

/**
 * Trie un tableau de messages selon différents critères
 * @param {Array} messages - Le tableau de messages à trier
 * @param {string} sortBy - Le critère de tri (sentAt, senderName, isRead, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortMessages = (messages, sortBy, ascending = true) => {
  switch (sortBy) {
    case 'senderName':
      return sortAlphabetically(messages, 'senderName', ascending);
    
    case 'sentAt':
      return sortByDate(messages, 'sentAt', ascending);
    
    case 'isRead':
      // Trier par statut de lecture (non lu en premier par défaut)
      return [...messages].sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        if (ascending) {
          return a.isRead ? 1 : -1;
        } else {
          return a.isRead ? -1 : 1;
        }
      });
    
    case 'messageType':
      return sortAlphabetically(messages, 'messageType', ascending);
    
    default:
      // Par défaut, tri par date d'envoi (plus récent en premier)
      return sortByDate(messages, 'sentAt', false);
  }
};

/**
 * Trie un tableau de notifications selon différents critères
 * @param {Array} notifications - Le tableau de notifications à trier
 * @param {string} sortBy - Le critère de tri (createdAt, title, isRead, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortNotifications = (notifications, sortBy, ascending = true) => {
  switch (sortBy) {
    case 'title':
      return sortAlphabetically(notifications, 'title', ascending);
    
    case 'createdAt':
      return sortByDate(notifications, 'createdAt', ascending);
    
    case 'readAt':
      return sortByDate(notifications, 'readAt', ascending);
    
    case 'isRead':
      // Trier par statut de lecture (non lu en premier par défaut)
      return [...notifications].sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        if (ascending) {
          return a.isRead ? 1 : -1;
        } else {
          return a.isRead ? -1 : 1;
        }
      });
    
    case 'notificationType':
      return sortAlphabetically(notifications, 'notificationType', ascending);
    
    case 'relatedEntityType':
      return sortAlphabetically(notifications, 'relatedEntityType', ascending);
    
    default:
      // Par défaut, tri par date de création (plus récent en premier)
      return sortByDate(notifications, 'createdAt', false);
  }
};

/**
 * Trie un tableau de classements (standings) selon différents critères
 * @param {Array} standings - Le tableau de classements à trier
 * @param {string} sortBy - Le critère de tri (position, points, goalDifference, etc.)
 * @param {boolean} ascending - Ordre ascendant (true) ou descendant (false)
 * @returns {Array} - Le tableau trié
 */
export const sortStandings = (standings, sortBy, ascending = true) => {
  switch (sortBy) {
    case 'teamName':
      return sortAlphabetically(standings, 'teamName', ascending);
    
    case 'position':
      return sortByNumber(standings, 'position', ascending);
    
    case 'points':
      return sortByNumber(standings, 'points', !ascending); // Par défaut décroissant pour les points
    
    case 'matchesPlayed':
      return sortByNumber(standings, 'matchesPlayed', ascending);
    
    case 'wins':
      return sortByNumber(standings, 'wins', !ascending);
    
    case 'draws':
      return sortByNumber(standings, 'draws', !ascending);
    
    case 'losses':
      return sortByNumber(standings, 'losses', ascending);
    
    case 'goalsFor':
      return sortByNumber(standings, 'goalsFor', !ascending);
    
    case 'goalsAgainst':
      return sortByNumber(standings, 'goalsAgainst', ascending);
    
    case 'goalDifference':
      return sortByNumber(standings, 'goalDifference', !ascending);
    
    default:
      // Par défaut, tri par position au classement
      return sortByNumber(standings, 'position', true);
  }
};