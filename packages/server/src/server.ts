import { html } from '@elysiajs/html';
import { swagger } from '@elysiajs/swagger';
import { Elysia, t } from 'elysia';
import jamRoutes from './routes/jams';
import { loginRoutes } from './routes/login';
import { postsRoutes } from './routes/posts';
import { userRoutes } from './routes/users';
import { jamFeed } from './routes/jamFeed';
import { Logestic } from 'logestic';

export const api = new Elysia({ prefix: '/api' })
  .use(Logestic.preset('common'))
  .use(html())
  .use(loginRoutes)
  .use(postsRoutes)
  .use(userRoutes)
  .use(jamRoutes());

const app = new Elysia().use(jamFeed).use(api).use(swagger());

// if (process.env.NODE_ENV !== 'development') {
//   app
//     .use(
//       staticPlugin({
//         prefix: '',
//         assets: 'public',
//       }),
//     )
//     .get('*', () => Bun.file('public/index.html'));
// } else {
//   app.get('/', ({ redirect }) => redirect(process.env.DEV_SERVER!));
// }

app.listen(3000, (debug) => console.log(`🚀 running on ${debug.url.origin}`));

export type App = typeof app;
export * from '@prisma/client';
