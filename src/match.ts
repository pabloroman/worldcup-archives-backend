import { Team } from "./team";
import { Stadium } from "./stadium";
import { Referee } from "./referee";
import { Player } from "./player";
import { Manager } from "./manager";
import { Goal } from "./goal";
import { Booking } from "./booking";
import { Substitution } from "./substitution";
import { SimpleMatch } from "./tournamentMatches";

export type RawMatch = {
    id: string,
    name: string,
    stage_name: string,
    tournament_name: string,
    match_date: string,
    match_time: string,
    home_team_score: number,
    away_team_score: number,
    score: string,
    score_penalties: string,
    video: string,
    image: string,
    extra_time: boolean,
    penalty_shootout: boolean,
    home_team_id: string,
    home_team_code: string,
    home_team_name: string,
    away_team_id: string,
    away_team_code: string,
    away_team_name: string,
    stadium_name: string,
    stadium_city: string,
    stadium_country: string,
    stadium_capacity: number,
    referee_first_name: string,
    referee_last_name: string,
    referee_country: string,
};

export type Match = {
    id: string,
    name: string,
    tournament_name: string,
    stage_name: string,
    match_date: string,
    match_time: string,
    home_team_score: number,
    away_team_score: number,
    score: string,
    score_penalties: string,
    video: string,
    image: string,
    extra_time: boolean,
    penalty_shootout: boolean,
    home_team: Team,
    away_team: Team,
    stadium: Stadium,
    referee: Referee,
    home_squad: Array<{
        player: Player,
        number: string,
        position: string,
        starter: boolean,
        substitute: boolean,
    }>,
    away_squad: Array<{
        player: Player,
        number: string,
        position: string,
        starter: boolean,
        substitute: boolean,
    }>,
    home_managers: Array<Manager>,
    away_managers: Array<Manager>,
    goals: Array<Goal>,
    bookings: Array<Booking>,
    substitutions: Array<Substitution>,
    similar_games: Array<SimpleMatch>,
};

export const MATCH_QUERY = `SELECT 
    matches.key_id as id,
    matches.match_name as name,
    matches.stage_name,
    tournaments.tournament_name as tournament_name,
    matches.match_date,
    matches.match_time,
    matches.extra_time,
    matches.home_team_score,
    matches.away_team_score,
    matches.penalty_shootout,
    matches.score,
    matches.score_penalties,
    matches.video,
    matches.image,
    matches.home_team_id,
    matches.away_team_id,
    home_team.team_code as home_team_code,
    home_team.team_name as home_team_name,
    away_team.team_code as away_team_code,
    away_team.team_name as away_team_name,
    stadiums.stadium_name as stadium_name,
    stadiums.city_name as stadium_city,
    stadiums.country_name as stadium_country,
    stadiums.stadium_capacity as stadium_capacity,
    referees.given_name as referee_first_name,
    referees.family_name as referee_last_name,
    referees.country_name as referee_country
    FROM matches 
    INNER JOIN tournaments ON matches.tournament_id = tournaments.tournament_id
    INNER JOIN teams home_team ON matches.home_team_id = home_team.team_id
    INNER JOIN teams away_team ON matches.away_team_id = away_team.team_id
    INNER JOIN stadiums ON matches.stadium_id = stadiums.stadium_id
    INNER JOIN referee_appearances ON matches.match_id = referee_appearances.match_id
    INNER JOIN referees ON referee_appearances.referee_id = referees.referee_id
    WHERE matches.key_id = ?`;

export const MATCH_HOME_TEAM_QUERY = `SELECT 
    home_team_appearances.shirt_number as number,
    home_team_appearances.position_code as position,
    home_team_appearances.starter as starter,
    home_team_appearances.substitute as susbtitute,
    home_team_players.given_name || ' ' || home_team_players.family_name as player
    FROM matches 
    INNER JOIN player_appearances home_team_appearances ON matches.match_id = home_team_appearances.match_id AND home_team_appearances.team_id = matches.home_team_id
    INNER JOIN players home_team_players ON home_team_appearances.player_id = home_team_players.player_id
    WHERE matches.key_id = ?
    ORDER BY
        starter=1 DESC,
        position='GK' DESC,
        position='CB' DESC,
        position='LB' DESC,
        position='RB' DESC,
        position='LWB' DESC,
        position='RWB' DESC,
        position='SW' DESC,
        position='DF' DESC,
        position='DM' DESC,
        position='CM' DESC,
        position='AM' DESC,
        position='LM' DESC,
        position='RM' DESC,
        position='MF' DESC,
        position='CF' DESC,
        position='FW' DESC,
        position='LF' DESC,
        position='RF' DESC,
        position='LW' DESC,
        position='RW' DESC,
        position='SS' DESC`;

export const MATCH_AWAY_TEAM_QUERY = `SELECT 
    away_team_appearances.shirt_number as number,
    away_team_appearances.position_code as position,
    away_team_appearances.starter as starter,
    away_team_appearances.substitute as susbtitute,
    away_team_players.given_name || ' ' || away_team_players.family_name as player
    FROM matches 
    INNER JOIN player_appearances away_team_appearances ON matches.match_id = away_team_appearances.match_id AND  away_team_appearances.team_id = matches.away_team_id
    INNER JOIN players away_team_players ON away_team_appearances.player_id = away_team_players.player_id
    WHERE matches.key_id = ? 
    ORDER BY
        starter=1 DESC,
        position='GK' DESC,
        position='CB' DESC,
        position='LB' DESC,
        position='RB' DESC,
        position='LWB' DESC,
        position='RWB' DESC,
        position='SW' DESC,
        position='DF' DESC,
        position='DM' DESC,
        position='CM' DESC,
        position='AM' DESC,
        position='LM' DESC,
        position='RM' DESC,
        position='MF' DESC,
        position='CF' DESC,
        position='FW' DESC,
        position='LF' DESC,
        position='RF' DESC,
        position='LW' DESC,
        position='RW' DESC,
        position='SS' DESC`;

