import AJPrimary from './global/icons/AJPrimary';
import FirebaseAuth from './FirebaseAuth';

function FirebaseSignin() {
  return (
    <>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-wrap justify-center">
            <AJPrimary />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <FirebaseAuth />
          </div>
        </div>
      </div>
    </>
  );
}
export default FirebaseSignin;
