import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoyaltyDashboard } from "@/components/loyalty/LoyaltyDashboard";
import { defaultLocale } from "@/i18n/routing";

export default async function LoyaltyPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/${defaultLocale}/login?callbackUrl=/loyalty`);
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-display mb-8">Loyalty & Rewards</h1>
      <LoyaltyDashboard userId={session.user.id} />
    </div>
  );
}
