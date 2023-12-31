import { Team } from "./team";

export type RawMatch = {
    id: string;
    name: string;
    stage_name: string;
    match_date: string;
    match_time: string;
    home_team_score: number;
    away_team_score: number;
    home_team_score_penalties: number,
    away_team_score_penalties: number,
    score: string;
    score_penalties: string;
    extra_time: boolean;
    penalty_shootout: boolean;
    home_team_code: string;
    home_team_name: string;
    away_team_code: string;
    away_team_name: string;
};

export type MatchSummary = {
    id: string;
    name: string;
    stage_name: string;
    match_date: string;
    match_time: string;
    home_team_score: number;
    away_team_score: number;
    home_team_score_penalties: number,
    away_team_score_penalties: number,
    score: string;
    score_penalties: string;
    extra_time: boolean;
    penalty_shootout: boolean;
    home_team: Team;
    away_team: Team;
};

export const TEAM_MATCHES_QUERY = `SELECT 
    matches.key_id as id,
    matches.match_name as name,
    matches.stage_name,
    matches.match_date,
    matches.match_time,
    matches.extra_time,
    matches.home_team_score,
    matches.away_team_score,
    matches.home_team_score_penalties,
    matches.away_team_score_penalties,
    matches.penalty_shootout,
    matches.score,
    matches.score_penalties,
    home_team.team_code as home_team_code,
    home_team.team_name as home_team_name,
    away_team.team_code as away_team_code,
    away_team.team_name as away_team_name
    FROM matches 
    INNER JOIN team_appearances ON team_appearances.match_id = matches.match_id
    INNER JOIN teams ON team_appearances.team_id = teams.team_id
    INNER JOIN teams home_team ON matches.home_team_id = home_team.team_id
    INNER JOIN teams away_team ON matches.away_team_id = away_team.team_id
    WHERE matches.tournament_id = ? AND
    teams.team_code = ?`;


export function teamMatchesTransformer(input: RawMatch[]): MatchSummary[] {
    const resultMap: { [key: string]: MatchSummary } = {};

    input.forEach(entry => {
        if (!resultMap[entry.id]) {
            resultMap[entry.id] = {
                id: entry.id,
                name: entry.name,
                stage_name: entry.stage_name,
                match_date: entry.match_date,
                match_time: entry.match_time,
                home_team_score: entry.home_team_score,
                away_team_score: entry.away_team_score,
                home_team_score_penalties: entry.home_team_score_penalties,
                away_team_score_penalties: entry.away_team_score_penalties,
                score: entry.score,
                score_penalties: entry.score_penalties,
                extra_time: entry.extra_time,
                penalty_shootout: entry.penalty_shootout,
                home_team: {
                    name: entry.home_team_name,
                    code: entry.home_team_code
                },
                away_team: {
                    name: entry.away_team_name,
                    code: entry.away_team_code
                },
            };
        }
    });

    return Object.values(resultMap);
}