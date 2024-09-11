import { type User, type Post } from "./types";

let users: User[] = [
  {
    userId: 0,
    displayName: "Bird Guy",
    commentCount: 2,
    postCount: 2,
  },
  {
    userId: 1,
    displayName: "Rat Guy",
    commentCount: 1,
    postCount: 1,
  },
  {
    userId: 2,
    displayName: "Feet Guy",
    commentCount: 100,
    postCount: 200,
  },
];
let maxUser = 2;

let posts: Post[] = [
  {
    likeCount: 4,
    viewCount: 100,
    description: "I love birds !",
    script: "let birds = true;",
    published: new Date(),
    author: users[0],
    commentCount: 1,
    postId: 1,
  },
  {
    likeCount: 40,
    viewCount: 100000,
    description: "I hate birds",
    script: "let birds = die;",
    published: new Date(),
    author: users[1],
    commentCount: 40,
    postId: 2,
  },
  {
    likeCount: -4,
    viewCount: 10,
    description: "too many posts about birds guys",
    script: "let toes = true;",
    published: new Date(),
    author: users[2],
    commentCount: 3,
    postId: 3,
  },
  {
    likeCount: -400,
    viewCount: 10,
    description: "Why am I being downvoted?",
    script: "I didn't do this part",
    published: new Date(),
    author: users[2],
    commentCount: 100,
    postId: 4,
  },
  {
    likeCount: 1200,
    viewCount: 12000,
    description: "ur wierd",
    script: "//boids algorithm",
    published: new Date(),
    author: users[0],
    commentCount: 100,
    postId: 4,
  },
];
export async function getPosts(): Promise<Post[]> {
  await fakeNetwork();
  return posts;
}

export async function createPost(
  post: Omit<Post, "likeCount" | "viewCount" | "published">
): Promise<void> {
  await fakeNetwork();
  const newPost: Post = {
    ...post,
    published: new Date(),
    likeCount: 0,
    viewCount: 0,
  };
  posts.push(newPost);
}

export async function getUsers(): Promise<User[]> {
  await fakeNetwork();
  return users;
}

export async function createUser(name: string): Promise<User | null> {
  await fakeNetwork();
  if (Math.random() < 0.15) {
    return null;
  }
  maxUser++;
  const newUser: User = {
    displayName: name,
    userId: maxUser,
    postCount: 0,
    commentCount: 0,
  };
  users.push(newUser);
  return newUser;
}

async function fakeNetwork(): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
