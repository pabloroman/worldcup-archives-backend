import { Player } from "./player";

export type Goal = {
    name: string,
    minute: string,
    penalty: boolean,
    own_goal: boolean,
    home_team: boolean,
    away_team: boolean,
};