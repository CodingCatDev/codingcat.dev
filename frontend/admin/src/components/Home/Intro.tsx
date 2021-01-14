import dynamic from 'next/dynamic';

const UserSignin = dynamic(() => import('@/components/UserSignin'), {
  ssr: false,
  loading: () => (
    <>
      <div className="relative flex justify-center mb-48 h-96"></div>
      <div className="relative flex justify-center h-96"></div>
    </>
  ),
});

export default function dIntro() {
  return (
    <>
      <div className="">
        <div className="">
          <UserSignin />
        </div>
      </div>
    </>
  );
}
