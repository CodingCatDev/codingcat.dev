import { Input } from './Input';

export function ConfirmSignUp({ setUiState, onChange, confirmSignUp }:any) {
  return (
    <>
      <p className="text-3xl font-black">Confirm Sign Up</p>
      <div className="mt-10">
        <label className="text-sm">Confirmation Code</label>
        <Input onChange={onChange} name="authCode" />
      </div>
      <button
        onClick={() => confirmSignUp()}
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
