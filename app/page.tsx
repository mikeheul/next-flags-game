import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  redirect('/game'); // Redirect to /home
  return null; // This won't render because of the redirect
}
