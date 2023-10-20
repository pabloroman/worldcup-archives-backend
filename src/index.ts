import { Hono } from 'hono'
import { cors } from 'hono/cors';

import { ALL_TOURNAMENTS_QUERY, Tournament, tournamentTransformer } from './tournaments';
import { TOURNAMENT_QUERY } from './tournament';
import { TOURNAMENT_TEAMS_QUERY } from './tournamentTeams';
import { TOURNAMENT_MATCHES_QUERY, Match, matchTransformer } from './tournamentMatches';

const app = new Hono()

app.use('/api/*', cors());

app.get('/api/tournaments/:gender', async ctx => {
  const { gender } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(ALL_TOURNAMENTS_QUERY).bind(Number(gender == 'female')).all();

  const group: Tournament[] = tournamentTransformer(results);

  return ctx.json(group);
})

app.get('/api/tournament/:id', async ctx => {
  const { id } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(TOURNAMENT_QUERY).bind(id).all();

  return ctx.json(results[0]);
})

app.get('/api/tournament/:id/teams', async ctx => {
  const { id } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(TOURNAMENT_TEAMS_QUERY).bind(id).all();

  return ctx.json(results);
})

app.get('/api/tournament/:id/games', async ctx => {
  const { id } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(TOURNAMENT_MATCHES_QUERY).bind(id).all();

  const group: Match[] = matchTransformer(results);

  return ctx.json(group);
})

export default app;