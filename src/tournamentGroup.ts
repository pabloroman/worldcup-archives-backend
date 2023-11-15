export type RawGroup = {
    stage_number: string,
    stage_name: string,
    group_name: string,
    position: number,
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goals_for: number,
    goals_against: number,
    goal_difference: number,
    points: number,
    advanced: boolean,
    team_name: string,
    team_code: string,
};

export type Stage = {
    number: string,
    name: string,
    groups: Array<Group>,
};

export type Group = {
    stage_number: string,
    stage_name: string,
    name: string,
    groupStandings: Array<GroupStanding>,
};

export type GroupStanding = {
    position: number,
    played: number,
    wins: number,
    draws: number,
    losses: number,
    goals_for: number,
    goals_against: number,
    goal_difference: number,
    points: number,
    advanced: boolean,
    team_name: string,
    team_code: string,
};

export const TOURNAMENT_GROUPS_QUERY = `SELECT  
    group_standings.stage_number,
    group_standings.stage_name,
    group_standings.group_name,
    group_standings.position,
    group_standings.played,
    group_standings.wins,
    group_standings.draws,
    group_standings.losses,
    group_standings.goals_for,
    group_standings.goals_against,
    group_standings.goal_difference,
    group_standings.points,
    group_standings.advanced,
    teams.team_name,
    teams.team_code
    FROM group_standings 
    INNER JOIN teams ON teams.team_id = group_standings.team_id
    WHERE group_standings.tournament_id = ?
    ORDER BY stage_number DESC, group_name ASC, position ASC`

export function groupsTransformer(input: RawGroup[]): Stage[] {

    const groupMap: { [key: string]: Group } = {};

    input.forEach(entry => {

        const groupStanding: GroupStanding = {
            position: entry.position,
            played: entry.played,
            wins: entry.wins,
            draws: entry.draws,
            losses: entry.losses,
            goals_for: entry.goals_for,
            goals_against: entry.goals_against,
            goal_difference: entry.goal_difference,
            points: entry.points,
            advanced: entry.advanced,
            team_name: entry.team_name,
            team_code: entry.team_code,
        }

        if (!groupMap[`${entry.stage_name}${entry.group_name}`]) {
            groupMap[`${entry.stage_name}${entry.group_name}`] = {
                stage_number: entry.stage_number,
                stage_name: entry.stage_name,
                name: entry.group_name,
                groupStandings: []
            }
        }
        groupMap[`${entry.stage_name}${entry.group_name}`].groupStandings.push(groupStanding)
    });

    const stageMap: { [key: string]: Stage } = {};
    Object.values(groupMap).forEach(entry => {
        if (!stageMap[entry.stage_name]) {
            stageMap[entry.stage_name] = {
                number: entry.stage_number,
                name: entry.stage_name,
                groups: []
            }
        }
        stageMap[entry.stage_name].groups.push(entry)
    })

    return Object.values(stageMap);
};
