import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, Wrench, Users, CreditCard, BarChart3, Cookie, Receipt, Download } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is admin
  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role !== "ADMIN") {
    redirect("/dashboard");
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tools", label: "Tools", icon: Wrench },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/admin/payments", label: "Payments", icon: Receipt },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/extension", label: "Admin Extension", icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage tools, users, and subscriptions</p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 sticky top-24">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm text-gray-600 dark:text-gray-400"
                >
                  ← Back to User Dashboard
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
