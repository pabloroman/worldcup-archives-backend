import { Player } from "./player";
import { Team } from "./team";

export type TopScorer = {
    player: Player,
    team: Team,
    count: string,
};

export const TOURNAMENT_TOP_SCORERS_QUERY = `SELECT 
    players.given_name || ' ' || players.family_name as player, 
    teams.team_code, 
    teams.team_name, 
    COUNT(*) as count 
    FROM goals 
        INNER JOIN teams ON teams.team_id = goals.player_team_id 
        INNER JOIN players ON players.player_id = goals.player_id 
    WHERE tournament_id = ?
    GROUP BY goals.player_id 
    ORDER BY count DESC 
    LIMIT 10`;