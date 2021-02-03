import Input from '@/components/amplify/auth/Input';
import SocialSignIn from '@/components/amplify/auth/SocialSignIn';

export default function SignInDetail({ setUiState, onChange, signIn }: any) {
  return (
    <>
      <p className="text-3xl font-black">Sign in to your account</p>
      <div className="mt-10">
        <label className="text-sm">Email</label>
        <Input onChange={onChange} name="email" />
      </div>
      <div className="mt-7">
        <label className="text-sm">
          Password
          <span
            onClick={() => setUiState('forgotPassword')}
            className="ml-8 text-pink-500 sm:ml-48"
          >
            Forgot your password?
          </span>
        </label>
        <Input type="password" name="password" onChange={onChange} />
      </div>
      <button
        onClick={signIn}
        className="w-full p-3 mt-6 text-white bg-pink-600 rounded"
      >
        Continue
      </button>
      <SocialSignIn />
      <p className="mt-12 text-sm font-light">
        Dont have an account?
        <span
          onClick={() => setUiState('signUp')}
          role="button"
          className="text-pink-600 cursor-pointer"
        >
          {' '}
          Sign Up.
        </span>
      </p>
    </>
  );
}
