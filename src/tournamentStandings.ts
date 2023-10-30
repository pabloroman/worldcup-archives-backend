export type Standing = {
    position: number,
    team_name: string,
    team_code: string,
};

export const TOURNAMENT_STANDINGS_QUERY = `SELECT 
    tournament_standings.position,
    teams.team_name,
    teams.team_code
    FROM tournament_standings 
    INNER JOIN teams ON teams.team_id = tournament_standings.team_id
    WHERE tournament_standings.tournament_id = ? 
    ORDER BY position ASC 
    LIMIT 3`;
