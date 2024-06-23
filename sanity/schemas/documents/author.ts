import { FaCat } from "react-icons/fa";
import { defineType } from "sanity";

import userType from "../partials/user";

export default defineType({
  ...userType,
  name: "author",
  title: "Author",
  icon: FaCat,
  type: "document",
});
