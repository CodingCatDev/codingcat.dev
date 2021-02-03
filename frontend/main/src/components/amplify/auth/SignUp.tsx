import Input from '@/components/amplify/auth/Input';

function SignUp({ setUiState, signUp, onChange }: any) {
  return (
    <>
      <p className="text-3xl font-black">Sign up for an account</p>
      <div className="mt-10">
        <label className="text-sm">Email</label>
        <Input onChange={onChange} name="email" />
      </div>
      <div className="mt-7">
        <p className="text-sm">
          Password
          <span className="ml-8 text-pink-500 sm:ml-48">
            Forgot your password?
          </span>
        </p>
        <Input name="password" onChange={onChange} type="password" />
      </div>
      <button
        onClick={signUp}
        className="w-full p-3 mt-10 text-white bg-pink-600 rounded"
      >
        Continue
      </button>
      <p className="mt-12 text-sm font-light">
        Already have an account?
        <span
          className="text-pink-600 cursor-pointer"
          onClick={() => setUiState('signIn')}
        >
          {' '}
          Sign In.
        </span>
      </p>
    </>
  );
}

export default SignUp;
