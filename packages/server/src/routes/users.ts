import { Elysia, t } from 'elysia';
import { auth } from '../githubAuth';
import { getUsers } from '../services/primitives/users';
import { get } from '../services/primitives/posts';

export const userRoutes = new Elysia()
  .get('/users', async () => {
    return await getUsers({});
  })
  .get(
    '/users/user',
    async ({ query: { name, id }, error }) => {
      if (!name && !id) return error(422, 'Provide one of: id, name');
      const user = await getUsers({ name, id });
      if (user.length) return user[0];
      return error(404, 'Not Found');
    },
    {
      query: t.Object({
        name: t.Optional(t.String()),
        id: t.Optional(t.String()),
      }),
    },
  )
  .get('/users/user/:id', async ({ params: { id }, error }) => {
    const user = await getUsers({ id });
    if (user.length) return user[0];
    return error(404, 'Not Found');
  })
  .use(auth)
  .get(
    '/users/user/draftPosts',
    async ({ userId }) => {
      return get({ authorIds: [userId], isUnpublished: true });
    },
    {
      isSignIn: true,
    },
  );
