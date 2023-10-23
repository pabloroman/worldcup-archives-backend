import { Manager } from "./manager";
import { Match } from "./match";
import { Player } from "./player";
import { MatchSummary } from "./teamMatches";

export type Team = {
    name: string,
    code: string,
};

export type Squad = {
    country: Team,
    performance: string,
    managers: Array<Manager>,
    matches: Array<MatchSummary>,
    players: Array<{
        player: Player,
        number: string,
        position: string,
    }>;
}

export const SQUAD_PLAYERS_TOURNAMENT_QUERY = `SELECT 
    squad_members.shirt_number,
    squad_members.position_code as position,
    players.given_name as first_name,
    players.family_name as last_name
    FROM squad_members
    INNER JOIN teams ON teams.team_id = squad_members.team_id
    INNER JOIN players ON players.player_id = squad_members.player_id
    WHERE squad_members.tournament_id = ? 
    AND teams.team_code = ? ORDER BY shirt_number`;

export const SQUAD_TOURNAMENT_QUERY = `SELECT
    qualified_teams.performance,
    teams.team_code,
    teams.team_name
    FROM qualified_teams
    INNER JOIN teams ON teams.team_id = qualified_teams.team_id
    WHERE qualified_teams.tournament_id = ?
    AND teams.team_code = ?`;

export const SQUAD_MANAGERS_TOURNAMENT_QUERY = `SELECT
    managers.given_name || ' ' || managers.family_name as name,
    managers.country_name as country
    FROM manager_appointments
    INNER JOIN managers ON manager_appointments.manager_id = managers.manager_id
    INNER JOIN teams ON teams.team_id = manager_appointments.team_id
    WHERE manager_appointments.tournament_id = ?
    AND teams.team_code = ?`;

export function squadTransformer(squad: any, players: any[], managers: Manager[], matches: MatchSummary[]): Squad {

    return {
        country: {
            name: squad.team_name,
            code: squad.team_code
        },
        performance: squad.performance,
        managers: managers,
        matches: matches,
        players: players,
    };
}