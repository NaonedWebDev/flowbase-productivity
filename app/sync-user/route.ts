import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db, users } from "@/db";

export async function GET() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const email = user.primaryEmailAddress?.emailAddress;

  if (!email) {
    redirect("/?sync=missing-email");
  }

  const name =
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    null;

  await db
    .insert(users)
    .values({
      clerkUserId: user.id,
      email,
      name,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email,
        name,
        updatedAt: new Date(),
      },
      setWhere: eq(users.clerkUserId, user.id),
    });

  redirect("/");
}
