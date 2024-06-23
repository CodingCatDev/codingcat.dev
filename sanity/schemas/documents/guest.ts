import { UserIcon } from "@sanity/icons";
import { defineType } from "sanity";

import userType from "../partials/user";

export default defineType({
  ...userType,
  name: "guest",
  title: "Guest",
  icon: UserIcon,
  type: "document",
});
