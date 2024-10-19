import { Elysia, t } from 'elysia';
import { auth } from '../githubAuth';
import JamService from '../services/JamService';
import { type TJam } from '../services/primitives/types';

export default function jamRoutes() {
  return makeJamRoutes(auth);
}

export const makeJamRoutes = (authPlugin: typeof auth) => {
  return new Elysia()
    .decorate('JamService', new JamService())
    .get('/jams/:id', async ({ params: { id }, error, JamService }) => {
      const jams = await JamService.get(id);
      if (!jams) return error(404);
      return jams;
    })
    .get(
      '/jams',
      async ({ query: { userId }, JamService }) => {
        return await JamService.list({ userId });
      },
      {
        query: t.Object({
          userId: t.Optional(t.String()),
        }),
      },
    )
    .use(authPlugin)
    .post(
      '/jams',
      async ({ userId, body: { durationMs, title }, JamService }) => {
        const jam = await JamService.create({
          userId,
          durationMs,
          title: title?.trim() ?? '',
        });
        return jam;
      },
      {
        isSignIn: true,
        body: t.Object({
          title: t.Optional(t.String()),
          durationMs: t.Integer(),
        }),
      },
    );
};
