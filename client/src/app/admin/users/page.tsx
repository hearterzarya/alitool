import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function UsersManagementPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { tool: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Users Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage platform users
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{users.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Users with Subscriptions</CardDescription>
            <CardTitle className="text-3xl">
              {users.filter((u) => u.subscriptions.length > 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Admins</CardDescription>
            <CardTitle className="text-3xl">
              {users.filter((u) => u.role === "ADMIN").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{user.name || "No name"}</h3>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                    {user.emailVerified && (
                      <Badge variant="outline" className="text-green-600">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Joined: {formatDate(user.createdAt)}</span>
                    <span>•</span>
                    <span>
                      Active Subscriptions: {user.subscriptions.length}
                    </span>
                  </div>
                  {user.subscriptions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {user.subscriptions.map((sub) => (
                        <Badge key={sub.id} variant="outline">
                          {sub.tool.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
