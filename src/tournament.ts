export type SingleTournament = {
    id: string;
    name: string;
    host_country: string;
    count_teams: number,
    year: number;
    start_date: string;
    end_date: string;
};

export const TOURNAMENT_QUERY = `SELECT 
    tournaments.tournament_id as id,
    tournaments.tournament_name as name,
    tournaments.host_country as host_country,
    tournaments.year as year,
    tournaments.count_teams as count_teams,
    tournaments.start_date,
    tournaments.end_date
    FROM tournaments 
    WHERE tournaments.tournament_id = ?`;