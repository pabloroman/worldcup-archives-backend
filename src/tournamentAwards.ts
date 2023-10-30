export type Award = {
    player: string,
    award_name: string,
    player_team_name: string,
    player_team_code: string,
};

export const TOURNAMENT_AWARDS_QUERY = `SELECT 
    players.given_name || ' ' || players.family_name as player,
    awards.award_name,
    player_teams.team_name as player_team_name,
    player_teams.team_code as player_team_code
    FROM tournaments 
    INNER JOIN award_winners ON award_winners.tournament_id = tournaments.tournament_id
    INNER JOIN awards ON awards.award_id = award_winners.award_id
    INNER JOIN players ON players.player_id = award_winners.player_id
    JOIN teams player_teams ON award_winners.team_id = player_teams.team_id
    WHERE tournaments.tournament_id = ?`;
