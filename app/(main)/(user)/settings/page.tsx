import { redirect } from "next/navigation";

export default async function SettingsPage() {
	redirect("/settings/profile");
}
