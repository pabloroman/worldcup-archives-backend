import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { cache } from 'hono/cache';

import { ALL_TOURNAMENTS_QUERY, SINGLE_TOURNAMENT_QUERY, Tournament, singleTournamentTransformer, multipleTournamentTransformer } from './tournaments';
import { TOURNAMENT_TEAMS_QUERY } from './tournamentTeams';
import { TOURNAMENT_MATCHES_QUERY, Match, matchesTransformer } from './tournamentMatches';
import { MATCH_AWAY_MANAGERS_QUERY, MATCH_AWAY_TEAM_QUERY, MATCH_BOOKINGS_QUERY, MATCH_GOALS_QUERY, MATCH_HOME_MANAGERS_QUERY, MATCH_HOME_TEAM_QUERY, MATCH_QUERY, MATCH_SUBSTITUTIONS_QUERY, matchTransformer } from './match';
import { SQUAD_MANAGERS_TOURNAMENT_QUERY, SQUAD_PLAYERS_TOURNAMENT_QUERY, SQUAD_TOURNAMENT_QUERY, Squad, squadTransformer } from './team';
import { TEAM_MATCHES_QUERY, teamMatchesTransformer } from './teamMatches';
import { TOURNAMENT_AWARDS_QUERY } from './tournamentAwards';
import { TOURNAMENT_STANDINGS_QUERY } from './tournamentStandings';
import { TOURNAMENT_STADIUMS_QUERY } from './tournamentStadiums';

const app = new Hono()

app.use('/api/*', cors());

app.get('/api/*', cache({
  cacheName: 'worldcup-archives-5',
  cacheControl: 'public,max-age=2592000' // 30 days
}));

app.get('/api/tournaments/:gender', async ctx => {
  const { gender } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(ALL_TOURNAMENTS_QUERY).bind(Number(gender == 'female')).all();

  const group: Tournament[] = multipleTournamentTransformer(results);

  return ctx.json(group);
})

app.get('/api/tournament/:id', async ctx => {
  const { id } = ctx.req.param();
  const tournament = await ctx.env.DB.prepare(SINGLE_TOURNAMENT_QUERY).bind(id).first();
  const { results: awards } = await ctx.env.DB.prepare(TOURNAMENT_AWARDS_QUERY).bind(id).all();
  const { results: standings } = await ctx.env.DB.prepare(TOURNAMENT_STANDINGS_QUERY).bind(id).all();
  const { results: stadiums } = await ctx.env.DB.prepare(TOURNAMENT_STADIUMS_QUERY).bind(id).all();

  const group: Tournament = singleTournamentTransformer(tournament, awards, standings, stadiums);

  return ctx.json(group);
})

app.get('/api/tournament/:id/teams', async ctx => {
  const { id } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(TOURNAMENT_TEAMS_QUERY).bind(id).all();

  return ctx.json(results);
})

app.get('/api/tournament/:id/team/:team', async ctx => {
  const { id, team } = ctx.req.param();
  
  const squad = await ctx.env.DB.prepare(SQUAD_TOURNAMENT_QUERY).bind(id, team).first();
  const { results: players } = await ctx.env.DB.prepare(SQUAD_PLAYERS_TOURNAMENT_QUERY).bind(id, team).all();
  const { results: managers } = await ctx.env.DB.prepare(SQUAD_MANAGERS_TOURNAMENT_QUERY).bind(id, team).all();
  const { results: matches } = await ctx.env.DB.prepare(TEAM_MATCHES_QUERY).bind(id, team).all();
  const tournament = await ctx.env.DB.prepare(SINGLE_TOURNAMENT_QUERY).bind(id).first();

  const group: Squad = squadTransformer(squad, players, managers, teamMatchesTransformer(matches), singleTournamentTransformer(tournament));
 
  return ctx.json(group);
})

app.get('/api/tournament/:id/games', async ctx => {
  const { id } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(TOURNAMENT_MATCHES_QUERY).bind(id).all();

  const group: Match[] = matchesTransformer(results);

  return ctx.json(group);
})

app.get('/api/game/:id', async ctx => {
  const { id } = ctx.req.param();
  const match = await ctx.env.DB.prepare(MATCH_QUERY).bind(id).first();

  const { results: homeTeam } = await ctx.env.DB.prepare(MATCH_HOME_TEAM_QUERY).bind(id).all();
  const { results: awayTeam } = await ctx.env.DB.prepare(MATCH_AWAY_TEAM_QUERY).bind(id).all();

  const { results: homeManagers } = await ctx.env.DB.prepare(MATCH_HOME_MANAGERS_QUERY).bind(id).all();
  const { results: awayManagers } = await ctx.env.DB.prepare(MATCH_AWAY_MANAGERS_QUERY).bind(id).all();

  const { results: goals } = await ctx.env.DB.prepare(MATCH_GOALS_QUERY).bind(id).all();
  const { results: bookings } = await ctx.env.DB.prepare(MATCH_BOOKINGS_QUERY).bind(id).all();
  const { results: substitutions } = await ctx.env.DB.prepare(MATCH_SUBSTITUTIONS_QUERY).bind(id).all();

  const group: Match = matchTransformer(match, homeTeam, awayTeam, homeManagers, awayManagers, goals, bookings, substitutions);

  return ctx.json(group);
})

export default app;