export const MATCH_HOME_MANAGERS_QUERY = `SELECT 
    managers.given_name || ' ' || managers.family_name as name,
    managers.country_name as country
    FROM matches 
    INNER JOIN manager_appearances ON matches.match_id = manager_appearances.match_id AND matches.home_team_id = manager_appearances.team_id 
    INNER JOIN managers ON manager_appearances.manager_id = managers.manager_id
    WHERE matches.key_id = ?`;

export const MATCH_AWAY_MANAGERS_QUERY = `SELECT 
    managers.given_name || ' ' || managers.family_name as name,
    managers.country_name as country
    FROM matches 
    INNER JOIN manager_appearances ON matches.match_id = manager_appearances.match_id AND matches.away_team_id = manager_appearances.team_id 
    INNER JOIN managers ON manager_appearances.manager_id = managers.manager_id
    WHERE matches.key_id = ?`;

export const MATCH_GOALS_QUERY = `SELECT
    players.given_name || ' ' || players.family_name as name,
    goals.penalty, 
    goals.minute_label as minute,
    goals.own_goal,
    goals.home_team,
    goals.away_team
    FROM goals
    INNER JOIN players ON players.player_id = goals.player_id
    INNER JOIN matches ON matches.match_id = goals.match_id
    WHERE matches.key_id = ?`;

export const MATCH_BOOKINGS_QUERY = `SELECT
    players.given_name || ' ' || players.family_name as name,
    bookings.yellow_card, 
    bookings.red_card,
    bookings.second_yellow_card, 
    bookings.sending_off, 
    bookings.minute_label as minute,
    bookings.home_team,
    bookings.away_team
    FROM bookings
    INNER JOIN players ON players.player_id = bookings.player_id
    INNER JOIN matches ON matches.match_id = bookings.match_id
    WHERE matches.key_id = ?`;

export const MATCH_SUBSTITUTIONS_QUERY = `SELECT
    players.given_name || ' ' || players.family_name as name,
    substitutions.going_off, 
    substitutions.coming_on, 
    substitutions.minute_label as minute,
    substitutions.home_team,
    substitutions.away_team
    FROM substitutions
    INNER JOIN players ON players.player_id = substitutions.player_id
    INNER JOIN matches ON matches.match_id = substitutions.match_id
    WHERE matches.key_id = ?`;

export const SIMILAR_MATCHES_QUERY = `SELECT 
    matches.key_id as id,
    matches.match_name as name,
    matches.stage_name,
    matches.match_date,
    matches.match_time,
    matches.extra_time,
    matches.home_team_score,
    matches.away_team_score,
    matches.penalty_shootout,
    matches.score,
    matches.score_penalties,
    home_team.team_code as home_team_code,
    home_team.team_name as home_team_name,
    away_team.team_code as away_team_code,
    away_team.team_name as away_team_name,
    tournaments.tournament_name,
    tournaments.tournament_id
    FROM matches 
    INNER JOIN tournaments ON tournaments.tournament_id = matches.tournament_id
    INNER JOIN teams home_team ON matches.home_team_id = home_team.team_id
    INNER JOIN teams away_team ON matches.away_team_id = away_team.team_id
    WHERE (
        (matches.home_team_id = ?1 AND matches.away_team_id = ?2) 
        OR (matches.home_team_id = ?2 AND matches.away_team_id = ?1)
    ) AND matches.key_id != ?3`;

export function matchTransformer(
    input: RawMatch, 
    homeTeam: any, 
    awayTeam: any, 
    homeManagers: Manager[], 
    awayManagers: Manager[], 
    goals: Goal[], 
    bookings: Booking[],
    substitutions: Substitution[],
    similarGames: SimpleMatch[],
    ): Match {
    
    return {
        id: input.id,
        name: input.name,
        tournament_name: input.tournament_name,
        stage_name: input.stage_name,
        match_date: input.match_date,
        match_time: input.match_time,
        home_team_score: input.home_team_score,
        away_team_score: input.away_team_score,
        score: input.score,
        score_penalties: input.score_penalties,
        video: input.video,
        image: input.image,
        extra_time: input.extra_time,
        penalty_shootout: input.penalty_shootout,
        home_team: {
            name: input.home_team_name,
            code: input.home_team_code
        },
        away_team: {
            name: input.away_team_name,
            code: input.away_team_code
        },
        stadium: {
            name: input.stadium_name,
            city: input.stadium_city,
            country: input.stadium_country,
            capacity: input.stadium_capacity,
        },
        referee: {
            name: `${input.referee_first_name} ${input.referee_last_name}`,
            country: input.referee_country,
        },
        home_squad: homeTeam,
        away_squad: awayTeam,
        home_managers: homeManagers,
        away_managers: awayManagers,
        goals: goals,
        bookings: bookings,
        substitutions: substitutions,
        similar_games: similarGames,
    };
}