"use client";

//Firebase
import { ccdSignInWithPopUp } from "@/lib/firebase";
import { GithubAuthProvider } from "firebase/auth";
const provider = new GithubAuthProvider();

// Display
import { FirebaseError } from "firebase/app";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

export default function GitHubAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectTo");
  const { toast } = useToast();

  const login = async () => {
    try {
      await ccdSignInWithPopUp(provider);
      redirect
        ? router.replace(
            redirect === "/pro" ? `${redirect}?showSubscribe=true` : redirect
          )
        : router.replace("/dashboard");
    } catch (err: any) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/account-exists-with-different-credential") {
          toast({
            variant: "destructive",
            description:
              "Account Exists with Different Login Method. Please first login and then link within your Account page.",
          });
        } else {
          toast({
            variant: "destructive",
            description: err.message,
          });
        }
      } else {
        toast({
          variant: "destructive",
          description: JSON.stringify(err),
        });
        console.error(err);
      }
    }
  };

  return (
    <Button onClick={login} variant="secondary">
      <FaGithub className="mr-2 h-4 w-4" /> Login with GitHub
    </Button>
  );
}
