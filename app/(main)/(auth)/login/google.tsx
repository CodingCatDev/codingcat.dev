"use client";

//Firebase
import { ccdSignInWithPopUp } from "@/lib/firebase";
import { GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

// Display
import { FirebaseError } from "firebase/app";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

export default function GoogleAuth() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const redirect = searchParams.get("redirectTo");

	const login = async () => {
		try {
			await ccdSignInWithPopUp(provider);
			redirect
				? router.replace(
						redirect === "/pro" ? `${redirect}?showSubscribe=true` : redirect,
					)
				: router.replace("/dashboard");
		} catch (err: any) {
			if (err instanceof FirebaseError) {
				if (err.code === "auth/account-exists-with-different-credential") {
					toast(
						"Account Exists with Different Login Method. Please first login and then link within your Account page.",
					);
				} else {
					toast(`${err.message}`);
				}
			} else {
				toast(JSON.stringify(err));

				console.error(err);
			}
		}
	};

	return (
		<Button onClick={login} variant="outline">
			<FaGoogle className="mr-2 h-4 w-4" /> Login with Google
		</Button>
	);
}
