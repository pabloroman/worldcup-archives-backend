import { Hono } from 'hono'
import { cors } from 'hono/cors';

import { ALL_TOURNAMENTS_QUERY, Tournament, tournamentTransformer } from './tournament';

const app = new Hono()

app.use('/api/*', cors());

app.get('/api/tournaments/:gender', async c => {
  const { gender } = c.req.param();
  const { results } = await c.env.DB.prepare(ALL_TOURNAMENTS_QUERY).bind(Number(gender == 'female')).all();

  const group: Tournament[] = tournamentTransformer(results);

  return c.json(group);
})

export default app;