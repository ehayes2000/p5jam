export interface User {
  userId: number;
  displayName: string;
  commentCount: number;
  postCount: number;
}

export interface Post {
  likeCount: number;
  viewCount: number;
  description: string;
  script: string;
  published: Date;
  author: User;
  postId: number;
  commentCount: number;
}
