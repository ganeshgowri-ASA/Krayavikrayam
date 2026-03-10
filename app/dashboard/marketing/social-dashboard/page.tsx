"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  mockSocialAccounts, mockSocialPosts, platformConfig,
  generateMetricsTimeSeries, postingHeatmapData, utmReferralData, roiPerChannel,
  type SocialPlatform,
} from "@/lib/marketing-data";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, Users, Eye, DollarSign, Calendar, PenSquare, Send,
  Instagram, Facebook, Linkedin, MessageCircle, Youtube, Twitter, Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  INSTAGRAM: <Instagram className="h-4 w-4" />,
  FACEBOOK: <Facebook className="h-4 w-4" />,
  LINKEDIN: <Linkedin className="h-4 w-4" />,
  WHATSAPP: <MessageCircle className="h-4 w-4" />,
  YOUTUBE: <Youtube className="h-4 w-4" />,
  X_TWITTER: <Twitter className="h-4 w-4" />,
  TELEGRAM: <Send className="h-4 w-4" />,
  REFERRAL: <Share2 className="h-4 w-4" />,
};

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const timeSlots = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];

function getHeatmapColor(value: number): string {
  if (value >= 80) return "bg-emerald-600 text-white";
  if (value >= 60) return "bg-emerald-400 text-white";
  if (value >= 40) return "bg-emerald-200 text-emerald-900";
  if (value >= 20) return "bg-emerald-100 text-emerald-800";
  return "bg-muted text-muted-foreground";
}

