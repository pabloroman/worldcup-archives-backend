import { Hono } from 'hono'
import { cors } from 'hono/cors';

import { ALL_TOURNAMENTS_QUERY, Tournament, tournamentTransformer } from './tournament';

const app = new Hono()

app.use('/api/*', cors());

app.get('/api/tournaments/:gender', async ctx => {
  const { gender } = ctx.req.param();
  const { results } = await ctx.env.DB.prepare(ALL_TOURNAMENTS_QUERY).bind(Number(gender == 'female')).all();

  const group: Tournament[] = tournamentTransformer(results);

  return ctx.json(group);
})

export default app;