import { defineType, defineField } from "sanity";
import { FaYoutube } from "react-icons/fa6";

export default defineType({
    name: "youtubeShorts",
    type: "object",
    title: "YouTube Shorts",
    icon: FaYoutube,
    fields: [
        defineField({
            name: "shorts",
            type: "array",
            title: "YouTube Shorts",
            of: [{ type: 'url' }]
        }),
    ],
});
