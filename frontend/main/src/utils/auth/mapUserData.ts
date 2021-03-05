import firebase from 'firebase/app';
import { getUserFromCookie, setUserCookie } from './userCookies';

export const mapUserData = async (user: any) => {
  const { uid, email, za } = user;

  const userFromCookie = getUserFromCookie();

  if (userFromCookie && za === userFromCookie.token) {
    //Skip token call, already valid
    return ({
      uid,
      email,
      token: za,
    } as unknown) as firebase.User;
  }

  const token = await user.getIdToken(true);
  setUserCookie(token);
  return ({
    uid,
    email,
    token,
  } as unknown) as firebase.User;
};
