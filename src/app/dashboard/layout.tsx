import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Home, CreditCard, Settings } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const menuItems = [
    { href: "/dashboard", label: "My Tools", icon: Home },
    { href: "/dashboard/subscriptions", label: "Subscriptions", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 sticky top-24">
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-1">Dashboard</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {session.user?.email}
                </p>
              </div>

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
