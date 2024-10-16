// import { useQuery } from '@tanstack/react-query';
// import { Link, useNavigate } from 'react-router-dom';
// import { client, type TPost } from '../client';
// import Post from '../components/Post';
// import { QUERY_KEYS, useMyID } from '../queries/queryClient';
// import { store } from '../stateStore';

// function Profile() {
//   const navigate = useNavigate();
//   // TODO: login redirect
//   const { data: myId } = useMyID();
//   const { data: myPosts } = useQuery({
//     queryKey: QUERY_KEYS.USER_POSTS(myId ?? ''),
//     queryFn: async () => {
//       const { data } = await client.api.posts.get({
//         query: { userId: myId ?? '' },
//       });
//       return data;
//     },
//     enabled: !!myId,
//   });

//   const deletePost = async (id: string) => {
//     await client.api.posts({ id }).delete();
//   };

//   // TODO fix
//   const editPost = (post: TPost) => {
//     store.send({ type: 'postCreated', payload: { post: post } });
//     return navigate(`/editPost/${post.id}`);
//   };

//   return (
//     <div className="grid justify-center gap-4 p-6">
//       {myPosts ? (
//         <>
//           {myPosts.map((p) => (
//             <div key={p.id}>
//               <div className="lex flex gap-1 p-1">
//                 <button
//                   onClick={() => editPost(p)}
//                   className="rounded-sm bg-gray-200 px-2 hover:bg-gray-300"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deletePost(p.id)}
//                   className="rounded-sm bg-gray-200 px-2 hover:bg-gray-300"
//                 >
//                   Delete
//                 </button>
//               </div>
//               <Post key={p.id} post={p} />
//             </div>
//           ))}
//         </>
//       ) : (
//         <Link to="/login" />
//       )}
//     </div>
//   );
// }

// export default Profile;
