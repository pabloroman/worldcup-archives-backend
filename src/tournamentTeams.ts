export const TOURNAMENT_TEAMS_QUERY = `SELECT 
    teams.team_name as name,
    teams.team_code as code
    FROM tournaments 
    INNER JOIN qualified_teams ON qualified_teams.tournament_id = tournaments.tournament_id
    INNER JOIN teams ON qualified_teams.team_id = teams.team_id 
    WHERE tournaments.tournament_id = ?`;