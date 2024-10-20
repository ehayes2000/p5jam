import { useContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import type { TProfile } from "../types"
import MyProfile from './myProfile';
import UserProfile from './userProfile';
import { LoginContext } from '../login';

export default function User() {
  const profile = useLoaderData() as TProfile;
  const { user: me } = useContext(LoginContext)
  if (me && me.id === profile.user.id) {
    return <MyProfile profile={profile} />
  }
  return <UserProfile profile={profile} />
}
