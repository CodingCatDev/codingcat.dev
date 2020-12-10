import firebase from 'firebase/app';

export const mapUserData = async (user: firebase.User) => {
  const { uid, email } = user;
  const token = await user.getIdToken(true);
  return ({
    uid,
    email,
    token,
  } as unknown) as firebase.User;
};
