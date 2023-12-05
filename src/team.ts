import { Manager } from "./manager";
import { Player } from "./player";
import { MatchSummary } from "./teamMatches";
import { Tournament } from "./tournaments";

export type Team = {
    name: string,
    code: string,
};

export type Squad = {
    country: Team,
    performance: string,
    managers: Array<Manager>,
    matches: Array<MatchSummary>,
    players: Array<SquadMember>,
    tournament: Tournament,
}

export type SquadMember = {
    player: Player,
    number: string,
    position: string,
}

export const SQUAD_PLAYERS_TOURNAMENT_QUERY = `SELECT 
    squad_members.shirt_number,
    squad_members.position_code as position,
    players.given_name || ' ' || players.family_name as player,
    COUNT(goals.key_id) as goal_count
    FROM squad_members
    INNER JOIN teams ON teams.team_id = squad_members.team_id
    INNER JOIN players ON players.player_id = squad_members.player_id
    LEFT JOIN goals ON goals.player_id = squad_members.player_id AND goals.tournament_id = ?1 AND goals.own_goal = 0
    WHERE squad_members.tournament_id = ?1 
    AND teams.team_code = ?2
    GROUP BY squad_members.player_id
    ORDER BY squad_members.shirt_number`;

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

export function squadTransformer(squad: any, players: SquadMember[], managers: Manager[], matches: MatchSummary[], tournament: Tournament): Squad {

    return {
        country: {
            name: squad.team_name,
            code: squad.team_code
        },
        performance: squad.performance,
        managers: managers,
        matches: matches,
        players: players,
        tournament: tournament,
    };
}