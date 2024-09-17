export interface User {
  id: string
  name: string
  commentCount: number
  postCount: number
}
export interface PostDraft {
  description: string
  script: string
}

export interface Post {
  likeCount: number
  viewCount: number
  description: string
  content: string
  script: string
  published: Date
  author: User
  id: string
  commentCount: number
}

// TODO create draft
