import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccessToolButton } from "@/components/dashboard/access-tool-button";
import { TutorialSection } from "@/components/dashboard/tutorial-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { ToolIcon } from "@/components/tools/tool-icon";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;
  const isTestUser = userRole === 'TEST_USER' || userRole === 'ADMIN';

  // Fetch user data to check if they're a new customer
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      createdAt: true,
      subscriptions: {
        where: { status: 'ACTIVE' },
        select: { id: true },
      },
    },
  });

  // Check if user is new (created within last 7 days and has no active subscriptions)
  const isNewCustomer = user && (
    new Date().getTime() - new Date(user.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
  ) && user.subscriptions.length === 0;

  // For test users, show all active tools. For regular users, show only subscriptions
  let subscriptions: Array<{
    id: string;
    tool: any;
    status: string;
    currentPeriodEnd: Date;
    createdAt: Date;
  }> = [];

  if (isTestUser) {
    // Fetch all active tools for test users
    const allTools = await prisma.tool.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    // Convert tools to subscription-like format for display
    subscriptions = allTools.map((tool) => ({
      id: `test-${tool.id}`,
      tool: tool,
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdAt: new Date(),
    }));
  } else {
    // Fetch user's active subscriptions for regular users
    subscriptions = await prisma.toolSubscription.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
      include: {
        tool: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:mt-[60px]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">My Tools</h1>
          {isTestUser && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
              🧪 Test Mode
            </Badge>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {isTestUser 
            ? "Access all tools without payment (Testing Mode)"
            : "Access and manage your subscribed tools"}
        </p>
      </div>

      {/* Tutorial Section */}
      <TutorialSection isNewCustomer={isNewCustomer || false} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Tools</CardDescription>
            <CardTitle className="text-3xl">{subscriptions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Monthly Cost</CardDescription>
            <CardTitle className="text-3xl">
              {formatPrice(
                subscriptions.reduce((sum, sub) => sum + sub.tool.priceMonthly, 0)
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Member Since</CardDescription>
            <CardTitle className="text-2xl">
              {formatDate(subscriptions[subscriptions.length - 1]?.createdAt || new Date())}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tools List */}
      {subscriptions.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Subscribed Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <ToolIcon icon={subscription.tool.icon} name={subscription.tool.name} size="md" />
                      <div>
                        <CardTitle className="text-lg">{subscription.tool.name}</CardTitle>
                        <CardDescription className="line-clamp-1">
                          {subscription.tool.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={subscription.status === "ACTIVE" ? "default" : "secondary"}>
                      {subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {!isTestUser && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Next billing</span>
                          <span className="font-medium">
                            {formatDate(subscription.currentPeriodEnd)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Monthly cost</span>
                          <span className="font-bold text-lg">
                            {formatPrice(subscription.tool.priceMonthly)}
                          </span>
                        </div>
                      </>
                    )}
                    {isTestUser && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Price</span>
                        <span className="font-bold text-lg text-green-600">
                          FREE (Test Mode)
                        </span>
                      </div>
                    )}
                    <AccessToolButton tool={subscription.tool} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No tools yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't subscribed to any tools yet. Browse our catalog to get started.
            </p>
            <Button asChild>
              <Link href="/tools">Browse Tools</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
