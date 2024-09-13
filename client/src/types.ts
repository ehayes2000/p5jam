export interface User {
  id: string;
  displayName: string;
  commentCount: number;
  postCount: number;
}

export interface Post {
  likeCount: number;
  viewCount: number;
  description: string;
  content: string;
  // script: string; // is an html string // removed -- is a url
  published: Date;
  author: User;
  id: string;
  commentCount: number;
}

// TODO create draft
