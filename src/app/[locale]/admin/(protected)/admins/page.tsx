import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import AdminManager from "@/components/admin/admin-manager";

export const dynamic = "force-dynamic";

export default async function AdminsPage({ params }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SUPER_ADMIN") {
    redirect(`/${params.locale}/admin`);
  }

  const t = getDictionary(params.locale);
  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" }
  });

  const formattedAdmins = admins.map((a) => ({ ...a, createdAt: a.createdAt.toISOString() }));

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">{t.admin.admins}</h1>
      <AdminManager initialAdmins={formattedAdmins} currentAdminId={(session.user as any).id} />
    </div>
  );
    }
