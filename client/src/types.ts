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
  script: string; // is an html string
  published: Date;
  author: User;
  id: string;
  commentCount: number;
}

// TODO create draft
