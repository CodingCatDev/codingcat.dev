import Link from 'next/link';
import AJHeadphones from '@/components/global/icons/AJHeadphones';
import Schedule from './global/icons/nav/Schedule';
import Twitch from './global/icons/socials/Twitch';

export default function PurrfectDevUpper(): JSX.Element {
  return (
    <div className="flex justify-center w-full">
      <section className="grid items-center content-center max-w-md grid-cols-1 gap-4 mx-auto text-center lg:max-w-3xl 2xl:mx-0 2xl:justify-self-end">
        <h1 className="pt-4 -mb-4 text-5xl leading-snug tracking-tight vertical-text-clip xl:tracking-wide xl:text-6xl xl:leading-snug 2xl:text-7xl 2xl:leading-snug">
          Schedule
        </h1>
        <p className="font-sans 2xl:text-2xl">
          Schedule of streams presented by CodingCat.dev .
        </p>
        <p className="font-sans 2xl:text-2xl">
          Make sure to never miss an episode by adding the Google Calendar and
          subscribing on Twitch!
        </p>
        <div className="flex flex-wrap gap-4 m-auto">
          <a
            href="https://calendar.google.com/calendar?cid=Y18za2ttczRxMzZidG9yazRyY2o2YmhibmR0Y0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
            target="_blank"
            rel="noreferrer"
          >
            <button className="flex items-center gap-2 btn-primary fill-primary-50 hover:fill-primary-500">
              <Schedule className="block w-6 h-6" />
              Google Calendar
            </button>
          </a>
          <a
            href="https://twitch.tv/codingcatdev"
            target="_blank"
            rel="noreferrer"
          >
            <button className="flex items-center gap-2 btn-secondary-reverse fill-primary-50 hover:fill-primary-500">
              <Twitch className="block w-6 h-6" />
              Twitch
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}
