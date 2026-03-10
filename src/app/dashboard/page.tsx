import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Ticket, Zap } from "lucide-react";

const stats = [
  { label: "Total Contacts", value: "1,284", icon: Users, color: "text-blue-600 bg-blue-50" },
  { label: "Active Deals", value: "42", icon: DollarSign, color: "text-green-600 bg-green-50" },
  { label: "Open Tickets", value: "18", icon: Ticket, color: "text-amber-600 bg-amber-50" },
  { label: "Active Automations", value: "7", icon: Zap, color: "text-indigo-600 bg-indigo-50" },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
              <div className={`rounded-lg p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
