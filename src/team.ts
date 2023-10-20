import { Player } from "./player";

export type Team = {
    name: string,
    code: string,
};

export type Squad = {
    country: Team,
    players: Array<{
        player: Player,
        number: string,
        position: string,
        starter: boolean,
        substitute: boolean,
    }>;
}