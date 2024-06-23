import { FaMicrophone } from "react-icons/fa";
import { defineField, defineType } from "sanity";

import baseType from "../partials/base";


export default defineType({
  name: "podcastType",
  title: "Podcast Type",
  icon: FaMicrophone,
  type: "document",
  fields: [...baseType.fields],
});
