"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockSocialAccounts, platformConfig, type SocialPlatform } from "@/lib/marketing-data";
import {
  Instagram, Facebook, Linkedin, MessageCircle,
  Youtube, Twitter, Send, Share2, Users, TrendingUp, ExternalLink,
} from "lucide-react";

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  INSTAGRAM: <Instagram className="h-6 w-6" />,
  FACEBOOK: <Facebook className="h-6 w-6" />,
  LINKEDIN: <Linkedin className="h-6 w-6" />,
  WHATSAPP: <MessageCircle className="h-6 w-6" />,
  YOUTUBE: <Youtube className="h-6 w-6" />,
  X_TWITTER: <Twitter className="h-6 w-6" />,
  TELEGRAM: <Send className="h-6 w-6" />,
  REFERRAL: <Share2 className="h-6 w-6" />,
};

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export default function ChannelsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Social Channels</h2>
        <p className="text-muted-foreground">Manage your connected social media accounts and referral programs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockSocialAccounts.map((account) => {
          const config = platformConfig[account.platform];
          return (
            <Link
              key={account.id}
              href={`/dashboard/marketing/channels/${account.platform.toLowerCase()}`}
            >
              <Card className="hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-2.5 rounded-xl text-white"
                      style={{ backgroundColor: config.color }}
                    >
                      {platformIcons[account.platform]}
                    </div>
                    <Badge variant={account.isConnected ? "success" : "secondary"}>
                      {account.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{config.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{account.accountName}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Followers
                      </div>
                      <span className="font-semibold">{formatFollowers(account.followersCount)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Engagement
                      </div>
                      <span className="font-semibold text-emerald-600">{account.engagementRate}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ExternalLink className="h-4 w-4" />
                        Posts
                      </div>
                      <span className="font-semibold">{account.postsCount}</span>
                    </div>
                  </div>

                  {!account.isConnected && (
                    <button className="w-full mt-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors">
                      Connect Account
                    </button>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
