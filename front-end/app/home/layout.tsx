import Header from "@/components/header/page";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }
  return (
    <div className="h-full">
      <Header {...session?.user} />
      <main>{children}</main>
    </div>
  );
}
