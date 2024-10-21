import { get } from '../services/primitives/posts';
import { Elysia, t } from 'elysia';

export const jamFeed = new Elysia().ws('/ws/jam', {
  query: t.Object({
    jamId: t.String(),
  }),
  async open(ws) {
    const { jamId } = ws.data.query;
    const posts = await get({ jamIds: [jamId] });
    console.log('SEND POSTS', posts);
    ws.send(posts);
    ws.subscribe(jamId);
  },
});
