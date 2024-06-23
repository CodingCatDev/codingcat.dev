"use client";

import Script from "next/script";
import { Button } from "@/components/ui/button";

export default function SponsorshipForm() {
  return (
    <>
      <Script src="https://web3forms.com/client/script.js" />
      <form
        action="https://api.web3forms.com/submit"
        method="POST"
        className="flex flex-col gap-2 card p-4 bg-muted/50"
      >
        <h2 className="text-2xl font-bold">Sponsorship Request</h2>
        <hr className="my-2" />
        <input
          type="hidden"
          name="access_key"
          value="43c66d05-bf68-4708-a58c-8ac5da1fc4a1"
        />
        <input
          type="hidden"
          name="subject"
          value="CodingCat Sponsorship Request"
        />

        <label className="flex flex-col gap-1">
          <span>Name</span>
          <input
            className="px-2"
            type="text"
            name="name"
            placeholder="Alex"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Email</span>

          <input
            className="px-2"
            type="email"
            name="email"
            placeholder="alex@example.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span>Message</span>
          <textarea
            className="px-2"
            rows={4}
            placeholder="Please include anything that might help with our decision. We would love to include you to our next video or post."
            name="message"
            required
          ></textarea>
        </label>
        <div className="h-captcha" data-captcha="true"></div>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
