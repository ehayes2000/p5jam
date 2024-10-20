import type { TPost, TJam, TUser } from './client';

export interface TProfile {
  posts: TPost[];
  user: TUser;
}

export interface TJamPage {
  jam: TJam;
  posts: TPost[];
}

export interface TJamCollection {
  owner: TJam[];
  participant: TJam[];
}
