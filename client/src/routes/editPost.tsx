// import { createPost } from "../fakeServer";
// import { useNavigate } from "react-router-dom";

// interface NewPost {
//   description: string;
//   script: string;
// }

// export function makePost(post: NewPost) {
//   console.log("make", post);
//   createPost({
//     ...post,
//     likeCount: 0,
//     viewCount: 0,
//     published: new Date(),
//     authorId: "me",
//   });
// }

// function EditPost() {
//   const navigate = useNavigate();
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);
//     const post = Object.fromEntries(formData) as NewPost;
//     makePost(post);
//     navigate("/explore");
//     console.log(formData);
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       <span> Description </span>
//       <input placeholder="Description" type="text" name="description" />
//       <input placeholder="Script" type="text" name="script" />
//       <button type="submit"> Post </button>
//       <button type="button"> Cancel </button>
//     </form>
//   );
// }

function EditPost() {
  return <div> TODO </div>;
}

export default EditPost;
