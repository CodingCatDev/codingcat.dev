import Input from '@/components/amplify/auth/Input';

function FogotPassword({ setUiState, onChange, forgotPassword }: any) {
  return (
    <>
      <p className="text-3xl font-black">Reset password</p>
      <div className="mt-10">
        <label className="text-sm">Email</label>
        <Input onChange={onChange} name="email" />
      </div>
      <button
        onClick={() => forgotPassword()}
        className="w-full p-3 mt-4 text-white bg-pink-600 rounded"
      >
        Continue
      </button>
      <button
        onClick={() => setUiState('signIn')}
        className="mt-6 text-sm text-pink-500"
      >
        Cancel
      </button>
    </>
  );
}

export default FogotPassword;
