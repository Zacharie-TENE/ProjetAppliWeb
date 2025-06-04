-- Script de création de base de données pour HSQLDB

-- Séquences pour les identifiants auto-incrémentés
CREATE SEQUENCE seq_users AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_coaches AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_players AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_organizers AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_admins AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_teams AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_competitions AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_competition_teams AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_matches AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_match_participants AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_match_sheets AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_player_participations AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_player_performances AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_messages AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_message_read_status AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_notifications AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_media AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_standings AS INTEGER START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE seq_competition_requests AS INTEGER START WITH 1 INCREMENT BY 1;

-- Création des tables pour les énumérations
CREATE TABLE roles (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE media_types (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE match_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE match_sheet_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE match_roles (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE player_positions (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE player_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE competition_types (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE competition_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE competition_team_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE request_types (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE request_statuses (
    name VARCHAR(20) PRIMARY KEY
);

CREATE TABLE recipient_categories (
    name VARCHAR(50) PRIMARY KEY
);

-- Insertion des valeurs d'énumération
INSERT INTO roles VALUES ('USER'), ('COACH'), ('ORGANIZER'), ('ADMIN'), ('PLAYER');
INSERT INTO media_types VALUES ('IMAGE'), ('VIDEO'), ('DOCUMENT');
INSERT INTO match_statuses VALUES ('SCHEDULED'), ('IN_PROGRESS'), ('COMPLETED'), ('POSTPONED'), ('CANCELLED');
INSERT INTO match_sheet_statuses VALUES ('VALIDATED'), ('UNVALIDATED'), ('ONGOING'), ('SUBMITTED');
INSERT INTO match_roles VALUES ('HOME'), ('AWAY');
INSERT INTO player_positions VALUES ('GOALKEEPER'), ('DEFENDER'), ('MIDFIELDER'), ('FORWARD');
INSERT INTO player_statuses VALUES ('STARTER'), ('SUBSTITUTE'), ('NOT_PLAYED'), ('INJURED'), ('EXPELLED'), ('RESERVE');
INSERT INTO competition_types VALUES ('LEAGUE'), ('TOURNAMENT'), ('CUP');
INSERT INTO competition_statuses VALUES ('UPCOMING'), ('REGISTRATION'), ('IN_PROGRESS'), ('COMPLETED'), ('CANCELLED');
INSERT INTO competition_team_statuses VALUES ('ACTIVE'), ('SUSPENDED'), ('DISQUALIFIED');
INSERT INTO request_types VALUES ('REGISTRATION'), ('WITHDRAWAL');
INSERT INTO request_statuses VALUES ('PENDING'), ('APPROVED'), ('REJECTED');
INSERT INTO recipient_categories VALUES ('INDIVIDUAL'), ('TEAM'), ('TEAM_WITH_COACH'), ('ALL_PLAYERS'), ('ALL_COACHES'), ('ALL_ORGANIZERS'), ('COMPETITION_COACHES'), ('GLOBAL');

-- Création des tables
CREATE TABLE users (
    id BIGINT DEFAULT NEXT VALUE FOR seq_users PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    address VARCHAR(255),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (role) REFERENCES roles(name)
);

CREATE TABLE coaches (
    id BIGINT PRIMARY KEY,
    license_number VARCHAR(255) NOT NULL UNIQUE,
    specialization VARCHAR(255) NOT NULL,
    years_of_experience INT NOT NULL,
    contact_details VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    biography LONGVARCHAR,
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE teams (
    id BIGINT DEFAULT NEXT VALUE FOR seq_teams PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    logo VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    coach_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE players (
    id BIGINT PRIMARY KEY,
    license_number VARCHAR(255) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    position VARCHAR(20),
    player_status VARCHAR(20) NOT NULL,
    team_id BIGINT NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id),
    FOREIGN KEY (player_status) REFERENCES player_statuses(name),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE organizers (
    id BIGINT PRIMARY KEY,
    specialization VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    contact_details VARCHAR(255) NOT NULL,
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE admins (
    id BIGINT PRIMARY KEY,
    contact_details VARCHAR(255),
    FOREIGN KEY (id) REFERENCES users(id)
);

CREATE TABLE competitions (
    id BIGINT DEFAULT NEXT VALUE FOR seq_competitions PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    competition_type VARCHAR(20) NOT NULL,
    competition_status VARCHAR(20) NOT NULL,
    start_date DATE,
    category VARCHAR(255),
    end_date DATE,
    registration_deadline DATE,
    location VARCHAR(255) NOT NULL,
    max_teams INT,
    organizer_id BIGINT NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (competition_type) REFERENCES competition_types(name),
    FOREIGN KEY (competition_status) REFERENCES competition_statuses(name),
    FOREIGN KEY (organizer_id) REFERENCES organizers(id)
);

CREATE TABLE competition_teams (
    id BIGINT DEFAULT NEXT VALUE FOR seq_competition_teams PRIMARY KEY,
    competition_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (status) REFERENCES competition_team_statuses(name)
);

CREATE TABLE matches (
    id BIGINT DEFAULT NEXT VALUE FOR seq_matches PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(255),
    competition_id BIGINT NOT NULL,
    match_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    home_score INT,
    away_score INT,
    match_status VARCHAR(20) NOT NULL,
    round INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (match_status) REFERENCES match_statuses(name)
);

CREATE TABLE match_participants (
    id BIGINT DEFAULT NEXT VALUE FOR seq_match_participants PRIMARY KEY,
    match_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    role VARCHAR(20) NOT NULL,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (role) REFERENCES match_roles(name)
);

CREATE TABLE match_sheets (
    id BIGINT DEFAULT NEXT VALUE FOR seq_match_sheets PRIMARY KEY,
    match_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    match_sheet_status VARCHAR(20) NOT NULL,
    validation_date TIMESTAMP,
    submission_deadline DATE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    strategy LONGVARCHAR,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (match_sheet_status) REFERENCES match_sheet_statuses(name)
);

CREATE TABLE player_participations (
    id BIGINT DEFAULT NEXT VALUE FOR seq_player_participations PRIMARY KEY,
    match_sheet_id BIGINT NOT NULL,
    player_id BIGINT NOT NULL,
    shirt_number INT,
    player_status VARCHAR(20) NOT NULL,
    position VARCHAR(20),
    goals_scored INT,
    yellow_cards INT,
    red_cards INT,
    minutes_played INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    substitution_in_time INT,
    substitution_out_time INT,
    FOREIGN KEY (match_sheet_id) REFERENCES match_sheets(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (player_status) REFERENCES player_statuses(name),
    FOREIGN KEY (position) REFERENCES player_positions(name)
);

CREATE TABLE player_performances (
    id BIGINT DEFAULT NEXT VALUE FOR seq_player_performances PRIMARY KEY,
    player_id BIGINT NOT NULL,
    competition_id BIGINT NOT NULL,
    total_matches INT,
    total_fouls INT,
    total_yellow_cards INT,
    total_red_cards INT,
    total_minutes_played INT,
    total_goals INT,
    total_assists INT,
    total_shots INT,
    shots_on_target INT,
    penalties_scored INT,
    penalties_taken INT,
    successful_dribbles INT,
    pass_accuracy DOUBLE,
    successful_passes INT,
    balls_recovered INT,
    successful_crosses INT,
    interceptions INT,
    balls_lost INT,
    saves_made INT,
    clean_sheets INT,
    penalties_saved INT,
    goals_conceded INT,
    save_percentage DOUBLE,
    rating DOUBLE,
    notes LONGVARCHAR,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id)
);

CREATE TABLE messages (
    id BIGINT DEFAULT NEXT VALUE FOR seq_messages PRIMARY KEY,
    content LONGVARCHAR NOT NULL,
    sender_id BIGINT NOT NULL,
    sender_role VARCHAR(20) NOT NULL,
    recipient_category VARCHAR(50) NOT NULL,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    sent_at TIMESTAMP NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (sender_role) REFERENCES roles(name),
    FOREIGN KEY (recipient_category) REFERENCES recipient_categories(name)
);

CREATE TABLE message_recipients (
    message_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    PRIMARY KEY (message_id, recipient_id),
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (recipient_id) REFERENCES users(id)
);

CREATE TABLE message_read_status (
    id BIGINT DEFAULT NEXT VALUE FOR seq_message_read_status PRIMARY KEY,
    message_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id BIGINT DEFAULT NEXT VALUE FOR seq_notifications PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content LONGVARCHAR NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    related_entity_id BIGINT,
    related_entity_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE media (
    id BIGINT DEFAULT NEXT VALUE FOR seq_media PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description LONGVARCHAR,
    media_type VARCHAR(20) NOT NULL,
    uploader_id BIGINT NOT NULL,
    competition_id BIGINT,
    match_id BIGINT,
    team_id BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (media_type) REFERENCES media_types(name),
    FOREIGN KEY (uploader_id) REFERENCES users(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE standings (
    id BIGINT DEFAULT NEXT VALUE FOR seq_standings PRIMARY KEY,
    competition_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,
    rank INT NOT NULL,
    played_matches INT NOT NULL,
    wins INT NOT NULL,
    draws INT NOT NULL,
    losses INT NOT NULL,
    goals_for INT NOT NULL,
    goals_against INT NOT NULL,
    points INT NOT NULL,
    goal_difference INT NOT NULL,
    home_wins INT NOT NULL,
    home_draws INT NOT NULL,
    home_losses INT NOT NULL,
    away_wins INT NOT NULL,
    away_draws INT NOT NULL,
    away_losses INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE competition_requests (
    id BIGINT DEFAULT NEXT VALUE FOR seq_competition_requests PRIMARY KEY,
    team_id BIGINT NOT NULL,
    coach_id BIGINT NOT NULL,
    competition_id BIGINT NOT NULL,
    request_type VARCHAR(20) NOT NULL,
    request_status VARCHAR(20) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    response_message VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    processed_at TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (coach_id) REFERENCES coaches(id),
    FOREIGN KEY (competition_id) REFERENCES competitions(id),
    FOREIGN KEY (request_type) REFERENCES request_types(name),
    FOREIGN KEY (request_status) REFERENCES request_statuses(name)
);

-- Création des index pour améliorer les performances, c est facultatif, on pourra retirer apres
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_teams_coach ON teams(coach_id);
CREATE INDEX idx_competitions_organizer ON competitions(organizer_id);
CREATE INDEX idx_competition_teams_competition ON competition_teams(competition_id);
CREATE INDEX idx_competition_teams_team ON competition_teams(team_id);
CREATE INDEX idx_matches_competition ON matches(competition_id);
CREATE INDEX idx_match_participants_match ON match_participants(match_id);
CREATE INDEX idx_match_participants_team ON match_participants(team_id);
CREATE INDEX idx_match_sheets_match ON match_sheets(match_id);
CREATE INDEX idx_player_participations_sheet ON player_participations(match_sheet_id);
CREATE INDEX idx_player_participations_player ON player_participations(player_id);
CREATE INDEX idx_player_performances_player ON player_performances(player_id);
CREATE INDEX idx_player_performances_competition ON player_performances(competition_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_message_read_status_message ON message_read_status(message_id);
CREATE INDEX idx_message_read_status_user ON message_read_status(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_media_uploader ON media(uploader_id);
CREATE INDEX idx_standings_competition ON standings(competition_id);
CREATE INDEX idx_standings_team ON standings(team_id);
CREATE INDEX idx_competition_requests_competition ON competition_requests(competition_id);
CREATE INDEX idx_competition_requests_team ON competition_requests(team_id);
