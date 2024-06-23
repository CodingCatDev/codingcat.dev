import { redirect } from "next/navigation";

export default async function Page() {
  redirect("/authors/page/1");
}
