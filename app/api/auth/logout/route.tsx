import { cookies } from "next/headers";

export function POST(request: Request) {
  const cookieStore = cookies();
  cookieStore.delete("app.at");
  cookieStore.delete("app.at_exp");
  cookieStore.delete("app.idt");
  return Response.redirect(new URL("/", request.url));
}
