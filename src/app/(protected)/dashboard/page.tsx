import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare, Users, TrendingUp, Activity } from "lucide-react";

export const metadata = {
  title: "Dashboard - Mass SMS",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const userId = (session.user as any).id;

  // Fetch statistics
  const [totalContacts, totalCategories, smsStats, activityCount] = await Promise.all([
    prisma.contact.count(),
    prisma.category.count({ where: { createdBy: userId } }),
    prisma.smsLog.groupBy({
      by: ["status"],
      where: { sentBy: userId },
      _count: true,
    }),
    prisma.activityLog.count({ where: { userId } }),
  ]);

  const statsCards = [
    {
      title: "Total Contacts",
      value: totalContacts,
      icon: Users,
      color: "blue",
      href: "/protected/contacts",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: TrendingUp,
      color: "green",
      href: "/protected/contacts",
    },
    {
      title: "SMS Sent",
      value: smsStats.reduce((acc, stat) => acc + stat._count, 0),
      icon: MessageSquare,
      color: "purple",
      href: "/protected/reports",
    },
    {
      title: "Activities",
      value: activityCount,
      icon: Activity,
      color: "orange",
      href: "/protected/activity-logs",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-12 h-12 text-${stat.color}-500`} />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/protected/send-sms">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Send SMS
              </Button>
            </Link>
            <Link href="/protected/contacts">
              <Button variant="outline" className="w-full">
                Manage Contacts
              </Button>
            </Link>
            <Link href="/protected/reports">
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <p className="text-gray-600 text-sm">
            Check your activity logs to track all SMS sending and system events.
          </p>
          <Link href="/protected/activity-logs" className="mt-4 block">
            <Button variant="outline" className="w-full">
              View Activity Logs
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
