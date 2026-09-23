import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSessionProvider from "@/components/admin/session-provider";
import AdminSidebar from "@/components/admin/sidebar";

export default async function ProtectedAdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/${params.locale}/admin/login`);

  return (
    <AdminSessionProvider>
      <div className="flex min-h-screen bg-[#0F0D0A]">
        <AdminSidebar locale={params.locale} role={(session.user as any).role} />
        <div className="flex-1 bg-cream-50 p-6 md:rounded-tr-[28px] md:p-10">{children}</div>
      </div>
    </AdminSessionProvider>
  );
}
