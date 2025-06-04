
## Authentication DTOs

### LoginRequest
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### LoginResponse
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    // Contenu de l'objet utilisateur (Player, Coach, etc.)
  }
}
```

## User DTOs

### UserDTO
```json
{
  "id": 1,
  "email": "user@example.com",
  "userName": "username",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PLAYER",
  "phone": "+33612345678",
  "profilePicture": "url/to/profile.jpg",
  "address": "123 Example Street",
  "password": null,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-02-01T14:30:00"
}
```

### PlayerDTO
```json
{
  "id": 1,
  "email": "player@example.com",
  "userName": "player1",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PLAYER",
  "phone": "+33612345678",
  "profilePicture": "url/to/profile.jpg",
  "address": "123 Example Street",
  "password": null,
  "createdAt": "2023-01-01T12:00:00",
  "updatedAt": "2023-02-01T14:30:00",
  "licenseNumber": "PL12345",
  "dateOfBirth": "1995-05-15",
  "position": "FORWARD",
  "status": "ACTIVE",
  "teamId": 1,
  "teamName": "Team Alpha"
}
```

### CoachDTO
```json
{
  "id": 2,
  "email": "coach@example.com",
  "userName": "coach1",
  "firstName": "Robert",
  "lastName": "Smith",
  "role": "COACH",
  "phone": "+33612345679",
  "profilePicture": "url/to/profile.jpg",
  "address": "456 Coach Street",
  "password": null,
  "createdAt": "2023-01-02T10:00:00",
  "updatedAt": "2023-02-02T11:30:00",
  "licenseNumber": "CO12345"
}
```

### OrganizerDTO
```json
{
  "id": 3,
  "email": "organizer@example.com",
  "userName": "organizer1",
  "firstName": "Jane",
  "lastName": "Wilson",
  "role": "ORGANIZER",
  "phone": "+33612345680",
  "profilePicture": "url/to/profile.jpg",
  "address": "789 Organizer Avenue",
  "password": null,
  "createdAt": "2023-01-03T09:00:00",
  "updatedAt": "2023-02-03T15:45:00",
  "organization": "Sports Federation"
}
```

### AdminDTO
```json
{
  "id": 4,
  "email": "admin@example.com",
  "userName": "admin1",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "phone": "+33612345681",
  "profilePicture": "url/to/profile.jpg",
  "address": "101 Admin Road",
  "password": null,
  "createdAt": "2023-01-04T08:00:00",
  "updatedAt": "2023-02-04T16:00:00"
}
```

## Team DTOs

### TeamDTO
```json
{
  "id": 1,
  "name": "Team Alpha",
  "description": "A competitive team from the north region",
  "logo": "url/to/logo.png",
  "category": "SENIOR",
  "coachId": 2,
  "coachName": "Robert Smith",
  "playerCount": 15,
  "competitionCount": 3,
  "createdAt": "2023-01-10T10:30:00",
  "updatedAt": "2023-03-15T14:20:00"
}
```

### TeamCompetitionsDTO
```json
{
  "teamId": 1,
  "teamName": "Team Alpha",
  "competitions": [
    {
      "id": 1,
      "name": "Summer League 2023",
      "type": "LEAGUE",
      "status": "IN_PROGRESS",
      "startDate": "2023-06-01",
      "endDate": "2023-08-31"
    },
    {
      "id": 2,
      "name": "Regional Cup",
      "type": "CUP",
      "status": "UPCOMING",
      "startDate": "2023-09-15",
      "endDate": "2023-11-30"
    }
  ]
}
```

### StandingDTO
```json
{
  "id": 5,
  "competitionId": 1,
  "teamId": 1,
  "competitionName": "Summer League 2023",
  "teamName": "Team Alpha",
  "rank": 3,
  "playedMatches": 12,
  "wins": 7,
  "draws": 3,
  "losses": 2,
  "goalsFor": 25,
  "goalsAgainst": 15,
  "points": 24,
  "goalDifference": 10
}
```

## Competition DTOs

### CompetitionDTO
```json
{
  "id": 1,
  "name": "Summer League 2023",
  "description": "Annual summer football league",
  "category": "SENIOR",
  "type": "LEAGUE",
  "status": "IN_PROGRESS",
  "startDate": "2023-06-01",
  "endDate": "2023-08-31",
  "location": "City Stadium",
  "maxTeams": 12,
  "registeredTeams": 10,
  "organizerId": 3,
  "organizerName": "Jane Wilson",
  "createdAt": "2023-03-10T09:15:00",
  "updatedAt": "2023-06-01T08:00:00"
}
```

## Match DTOs

### MatchDTO
```json
{
  "id": 25,
  "title": "Team Alpha vs Team Beta",
  "competitionId": 1,
  "competitionName": "Summer League 2023",
  "competitionType": "LEAGUE",
  "scheduledDateTime": "2023-07-15T15:00:00",
  "participants": [
    {
      "id": 51,
      "teamId": 1,
      "teamName": "Team Alpha",
      "role": "HOME"
    },
    {
      "id": 52,
      "teamId": 2,
      "teamName": "Team Beta",
      "role": "AWAY"
    }
  ],
  "status": "SCHEDULED",
  "homeTeamScore": null,
  "awayTeamScore": null,
  "matchSheetStatus": "DRAFT",
  "round": 5,
  "hasMatchsheet": true
}
```

### ConsolidatedMatchDTO
```json
{
  "matchId": 25,
  "title": "Team Alpha vs Team Beta",
  "description": "Round 5 match of Summer League",
  "matchDate": "2023-07-15T15:00:00",
  "location": "City Stadium",
  "homeScore": 2,
  "awayScore": 1,
  "status": "COMPLETED",
  "matchSheets": [
    {
      "id": 50,
      "matchId": 25,
      "teamId": 1,
      "teamName": "Team Alpha",
      "teamRole": "HOME",
      "status": "APPROVED",
      "playerParticipations": [
        // Liste des participations des joueurs
      ]
    },
    {
      "id": 51,
      "matchId": 25,
      "teamId": 2,
      "teamName": "Team Beta",
      "teamRole": "AWAY",
      "status": "APPROVED",
      "playerParticipations": [
        // Liste des participations des joueurs
      ]
    }
  ]
}
```

### MatchSheetDTO
```json
{
  "id": 50,
  "matchId": 25,
  "matchTitle": "Team Alpha vs Team Beta",
  "teamId": 1,
  "teamName": "Team Alpha",
  "teamRole": "HOME",
  "competitionId": 1,
  "competitionName": "Summer League 2023",
  "matchDateTime": "2023-07-15T15:00:00",
  "venue": "City Stadium",
  "teamScore": 2,
  "opponentScore": 1,
  "status": "APPROVED",
  "playerParticipations": [
    {
      "id": 101,
      "playerId": 5,
      "playerName": "John Smith",
      "shirtNumber": 10,
      "status": "ACTIVE",
      "position": "FORWARD",
      "goalsScored": 1,
      "yellowCards": 0,
      "redCards": 0,
      "minutesPlayed": 90
    },
    // Plus de participations de joueurs
  ],
  "coachComments": "Good team performance overall",
  "organizerComments": "Match completed successfully",
  "submittedAt": "2023-07-14T20:00:00",
  "validatedAt": "2023-07-16T10:00:00",
  "strategy": "4-4-2 formation with high pressing"
}
```

### PlayerParticipationDTO
```json
{
  "id": 101,
  "matchSheetId": 50,
  "playerId": 5,
  "playerName": "John Smith",
  "playerLicense": "PL12345",
  "shirtNumber": 10,
  "status": "ACTIVE",
  "position": "FORWARD",
  "goalsScored": 1,
  "yellowCards": 0,
  "redCards": 0,
  "minutesPlayed": 90,
  "substitutionInTime": null,
  "substitutionOutTime": null,
  "createdAt": "2023-07-14T18:30:00",
  "updatedAt": "2023-07-15T17:15:00"
}
```

### MatchStatusUpdateDTO
```json
{
  "matchId": 25,
  "newStatus": "IN_PROGRESS",
  "updateReason": "Match has started"
}
```

### MatchScoreUpdateDTO
```json
{
  "matchId": 25,
  "homeScore": 2,
  "awayScore": 1
}
```

### MatchSheetValidationDTO
```json
{
  "matchSheetId": 50,
  "status": "APPROVED",
  "comments": "All player data verified and approved"
}
```

## Player DTOs

### PlayerPerformanceDTO
```json
{
  "id": 75,
  "playerId": 5,
  "playerName": "John Smith",
  "competitionId": 1,
  "competitionName": "Summer League 2023",
  
  "totalMatches": 10,
  "totalMinutesPlayed": 850,
  "totalFouls": 15,
  "totalYellowCards": 2,
  "totalRedCards": 0,
  
  "totalGoals": 8,
  "totalAssists": 5,
  "totalShots": 30,
  "shotsOnTarget": 20,
  "penaltiesScored": 2,
  "penaltiesTaken": 2,
  "successfulDribbles": 25,
  
  "passAccuracy": 85.5,
  "successfulPasses": 320,
  "ballsRecovered": 45,
  "successfulCrosses": 12,
  
  "interceptions": 18,
  "ballsLost": 22,
  
  "savesMade": null,
  "cleanSheets": null,
  "penaltiesSaved": null,
  "goalsConceded": null,
  "savePercentage": null,
  
  "rating": 8.5,
  "notes": "Excellent performance throughout the competition"
}
```

### profileToUpdateDTO
```json
{
  "userId": 5,
  "userName": "johnsmith10",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+33612345678",
  "address": "Updated Address"
}
```

## Coach DTOs

### CoachTeamsDTO
```json
{
  "coachId": 2,
  "coachName": "Robert Smith",
  "teams": [
    {
      "id": 1,
      "name": "Team Alpha",
      "description": "A competitive team from the north region",
      "logo": "url/to/logo.png",
      "category": "SENIOR",
      "playerCount": 15,
      "competitionCount": 3
    },
    // Plus d'équipes
  ]
}
```

### CreateTeamDTO
```json
{
  "name": "Team Omega",
  "description": "A new team focused on youth development",
  "logo": "url/to/logo.png",
  "category": "JUNIOR",
  "coachId": 2
}
```

### UpdateTeamDTO
```json
{
  "teamId": 1,
  "name": "Team Alpha Updated",
  "description": "Updated description for Team Alpha",
  "logo": "url/to/new_logo.png",
  "category": "SENIOR"
}
```

### RegisterPlayerDTO
```json
{
  "email": "newplayer@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "Player",
  "phone": "+33612345690",
  "userName": "newplayer",
  "address": "123 Player Street",
  "profilePicture": "url/to/profile.jpg",
  "licenseNumber": "PL56789",
  "dateOfBirth": "2000-05-10",
  "position": "MIDFIELDER",
  "teamId": 1
}
```

### UpdatePlayerDTO
```json
{
  "playerId": 5,
  "position": "FORWARD",
  "status": "ACTIVE",
  "licenseNumber": "PL12345-U"
}
```

### CoachMatchSheetsResponseDTO
```json
{
  "coachId": 2,
  "coachName": "Robert Smith",
  "matchSheets": [
    // Liste des feuilles de match
  ]
}
```

### CoachMatchSheetManagementDTO
```json
{
  "matchSheetId": 50,
  "matchId": 25,
  "matchTitle": "Team Alpha vs Team Beta",
  "competitionId": 1,
  "competitionName": "Summer League 2023",
  "teamId": 1,
  "teamName": "Team Alpha",
  "matchDate": "2023-07-15T15:00:00",
  "submissionDeadline": "2023-07-14T23:59:59",
  "status": "DRAFT",
  "strategy": "4-4-2 formation with high pressing",
  "playerSelections": [
    {
      "playerId": 5,
      "playerName": "John Smith",
      "licenseNumber": "PL12345",
      "position": "FORWARD",
      "status": "ACTIVE",
      "shirtNumber": 10
    },
    // Plus de sélections de joueurs
  ]
}
```

### CoachCompetitionRequestDTO
```json
{
  "id": 15,
  "teamId": 1,
  "teamName": "Team Alpha",
  "coachId": 2,
  "coachName": "Robert Smith",
  "competitionId": 2,
  "competitionName": "Regional Cup",
  "requestType": "REGISTRATION",
  "requestStatus": "PENDING",
  "reason": "We would like to participate in this competition",
  "responseMessage": null,
  "createdAt": "2023-08-01T14:20:00",
  "processedAt": null
}
```

## Organizer DTOs

### OrganizerCompetitionDTO
```json
{
  "id": 1,
  "name": "Summer League 2023",
  "description": "Annual summer football league",
  "category": "SENIOR",
  "competitionType": "LEAGUE",
  "status": "IN_PROGRESS",
  "startDate": "2023-06-01",
  "endDate": "2023-08-31",
  "location": "City Stadium",
  "maxTeams": 12,
  "registeredTeams": 10,
  "teams": [
    {
      "teamId": 1,
      "teamName": "Team Alpha",
      "coachName": "Robert Smith",
      "playerCount": 15,
      "status": "ACTIVE"
    },
    // Plus d'équipes
  ],
  "totalMatches": 66,
  "completedMatches": 30,
  "upcomingMatches": 36,
  "organizerId": 3,
  "organizerName": "Jane Wilson",
  "createdAt": "2023-03-10T09:15:00",
  "updatedAt": "2023-06-01T08:00:00"
}
```

### OrganizerCompetitionsResponseDTO
```json
{
  "organizerId": 3,
  "organizerName": "Jane Wilson",
  "upcomingCompetitions": [
    // Liste des compétitions à venir
  ],
  "ongoingCompetitions": [
    // Liste des compétitions en cours
  ],
  "completedCompetitions": [
    // Liste des compétitions terminées
  ]
}
```

### OrganizerTeamSummaryDTO
```json
{
  "teamId": 1,
  "teamName": "Team Alpha",
  "logo": "url/to/logo.png",
  "coachId": 2,
  "coachName": "Robert Smith",
  "playerCount": 15,
  "status": "ACTIVE"
}
```

### OrganizerPlayerPerformanceDTO
```json
{
  "id": 75,
  "playerId": 5,
  "playerName": "John Smith",
  "playerLicense": "PL12345",
  "teamId": 1,
  "teamName": "Team Alpha",
  "competitionId": 1,
  "competitionName": "Summer League 2023",
  
  "totalMatches": 10,
  "totalMinutesPlayed": 850,
  "totalGoals": 8,
  "totalAssists": 5,
  "totalYellowCards": 2,
  "totalRedCards": 0,
  
  "rating": 8.5,
  "position": "FORWARD",
  "notes": "Excellent performance throughout the competition"
}
```

### OrganizerCompetitionStatusUpdateDTO
```json
{
  "competitionId": 1,
  "newStatus": "COMPLETED",
  "updateReason": "All matches completed and results validated"
}
```

### TeamCompetitionStatusUpdateDTO
```json
{
  "competitionId": 1,
  "teamId": 1,
  "newStatus": "ACTIVE",
  "updateReason": "Team registration approved"
}
```

## Common DTOs

### MessageDTO
```json
{
  "id": 100,
  "content": "Important information about the upcoming match",
  "senderId": 3,
  "senderRole": "ORGANIZER",
  "recipientIds": [2, 5, 6, 7, 8],
  "recipientCategory": "TEAM",
  "relatedEntityId": 1,
  "relatedEntityType": "TEAM",
  "sentAt": "2023-07-10T09:30:00",
  "readAt": null,
  "isRead": false
}
```

### NotificationDTO
```json
{
  "id": 200,
  "message": "Your match is scheduled for tomorrow at 15:00",
  "senderId": 3,
  "senderName": "Jane Wilson",
  "recipientId": 5,
  "isRead": false,
  "createdAt": "2023-07-14T10:00:00",
  "readAt": null,
  "entityType": "MATCH",
  "entityId": 25
}
```

### MediaDTO
```json
{
  "id": 300,
  "title": "Match Highlights: Team Alpha vs Team Beta",
  "url": "url/to/video.mp4",
  "description": "Highlights from the exciting match",
  "type": "VIDEO",
  "uploaderId": 3,
  "uploaderName": "Jane Wilson",
  "competitionId": 1,
  "matchId": 25,
  "teamId": null,
  "createdAt": "2023-07-16T12:00:00",
  "updatedAt": "2023-07-16T12:00:00"
}
```
