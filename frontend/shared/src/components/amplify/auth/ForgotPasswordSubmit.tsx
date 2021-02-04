import { Input } from './Input';

export function ForgotPasswordSubmit({
  setUiState,
  onChange,
  forgotPasswordSubmit,
}: any) {
  return (
    <>
      <p className="text-3xl font-black">Reset password</p>
      <div className="mt-10">
        <label className="text-sm">Confirmation Code</label>
        <Input onChange={onChange} name="authCode" />
      </div>
      <div className="mt-6">
        <label className="text-sm">New Password</label>
        <Input type="password" name="password" onChange={onChange} />
      </div>
      <button
        onClick={() => forgotPasswordSubmit()}
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
