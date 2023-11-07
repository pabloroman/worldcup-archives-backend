import { Stadium } from "./stadium";
import { Team } from "./team";
import { TopScorer } from "./topScorer";
import { Award } from "./tournamentAwards";
import { Standing } from "./tournamentStandings";

export type RawTournament = {
    id: string,
    name: string,
    host_country: string,
    count_teams: number,
    year: number,
    start_date: string,
    end_date: string,
    description: string,
    winner_team_name: string,
    winner_team_code: string,
    player: string,
    award_name: string,
    player_team_name: string,
    player_team_code: string,
};

export type Tournament = {
    id: string,
    name: string,
    host_country: string,
    year: number,
    start_date: string,
    end_date: string,
    description: string,
    count_teams: number,
    winner: Team,
    awards?: Array<Award>,
    standings?: Array<Standing>,
    stadiums?: Array<Stadium>,
    top_scorers?: Array<TopScorer>,
};

export const SINGLE_TOURNAMENT_QUERY = `SELECT 
    tournaments.tournament_id as id,
    tournaments.tournament_name as name,
    tournaments.host_country as host_country,
    tournaments.year as year,
    tournaments.count_teams as count_teams,
    tournaments.start_date,
    tournaments.end_date,
    tournaments.description,
    winner.team_name as winner_team_name,
    winner.team_code as winner_team_code,
    players.given_name || ' ' || players.family_name as player,
    awards.award_name,
    player_teams.team_name as player_team_name,
    player_teams.team_code as player_team_code
    FROM tournaments 
    INNER JOIN teams winner ON winner.team_name = tournaments.winner 
    INNER JOIN award_winners ON award_winners.tournament_id = tournaments.tournament_id
    INNER JOIN awards ON awards.award_id = award_winners.award_id
    INNER JOIN players ON players.player_id = award_winners.player_id
    JOIN teams player_teams ON award_winners.team_id = player_teams.team_id
    WHERE tournaments.tournament_id = ?`;

export const ALL_TOURNAMENTS_QUERY = `SELECT 
    tournaments.tournament_id as id,
    tournaments.tournament_name as name,
    tournaments.host_country as host_country,
    tournaments.year as year,
    tournaments.start_date,
    tournaments.end_date,
    tournaments.description,
    tournaments.count_teams as count_teams,
    winner.team_name as winner_team_name,
    winner.team_code as winner_team_code,
    players.given_name || ' ' || players.family_name as player,
    awards.award_name,
    player_teams.team_name as player_team_name,
    player_teams.team_code as player_team_code
    FROM tournaments 
    INNER JOIN teams winner ON winner.team_name = tournaments.winner 
    INNER JOIN award_winners ON award_winners.tournament_id = tournaments.tournament_id
    INNER JOIN awards ON awards.award_id = award_winners.award_id
    INNER JOIN players ON players.player_id = award_winners.player_id
     JOIN teams player_teams ON award_winners.team_id = player_teams.team_id
    WHERE tournaments.female = ?
    ORDER BY tournaments.year DESC`;

export function multipleTournamentTransformer(input: RawTournament[]): Tournament[] {
    const resultMap: { [key: string]: Tournament } = {};

    input.forEach(entry => {
        if (!resultMap[entry.id]) {
            resultMap[entry.id] = {
                id: entry.id,
                name: entry.name,
                host_country: entry.host_country,
                year: entry.year,
                start_date: entry.start_date,
                end_date: entry.end_date,
                description: entry.description,
                count_teams: entry.count_teams,
                winner: {
                    name: entry.winner_team_name,
                    code: entry.winner_team_code
                },
                awards: [],
                standings: [],
                stadiums: [],
            };
        }
    });

    return Object.values(resultMap);
};

export function singleTournamentTransformer(
    input: RawTournament, 
    awards?: Award[], 
    standings?: Standing[], 
    stadiums?: Stadium[],
    topScorers?: TopScorer[]): Tournament {
    
    return {
        id: input.id,
        name: input.name,
        host_country: input.host_country,
        year: input.year,
        start_date: input.start_date,
        end_date: input.end_date,
        description: input.description,
        count_teams: input.count_teams,
        winner: {
            name: input.winner_team_name,
            code: input.winner_team_code
        },
        awards: awards,
        standings: standings,
        stadiums: stadiums,
        top_scorers: topScorers,
    };
}