import { NextSeo } from 'next-seo';
import Image from 'next/image';
import router, { useRouter } from 'next/router';
import Layout from '@/layout/Layout';
import { getSite } from '@/services/sanity.server';
import { Site } from '@/models/site.model';
import { HTMLAttributes, useEffect, useRef } from 'react';
import { useFormFields, useMailChimpForm } from 'use-mailchimp-form';
import { useScroll } from '@/hooks/useScroll';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

interface StaticParams {
  site: Site;
}

export const getStaticProps: GetStaticProps<StaticParams> = async ({
  preview = false,
}) => {
  return {
    props: {
      site: await getSite({ preview }),
    },
    revalidate: 3600,
  };
};

export default function Sponsorship({
  site,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const url =
    'https://dev.us5.list-manage.com/subscribe/post?u=d5670cc367744e51204ca56f8&id=c07a1fa483';

  const defaultFields = {
    EMAIL: '',
    FNAME: '',
    LNAME: '',
    PHONE: '',
    COMPANY: '',
    WEBSITE: '',
    SPONSOR: '',
  };

  const form = useRef<HTMLDivElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const scroll = useScroll();
  const scrollBtn = useRef<HTMLButtonElement>(null);

  const { loading, error, success, message, handleSubmit, reset } =
    useMailChimpForm(url);
  const { fields, handleFieldChange } = useFormFields(defaultFields);

  const scrollToForm = () => {
    if (form && form.current) form.current.scrollIntoView();
    if (email && email.current) email.current.focus();
  };

  const isInViewport = (e: HTMLElement) => {
    const rect = e.getBoundingClientRect();
    console.log(rect);
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  useEffect(() => {
    if (router.query && router.query.form) {
      scrollToForm();
      router.replace('/sponsorship', undefined, { shallow: true });
    }
  }, [router]);

  useEffect(() => {
    if (form) {
      const formRect = form.current?.getBoundingClientRect();
      if (formRect && scrollBtn && scrollBtn.current) {
        if (formRect.top >= window.innerHeight) {
          scrollBtn.current.hidden = false;
        } else {
          scrollBtn.current.hidden = true;
        }
      }
    }
  }, [scroll]);

  return (
    <>
      <NextSeo
        title="Purrfect Sponsorship"
        description="Sponsorship for Purrfect.dev"
        canonical={`https://codingcat.dev/sponsorship/`}
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://codingcat.dev/sponsorship',
          title: 'Purrfect Podcasts',
          description: 'Sponsorship for Purrfect.dev.',
          site_name: 'Purrfect.dev',
          images: [
            {
              url: 'https://media.codingcat.dev/image/upload/c_thumb,w_1200,h_630/main-codingcatdev-photo/purrfect.dev.png',
              width: 1200,
              height: 630,
              alt: 'AJ Logo Black Cat Face with Purrfect.dev Domain',
            },
            {
              url: 'https://media.codingcat.dev/image/upload/main-codingcatdev-photo/purrfect.dev.png',
            },
          ],
        }}
      />
      <Layout site={site}>
        <div className="sticky top-0 right-0 z-50 flex m-2 jusify-end">
          <button
            ref={scrollBtn}
            className="btn-secondary"
            onClick={() => scrollToForm()}
          >
            Apply To Sponsor -{'>'}
          </button>
        </div>
        <section className="grid grid-cols-1 gap-2 mx-2">
          {Array.apply(0, Array(12)).map((x, i) => (
            <div className="w-full" key={i}>
              <Image
                src={`/main-codingcatdev-photo/2022_-_Sponsorship_${i + 1}.png`}
                alt="Purrfect.dev Sponsorship Image show logo."
                layout="responsive"
                width="1920"
                height="1080"
                className="rounded-md"
              />
            </div>
          ))}

          <div ref={form} className="bg-white rounded">
            <>
              {/* Begin Mailchimp Signup Form */}
              <div id="mc_embed_signup">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    handleSubmit(fields);
                  }}
                >
                  <div
                    id="mc_embed_signup_scroll"
                    className="flex flex-wrap m-2 lg:m-8"
                  >
                    <h2 className="w-full m-8">Sponsor</h2>
                    <div className="w-full text-right indicates-required">
                      <span className="asterisk">*</span> indicates required
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group">
                      <label htmlFor="EMAIL">
                        Email Address <span className="asterisk">*</span>
                      </label>
                      <input
                        type="email"
                        id="EMAIL"
                        ref={email}
                        value={fields.EMAIL}
                        onChange={handleFieldChange}
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group">
                      <label htmlFor="FNAME">
                        First Name <span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        name="FNAME"
                        value={fields.FNAME}
                        onChange={handleFieldChange}
                        id="FNAME"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group">
                      <label htmlFor="LNAME">
                        Last Name <span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        value={fields.LNAME}
                        onChange={handleFieldChange}
                        name="LNAME"
                        id="LNAME"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group size1of2">
                      <label htmlFor="PHONE">Phone Number </label>
                      <input
                        type="text"
                        name="PHONE"
                        value={fields.PHONE}
                        onChange={handleFieldChange}
                        id="PHONE"
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group">
                      <label htmlFor="COMPANY">
                        Company <span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        value={fields.COMPANY}
                        onChange={handleFieldChange}
                        name="COMPANY"
                        id="COMPANY"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group">
                      <label htmlFor="WEBSITE">
                        Website URL <span className="asterisk">*</span>
                      </label>
                      <input
                        type="text"
                        value={fields.WEBSITE}
                        onChange={handleFieldChange}
                        name="WEBSITE"
                        id="WEBSITE"
                      />
                    </div>
                    <div className="flex flex-col w-full mb-2 mc-field-group input-group">
                      <strong>
                        Sponsorship Options <span className="asterisk">*</span>
                      </strong>
                      <ul>
                        <li>
                          <input
                            required
                            type="radio"
                            checked={'$150 - 1 Show' === fields.SPONSOR}
                            id="SPONSOR"
                            value="$150 - 1 Show"
                            name="SPONSOR"
                            onChange={handleFieldChange}
                          />
                          <label htmlFor="SPONSOR-0" className="ml-2">
                            $150 - 1 Show
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            checked={'$400 - 3 Shows' === fields.SPONSOR}
                            id="SPONSOR"
                            value="$400 - 3 Shows"
                            onChange={handleFieldChange}
                            name="SPONSOR"
                          />
                          <label htmlFor="SPONSOR-1" className="ml-2">
                            $400 - 3 Shows
                          </label>
                        </li>
                        <li>
                          <input
                            type="radio"
                            checked={'$900 - 10 Shows' === fields.SPONSOR}
                            id="SPONSOR"
                            value="$900 - 10 Shows"
                            onChange={handleFieldChange}
                            name="SPONSOR"
                          />
                          <label htmlFor="SPONSOR-2" className="ml-2">
                            $900 - 10 Shows
                          </label>
                        </li>
                      </ul>
                    </div>
                    <div id="mce-responses" className="clear">
                      <div
                        className="response"
                        id="mce-error-response"
                        style={{ display: 'none' }}
                      />
                      <div
                        className="response"
                        id="mce-success-response"
                        style={{ display: 'none' }}
                      />
                    </div>{' '}
                    {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups*/}
                    <div
                      style={{ position: 'absolute', left: '-5000px' }}
                      aria-hidden="true"
                    >
                      <input
                        type="text"
                        name="b_d5670cc367744e51204ca56f8_c07a1fa483"
                        tabIndex={-1}
                        defaultValue=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-2 clear">
                        <input type="submit" className="btn-primary" />
                      </div>
                      {loading && 'submitting'}
                      {error && (
                        <div dangerouslySetInnerHTML={{ __html: message }} />
                      )}
                      {success && message}
                    </div>
                  </div>
                </form>
              </div>
              {/*End mc_embed_signup*/}
            </>
          </div>
        </section>
      </Layout>
    </>
  );
}
