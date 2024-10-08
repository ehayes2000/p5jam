import { treaty } from '@elysiajs/eden';
import type { App } from 'server';

export const client = treaty<App>('', {
  fetcher(url, options) {
    const [_, path] = url.toString().split('//');
    return fetch(`${import.meta.env.VITE_API_BASE}/${path}`, options);
  },
});

export type TPost = NonNullable<
  Awaited<ReturnType<ReturnType<typeof client.api.posts>['get']>>['data']
>;

export type TJam = NonNullable<
  Awaited<ReturnType<ReturnType<typeof client.api.jams>['get']>>['data']
>;

export type TEditPost = NonNullable<
  Awaited<ReturnType<typeof client.api.posts.post>>['data']
>;

export type TUser = NonNullable<
  Awaited<ReturnType<typeof client.api.users.get>>['data']
>[number];
