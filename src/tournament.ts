export type RawTournament = {
    id: string;
    name: string;
    host_country: string;
    year: number;
    winner_team_name: string;
    winner_team_code: string;
    family_name: string;
    given_name: string;
    award_name: string;
};


export type Tournament = {
    id: string;
    name: string;
    host_country: string;
    year: number;
    winner: {
        team_name: string;
        team_code: string;
    };
    awards: Array<{
        player: string;
        name: string;
    }>;
};

export const ALL_TOURNAMENTS_QUERY = `SELECT 
    tournaments.tournament_id as id,
    tournaments.tournament_name as name,
    tournaments.host_country as host_country,
    tournaments.year as year,
    winner.team_name as winner_team_name,
    winner.team_code as winner_team_code,
    players.family_name,
    players.given_name,
    awards.award_name
    FROM tournaments 
    INNER JOIN teams winner ON winner.team_name = tournaments.winner 
    INNER JOIN award_winners ON award_winners.tournament_id = tournaments.tournament_id
    INNER JOIN awards ON awards.award_id = award_winners.award_id
    INNER JOIN players ON players.player_id = award_winners.player_id
    WHERE tournaments.female = ?`;


export function tournamentTransformer(input: RawTournament[]): Tournament[] {
    const resultMap: { [key: string]: Tournament } = {};

    input.forEach(entry => {
        if (!resultMap[entry.id]) {
            resultMap[entry.id] = {
                id: entry.id,
                name: entry.name,
                host_country: entry.host_country,
                year: entry.year,
                winner: {
                    team_name: entry.winner_team_name,
                    team_code: entry.winner_team_code
                },
                awards: []
            };
        }
        resultMap[entry.id].awards.push({
            player: `${entry.given_name} ${entry.family_name}`,
            name: entry.award_name
        });
    });

    return Object.values(resultMap);
}