export default function SocialDashboardPage() {
  const [composeOpen, setComposeOpen] = useState(false);
  const [composeContent, setComposeContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");

  const metrics = useMemo(() => generateMetricsTimeSeries(30), []);

  const totalFollowers = mockSocialAccounts.reduce((s, a) => s + a.followersCount, 0);
  const avgEngagement = (mockSocialAccounts.reduce((s, a) => s + a.engagementRate, 0) / mockSocialAccounts.length).toFixed(1);
  const totalImpressions = metrics.reduce((s, m) => s + m.impressions, 0);
  const totalRevenue = roiPerChannel.reduce((s, c) => s + c.value, 0);

  // Engagement comparison data for bar chart
  const engagementComparison = mockSocialAccounts.map((a) => ({
    platform: platformConfig[a.platform].name,
    engagementRate: a.engagementRate,
    fill: platformConfig[a.platform].color,
  }));

  // Follower growth sparkline data per platform
  const followerSparklines = mockSocialAccounts.map((a) => {
    const data = Array.from({ length: 7 }, (_, i) => ({
      day: i,
      value: a.followersCount - Math.floor(Math.random() * 500) * (7 - i),
    }));
    return { ...a, sparkline: data };
  });

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  // Calendar data for current month
  const calendarPosts = mockSocialPosts.filter((p) => p.scheduledAt || p.publishedAt);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Social Media Dashboard</h2>
          <p className="text-muted-foreground">Unified omnichannel analytics and content management</p>
        </div>
        <button
          onClick={() => setComposeOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <PenSquare className="h-4 w-4" />
          Compose & Schedule
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Followers", value: formatNumber(totalFollowers), icon: Users, color: "text-blue-600" },
          { label: "Avg Engagement", value: `${avgEngagement}%`, icon: TrendingUp, color: "text-emerald-600" },
          { label: "Monthly Impressions", value: formatNumber(totalImpressions), icon: Eye, color: "text-purple-600" },
          { label: "Total Revenue", value: `$${formatNumber(totalRevenue)}`, icon: DollarSign, color: "text-orange-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follower Growth Sparkline Cards */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Follower Growth by Platform</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {followerSparklines.map((account) => {
            const config = platformConfig[account.platform];
            return (
              <Card key={account.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1 rounded" style={{ backgroundColor: config.color + "20", color: config.color }}>
                      {platformIcons[account.platform]}
                    </div>
                    <span className="text-sm font-medium truncate">{config.name}</span>
                  </div>
                  <p className="text-lg font-bold">{formatNumber(account.followersCount)}</p>
                  <div className="h-8 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={account.sparkline}>
                        <Area type="monotone" dataKey="value" stroke={config.color} fill={config.color} fillOpacity={0.1} strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Tabs defaultValue="engagement">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
          <TabsTrigger value="heatmap">Best Times</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="utm">UTM Tracking</TabsTrigger>
          <TabsTrigger value="roi">ROI</TabsTrigger>
        </TabsList>

        {/* Engagement Rate Comparison Bar Chart */}
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate by Platform</CardTitle>
              <CardDescription>Comparison of engagement rates across all connected channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={engagementComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
                    <YAxis type="category" dataKey="platform" tick={{ fontSize: 12 }} width={120} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      formatter={(value: number) => [`${value}%`, "Engagement Rate"]}
                    />
                    <Bar dataKey="engagementRate" radius={[0, 6, 6, 0]}>
                      {engagementComparison.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Performing Posts Table */}
        <TabsContent value="top-posts">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Posts ranked by total engagement across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Platform</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">Content</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Likes</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Comments</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Shares</th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">Impressions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...mockSocialPosts]
                      .filter((p) => p.status === "PUBLISHED")
                      .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
                      .map((post) => {
                        const config = platformConfig[post.platform];
                        return (
                          <tr key={post.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <span style={{ color: config.color }}>{platformIcons[post.platform]}</span>
                                <span className="text-xs">{config.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 max-w-xs truncate">{post.content}</td>
                            <td className="py-3 px-2 text-right font-medium">{post.likes.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right font-medium">{post.comments.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right font-medium">{post.shares.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right font-medium">{post.impressions.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Best Posting Time Heatmap */}
        <TabsContent value="heatmap">
          <Card>
            <CardHeader>
              <CardTitle>Best Posting Times</CardTitle>
              <CardDescription>Engagement scores by day and time slot. Higher = better engagement.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="p-2 text-left text-sm font-medium text-muted-foreground w-16">Day</th>
                      {timeSlots.map((slot) => (
                        <th key={slot} className="p-2 text-center text-sm font-medium text-muted-foreground">{slot}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {postingHeatmapData.map((row) => (
                      <tr key={row.day}>
                        <td className="p-2 text-sm font-medium">{row.day}</td>
                        {timeSlots.map((slot) => {
                          const value = row[slot as keyof typeof row] as number;
                          return (
                            <td key={slot} className="p-1">
                              <div className={cn(
                                "rounded-lg p-3 text-center text-sm font-medium",
                                getHeatmapColor(value)
                              )}>
                                {value}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Calendar */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Content Calendar
              </CardTitle>
              <CardDescription>Cross-platform scheduling overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {calendarPosts.map((post) => {
                  const date = post.scheduledAt ?? post.publishedAt ?? "";
                  const config = platformConfig[post.platform];
                  return (
                    <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-xs text-muted-foreground">
                          {new Date(date).toLocaleDateString("en-US", { month: "short" })}
                        </p>
                        <p className="text-lg font-bold">{new Date(date).getDate()}</p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: config.color }}>{platformIcons[post.platform]}</span>
                          <span className="text-sm font-medium">{config.name}</span>
                          <Badge variant={post.status === "PUBLISHED" ? "success" : post.status === "SCHEDULED" ? "warning" : "secondary"}>
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{post.content}</p>
                      </div>
                    </div>
                  );
                })}
                {calendarPosts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">No scheduled or published posts.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* UTM Referral Tracking */}
        <TabsContent value="utm">
          <Card>
            <CardHeader>
              <CardTitle>UTM Referral Tracking</CardTitle>
              <CardDescription>Website visits, conversions, and revenue per channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={utmReferralData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="channel" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
                    <Legend />
                    <Bar dataKey="visits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Visits" />
                    <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2 font-medium text-muted-foreground">Channel</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Visits</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Conversions</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Conv. Rate</th>
                      <th className="text-right py-2 px-2 font-medium text-muted-foreground">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utmReferralData.map((row) => (
                      <tr key={row.channel} className="border-b last:border-0">
                        <td className="py-2 px-2 font-medium">{row.channel}</td>
                        <td className="py-2 px-2 text-right">{row.visits.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right">{row.conversions.toLocaleString()}</td>
                        <td className="py-2 px-2 text-right">{((row.conversions / row.visits) * 100).toFixed(1)}%</td>
                        <td className="py-2 px-2 text-right font-medium text-emerald-600">${row.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI Per Channel Donut Chart */}
        <TabsContent value="roi">
          <Card>
            <CardHeader>
              <CardTitle>ROI per Channel</CardTitle>
              <CardDescription>Revenue distribution across social media channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="h-[350px] w-full lg:w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={roiPerChannel}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {roiPerChannel.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {roiPerChannel
                    .sort((a, b) => b.value - a.value)
                    .map((channel) => (
                      <div key={channel.name} className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: channel.color }} />
                        <span className="text-sm flex-1">{channel.name}</span>
                        <span className="text-sm font-semibold">${channel.value.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {((channel.value / totalRevenue) * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose & Publish Modal */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Compose & Schedule Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                value={composeContent}
                onChange={(e) => setComposeContent(e.target.value)}
                placeholder="Write your post content..."
                rows={4}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">{composeContent.length} characters</p>
            </div>

            <div>
              <Label>Select Platforms</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {mockSocialAccounts.filter((a) => a.isConnected).map((account) => {
                  const config = platformConfig[account.platform];
                  const isSelected = selectedPlatforms.includes(account.platform);
                  return (
                    <button
                      key={account.id}
                      onClick={() => togglePlatform(account.platform)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {platformIcons[account.platform]}
                      {config.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Schedule Date & Time (optional)</Label>
              <Input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setComposeOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-lg border hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // In production, this would call the tRPC mutation
                setComposeOpen(false);
                setComposeContent("");
                setSelectedPlatforms([]);
                setScheduleDate("");
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              disabled={!composeContent || selectedPlatforms.length === 0}
            >
              {scheduleDate ? "Schedule Post" : "Publish Now"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
