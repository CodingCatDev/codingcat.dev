import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleAuth from "./google";
import GitHubAuth from "./github";

export default function LoginForm() {
  return (
    <div className="container px-5 mx-auto">
      <div className="w-full flex justify-center p-8 sm:p-20 md:p-32">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <GoogleAuth />
            <GitHubAuth />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
