import { Team } from "./team";
import { Stadium } from "./stadium";
import { Referee } from "./referee";

export type RawMatch = {
    id: string;
    name: string;
    stage_name: string;
    match_date: string;
    match_time: string;
    home_team_score: number;
    away_team_score: number;
    score: string;
    score_penalties: string;
    extra_time: boolean;
    penalty_shootout: boolean;
    home_team_code: string;
    home_team_name: string;
    away_team_code: string;
    away_team_name: string;
    stadium_name: string,
    stadium_city: string,
    stadium_country: string,
    stadium_capacity: number,
    referee_first_name: string,
    referee_last_name: string,
    referee_country: string,
};

export type Match = {
    id: string;
    name: string;
    stage_name: string;
    match_date: string;
    match_time: string;
    home_team_score: number;
    away_team_score: number;
    score: string;
    score_penalties: string;
    extra_time: boolean;
    penalty_shootout: boolean;
    home_team: Team;
    away_team: Team;
    stadium: Stadium;
    referee: Referee;
};

export const MATCH_QUERY = `SELECT 
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
    stadiums.stadium_name as stadium_name,
    stadiums.city_name as stadium_city,
    stadiums.country_name as stadium_country,
    stadiums.stadium_capacity as stadium_capacity,
    referees.given_name as referee_first_name,
    referees.family_name as referee_last_name,
    referees.country_name as referee_country
    FROM matches 
    INNER JOIN teams home_team ON matches.home_team_id = home_team.team_id
    INNER JOIN teams away_team ON matches.away_team_id = away_team.team_id
    INNER JOIN stadiums ON matches.stadium_id = stadiums.stadium_id
    INNER JOIN referee_appearances ON matches.match_id = referee_appearances.match_id
    INNER JOIN referees ON referee_appearances.referee_id = referees.referee_id
    WHERE matches.key_id = ?`;

export function matchTransformer(input: RawMatch): Match {
    return {
        id: input.id,
        name: input.name,
        stage_name: input.stage_name,
        match_date: input.match_date,
        match_time: input.match_time,
        home_team_score: input.home_team_score,
        away_team_score: input.away_team_score,
        score: input.score,
        score_penalties: input.score_penalties,
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
        }
    };
}