import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Users, Wrench, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  // Fetch statistics
  const [
    totalUsers,
    totalTools,
    activeSubscriptions,
    totalRevenue,
    recentUsers,
    toolsNeedingCookies,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.tool.count(),
    prisma.toolSubscription.count({ where: { status: "ACTIVE" } }),
    prisma.toolSubscription.findMany({
      where: { status: "ACTIVE" },
      include: { tool: true },
    }).then((subs) =>
      subs.reduce((sum, sub) => sum + sub.tool.priceMonthly, 0)
    ),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    }),
    prisma.tool.count({
      where: {
        OR: [
          { cookiesEncrypted: null },
          { cookiesExpiryDate: { lte: new Date() } },
        ],
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your platform performance
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tools/new">Add New Tool</Link>
        </Button>
      </div>

      {/* Warning Alert */}
      {toolsNeedingCookies > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900 dark:text-orange-100">
                Action Required
              </CardTitle>
            </div>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              {toolsNeedingCookies} tool{toolsNeedingCookies > 1 ? "s" : ""} need cookie updates or have expired cookies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/tools">Review Tools</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Users</CardDescription>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{totalUsers}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users" className="text-sm text-primary hover:underline">
              View all users →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Tools</CardDescription>
              <Wrench className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{totalTools}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/tools" className="text-sm text-primary hover:underline">
              Manage tools →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Subscriptions</CardDescription>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{activeSubscriptions}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/subscriptions" className="text-sm text-primary hover:underline">
              View subscriptions →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Monthly Revenue</CardDescription>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <CardTitle className="text-3xl">{formatPrice(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/admin/analytics" className="text-sm text-primary hover:underline">
              View analytics →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{user.name || "No name"}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
          {recentUsers.length === 0 && (
            <p className="text-center text-gray-500 py-8">No users yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
