import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import { PopupProvider } from './state';
import { LoginContextProvider } from './login';
import { client, type TJam, type TPost, type TUser } from './client';
import EditPost from './pages/editPost';
import ErrorPage from './pages/errorPage';
import Home from './pages/home';
import Jam from './components/Jam';
import MyJams from './pages/myJams';
import LoginPage from './pages/login';
import PostDetails from './pages/postDetails';
import Root from './pages/root';
import User from './pages/user';
import Users from './pages/users';
import type { TProfile, TJamPage } from "./types"
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'highlight.js/styles/default.min.css';
import './index.css';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'users',
        loader: async (): Promise<TUser[]> => {
          const response = await client.api.users.get();
          if (response.error !== null)
            throw new Response('Error fetching users', {
              status: response.status,
            });
          return response.data;
        },
        element: <Users />,
      },
      {
        path: 'user/:name',
        loader: async ({
          params: { name },
        }): Promise<TProfile> => {
          if (!name) throw new Response('Not Found', { status: 404 });
          const { data: user } = await client.api.users.user.get({ query: { name } })
          if (!user) throw new Response('Not Found', { status: 404 });
          const { data: posts } = await client.api.posts.get({
            query: { userId: user.id },
          });
          if (!posts) throw new Response('Not Found', { status: 404 });
          return { posts, user: user };
        },
        element: <User />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'profile',
        loader: async (): Promise<TProfile> => {
          const { data: myId } = await client.api.login.myid.get();
          if (!myId) throw redirect('/login');
          const { data: user } = await client.api.users.user.get({ query: { id: myId.id } })
          if (!user)
            throw new Response("User Not Found", { status: 404 })
          const { data: posts } = await client.api.posts.get({
            query: { userId: myId.id },
          });
          if (!posts)
            throw new Response('Error Getting Profile', { status: 500 });
          return {
            posts, user
          };
        },
        element: <User />,
      },
      {
        path: 'editPost/:id',
        loader: async ({ params: { id } }): Promise<TPost> => {
          const response = await client.api.posts({ id: String(id) }).get();
          const idResponse = await client.api.login.myid.get();
          if (idResponse.error !== null) {
            throw redirect('/login');
          }
          if (response.error !== null) {
            throw new Response('Not Found', { status: 404 });
          }
          const myId = idResponse.data.id;
          const post = response.data;
          if (post.authorId !== myId) {
            throw new Response('Forbidden', {
              status: 403,
              statusText: "That's not your post",
            });
          }
          return post;
        },
        element: <EditPost />,
      },
      {
        path: 'posts/:id',
        loader: async ({ params: { id } }): Promise<TPost> => {
          const { data: post } = await client.api
            .posts({ id: String(id) })
            .get();
          if (!post)
            throw new Response('Not Found', {
              status: 404,
              statusText: 'Cold not find post',
            });
          return post;
        },
        element: <PostDetails />,
      },
      {
        path: 'jam/:id',
        loader: async ({ params: { id } }): Promise<TJamPage> => {
          const response = await client.api.jams({ id: String(id) }).get();
          if (response.error !== null) {
            throw new Response('Not Found', { status: 404 });
          }
          const { data: posts } = await client.api.posts.get({ query: { jamId: id } })
          if (posts === null)
            throw new Response("Not Found", { status: 404 })
          return { jam: response.data, posts: posts }
        },
        element: <Jam />,
      },
      {
        path: 'jam/myJams',
        loader: async (): Promise<{ owner: TJam[]; participant: TJam[] }> => {
          const response = await client.api.login.myid.get();
          if (!response.data) throw redirect('/login');
          const { data: jams } = await client.api.jams.get({
            query: { userId: response.data.id },
          });
          if (!jams) return { owner: [], participant: [] }; // TODO
          return jams;
        },
        element: <MyJams />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <LoginContextProvider>
    <PopupProvider>
      <RouterProvider router={router} />
    </PopupProvider>
  </LoginContextProvider>
);
