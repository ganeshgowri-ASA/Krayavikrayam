"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockSocialAccounts, mockSocialPosts, platformConfig,
  generateMetricsTimeSeries, type SocialPlatform,
} from "@/lib/marketing-data";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { ArrowLeft, Users, TrendingUp, Eye, MousePointerClick } from "lucide-react";

export default function PlatformDetailPage({ params }: { params: Promise<{ platform: string }> }) {
  const { platform } = use(params);
  const platformKey = platform.toUpperCase() as SocialPlatform;
  const config = platformConfig[platformKey] ?? { name: platform, color: "#666" };
  const account = mockSocialAccounts.find((a) => a.platform === platformKey);
  const posts = mockSocialPosts.filter((p) => p.platform === platformKey);
  const metrics = useMemo(() => generateMetricsTimeSeries(30), []);

  const stats = [
    { label: "Followers", value: account?.followersCount.toLocaleString() ?? "0", icon: Users },
    { label: "Engagement Rate", value: `${account?.engagementRate ?? 0}%`, icon: TrendingUp },
    { label: "Total Impressions", value: metrics.reduce((s, m) => s + m.impressions, 0).toLocaleString(), icon: Eye },
    { label: "Total Clicks", value: metrics.reduce((s, m) => s + m.clicks, 0).toLocaleString(), icon: MousePointerClick },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/marketing/channels"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Channels
        </Link>
        <div className="h-4 w-px bg-border" />
        <div className="h-6 w-6 rounded" style={{ backgroundColor: config.color }} />
        <h2 className="text-2xl font-bold">{config.name} Analytics</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-muted-foreground/50" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="growth">
        <TabsList>
          <TabsTrigger value="growth">Follower Growth</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue & Conversions</TabsTrigger>
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Follower Growth (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Area type="monotone" dataKey="followers" stroke={config.color} fill={config.color} fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate & Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="impressions" fill={config.color} fillOpacity={0.6} radius={[4, 4, 0, 0]} name="Impressions" />
                    <Line yAxisId="right" type="monotone" dataKey="engagementRate" stroke="#10b981" strokeWidth={2} name="Engagement %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Conversions & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#8b5cf6" strokeWidth={2} name="Conversions" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="posts">
          <div className="grid gap-3">
            {posts.length > 0 ? posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <p className="mb-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                    <span>{post.impressions.toLocaleString()} impressions</span>
                    <span className="ml-auto">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Scheduled"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="text-center py-12 text-muted-foreground">
                No posts found for this platform.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
