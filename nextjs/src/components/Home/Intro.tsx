import { url } from 'inspector';
import dynamic from 'next/dynamic';

const UserSignin = dynamic(() => import('@/components/Home/UserSignin'), {
  ssr: false,
  loading: () => (
    <>
      <div className="relative flex justify-center mb-48 h-96"></div>
      <div className="relative flex justify-center h-96"></div>
    </>
  ),
});

export default function Intro() {
  return (
    <section className="p-2 lg:p-10 grid gap-10 lg:grid-cols-2 2xl:grid-cols-hero ">
      <UserSignin />
      <section className="justify-self-center grid content-center gap-10">
        <h1 className="vertical-text-clip pt-8 tracking-tight xl:tracking-wide text-5xl sm:text-7xl lg:text-6xl 2xl:text-7xl">
          Purrfect
          <br />
          Web Tutorials
        </h1>
        <p
          className="font-light sm:text-2xl lg:text-xl xl:text-2xl"
          style={{ maxWidth: `40ch` }}
        >
          Get the skills you need to become a better web developer today. High
          quality courses with custom certificates and projects to show off your
          new skills.
        </p>

        <button className="btn-primary justify-self-start" type="button">
          Go Pro
        </button>
      </section>
    </section>
  );
}
