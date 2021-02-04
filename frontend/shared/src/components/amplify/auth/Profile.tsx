import { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

export function Profile({ setUiState }: any) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    checkUser();
  }, []);
  async function checkUser() {
    const user = await Auth.currentAuthenticatedUser();
    setUser(user.attributes);
  }
  if (!user) return null;
  return (
    <>
      <p className="text-xl font-black">Welcome, {user}</p>
      <button
        onClick={() => {
          Auth.signOut();
          setUiState('signIn');
        }}
        className="w-full p-3 mt-10 text-white bg-pink-600 rounded"
      >
        Sign Out
      </button>
    </>
  );
}
