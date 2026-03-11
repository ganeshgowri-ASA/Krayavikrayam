// Mock data for Marketing Hub - replace with real API calls in production

export type CampaignType = "EMAIL" | "SMS" | "SOCIAL";
export type CampaignStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED";
export type SocialPlatform = "INSTAGRAM" | "FACEBOOK" | "LINKEDIN" | "WHATSAPP" | "YOUTUBE" | "X_TWITTER" | "TELEGRAM" | "REFERRAL";
export type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  createdBy: string;
  createdAt: string;
  openRate?: number;
  clickRate?: number;
  conversions?: number;
  sent?: number;
  revenue?: number;
}

export interface LeadScoreEntry {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  score: number;
  factors: { name: string; weight: number; value: number }[];
  trend: number[];
}

export interface SocialAccountData {
  id: string;
  platform: SocialPlatform;
  accountName: string;
  followersCount: number;
  isConnected: boolean;
  engagementRate: number;
  postsCount: number;
}

export interface SocialPostData {
  id: string;
  content: string;
  platform: SocialPlatform;
  scheduledAt?: string;
  publishedAt?: string;
  status: PostStatus;
  likes: number;
  comments: number;
  shares: number;
  impressions: number;
}

export interface ChannelMetricData {
  date: string;
  followers: number;
  impressions: number;
  engagementRate: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export const platformConfig: Record<SocialPlatform, { name: string; color: string; icon: string }> = {
  INSTAGRAM: { name: "Instagram", color: "#E4405F", icon: "instagram" },
  FACEBOOK: { name: "Facebook", color: "#1877F2", icon: "facebook" },
  LINKEDIN: { name: "LinkedIn", color: "#0A66C2", icon: "linkedin" },
  WHATSAPP: { name: "WhatsApp Business", color: "#25D366", icon: "message-circle" },
  YOUTUBE: { name: "YouTube", color: "#FF0000", icon: "youtube" },
  X_TWITTER: { name: "X / Twitter", color: "#000000", icon: "twitter" },
  TELEGRAM: { name: "Telegram", color: "#26A5E4", icon: "send" },
  REFERRAL: { name: "Referrals", color: "#F59E0B", icon: "share-2" },
};

export const mockCampaigns: Campaign[] = [
  { id: "1", name: "Spring Sale Launch", type: "EMAIL", status: "ACTIVE", createdBy: "Admin", createdAt: "2026-02-15", openRate: 42.3, clickRate: 12.8, conversions: 156, sent: 5400, revenue: 23400 },
  { id: "2", name: "Product Update Announcement", type: "EMAIL", status: "COMPLETED", createdBy: "Admin", createdAt: "2026-01-20", openRate: 38.1, clickRate: 9.4, conversions: 89, sent: 4200, revenue: 12800 },
  { id: "3", name: "Flash Sale SMS Blast", type: "SMS", status: "PAUSED", createdBy: "Marketing", createdAt: "2026-03-01", openRate: 95.2, clickRate: 18.6, conversions: 234, sent: 8900, revenue: 45600 },
  { id: "4", name: "Instagram Story Campaign", type: "SOCIAL", status: "ACTIVE", createdBy: "Social Team", createdAt: "2026-03-05", openRate: 0, clickRate: 5.2, conversions: 67, sent: 0, revenue: 8900 },
  { id: "5", name: "New Customer Welcome Series", type: "EMAIL", status: "DRAFT", createdBy: "Admin", createdAt: "2026-03-08", openRate: 0, clickRate: 0, conversions: 0, sent: 0, revenue: 0 },
  { id: "6", name: "Festive Season Promo", type: "SOCIAL", status: "DRAFT", createdBy: "Marketing", createdAt: "2026-03-09", openRate: 0, clickRate: 0, conversions: 0, sent: 0, revenue: 0 },
];

export const mockLeads: LeadScoreEntry[] = [
  { id: "1", contactId: "u1", contactName: "Priya Sharma", contactEmail: "priya@example.com", score: 92, factors: [{ name: "Email Opens", weight: 0.3, value: 95 }, { name: "Page Visits", weight: 0.25, value: 88 }, { name: "Purchase History", weight: 0.25, value: 92 }, { name: "Social Engagement", weight: 0.2, value: 90 }], trend: [65, 70, 75, 80, 85, 88, 92] },
  { id: "2", contactId: "u2", contactName: "Rajesh Kumar", contactEmail: "rajesh@example.com", score: 87, factors: [{ name: "Email Opens", weight: 0.3, value: 80 }, { name: "Page Visits", weight: 0.25, value: 92 }, { name: "Purchase History", weight: 0.25, value: 85 }, { name: "Social Engagement", weight: 0.2, value: 88 }], trend: [50, 55, 62, 70, 78, 82, 87] },
  { id: "3", contactId: "u3", contactName: "Anita Desai", contactEmail: "anita@example.com", score: 78, factors: [{ name: "Email Opens", weight: 0.3, value: 70 }, { name: "Page Visits", weight: 0.25, value: 85 }, { name: "Purchase History", weight: 0.25, value: 75 }, { name: "Social Engagement", weight: 0.2, value: 80 }], trend: [40, 48, 55, 60, 68, 72, 78] },
  { id: "4", contactId: "u4", contactName: "Vikram Singh", contactEmail: "vikram@example.com", score: 71, factors: [{ name: "Email Opens", weight: 0.3, value: 65 }, { name: "Page Visits", weight: 0.25, value: 78 }, { name: "Purchase History", weight: 0.25, value: 70 }, { name: "Social Engagement", weight: 0.2, value: 68 }], trend: [30, 38, 45, 52, 58, 65, 71] },
  { id: "5", contactId: "u5", contactName: "Meera Patel", contactEmail: "meera@example.com", score: 65, factors: [{ name: "Email Opens", weight: 0.3, value: 60 }, { name: "Page Visits", weight: 0.25, value: 72 }, { name: "Purchase History", weight: 0.25, value: 58 }, { name: "Social Engagement", weight: 0.2, value: 68 }], trend: [25, 30, 38, 45, 50, 58, 65] },
  { id: "6", contactId: "u6", contactName: "Arjun Reddy", contactEmail: "arjun@example.com", score: 54, factors: [{ name: "Email Opens", weight: 0.3, value: 50 }, { name: "Page Visits", weight: 0.25, value: 60 }, { name: "Purchase History", weight: 0.25, value: 48 }, { name: "Social Engagement", weight: 0.2, value: 55 }], trend: [20, 25, 30, 35, 42, 48, 54] },
  { id: "7", contactId: "u7", contactName: "Kavitha Nair", contactEmail: "kavitha@example.com", score: 43, factors: [{ name: "Email Opens", weight: 0.3, value: 40 }, { name: "Page Visits", weight: 0.25, value: 50 }, { name: "Purchase History", weight: 0.25, value: 38 }, { name: "Social Engagement", weight: 0.2, value: 42 }], trend: [15, 18, 22, 28, 32, 38, 43] },
  { id: "8", contactId: "u8", contactName: "Sunil Gupta", contactEmail: "sunil@example.com", score: 31, factors: [{ name: "Email Opens", weight: 0.3, value: 28 }, { name: "Page Visits", weight: 0.25, value: 35 }, { name: "Purchase History", weight: 0.25, value: 30 }, { name: "Social Engagement", weight: 0.2, value: 32 }], trend: [10, 12, 15, 18, 22, 26, 31] },
];

export const mockSocialAccounts: SocialAccountData[] = [
  { id: "sa1", platform: "INSTAGRAM", accountName: "@krayavikrayam", followersCount: 24500, isConnected: true, engagementRate: 4.8, postsCount: 342 },
  { id: "sa2", platform: "FACEBOOK", accountName: "Krayavikrayam", followersCount: 18200, isConnected: true, engagementRate: 3.2, postsCount: 456 },
  { id: "sa3", platform: "LINKEDIN", accountName: "Krayavikrayam", followersCount: 8900, isConnected: true, engagementRate: 5.1, postsCount: 128 },
  { id: "sa4", platform: "WHATSAPP", accountName: "+91-XXXX", followersCount: 3200, isConnected: true, engagementRate: 12.4, postsCount: 89 },
  { id: "sa5", platform: "YOUTUBE", accountName: "Krayavikrayam", followersCount: 5600, isConnected: false, engagementRate: 2.8, postsCount: 67 },
  { id: "sa6", platform: "X_TWITTER", accountName: "@krayavikrayam", followersCount: 12300, isConnected: true, engagementRate: 2.1, postsCount: 892 },
  { id: "sa7", platform: "TELEGRAM", accountName: "krayavikrayam", followersCount: 4100, isConnected: false, engagementRate: 8.3, postsCount: 156 },
  { id: "sa8", platform: "REFERRAL", accountName: "Referral Program", followersCount: 1850, isConnected: true, engagementRate: 15.2, postsCount: 0 },
];

export const mockSocialPosts: SocialPostData[] = [
  { id: "sp1", content: "Exciting new features coming to our platform! Stay tuned for the big reveal 🚀", platform: "INSTAGRAM", publishedAt: "2026-03-08T10:00:00Z", status: "PUBLISHED", likes: 342, comments: 28, shares: 45, impressions: 8900 },
  { id: "sp2", content: "Join us for a live demo of our latest AI-powered trading tools", platform: "LINKEDIN", publishedAt: "2026-03-07T14:00:00Z", status: "PUBLISHED", likes: 189, comments: 42, shares: 67, impressions: 12400 },
  { id: "sp3", content: "Flash sale alert! 30% off on all premium plans this weekend only", platform: "FACEBOOK", publishedAt: "2026-03-06T09:00:00Z", status: "PUBLISHED", likes: 567, comments: 89, shares: 123, impressions: 23400 },
  { id: "sp4", content: "Behind the scenes: How we built our multi-tenant architecture", platform: "X_TWITTER", publishedAt: "2026-03-05T16:00:00Z", status: "PUBLISHED", likes: 234, comments: 56, shares: 78, impressions: 15600 },
  { id: "sp5", content: "Customer success story: How Priya scaled her business 3x using Krayavikrayam", platform: "INSTAGRAM", scheduledAt: "2026-03-12T10:00:00Z", status: "SCHEDULED", likes: 0, comments: 0, shares: 0, impressions: 0 },
  { id: "sp6", content: "Weekly tips: 5 strategies for better engagement on social media", platform: "LINKEDIN", scheduledAt: "2026-03-11T14:00:00Z", status: "SCHEDULED", likes: 0, comments: 0, shares: 0, impressions: 0 },
];

export function generateMetricsTimeSeries(days: number = 30): ChannelMetricData[] {
  const data: ChannelMetricData[] = [];
  const baseDate = new Date("2026-02-08");
  let followers = 20000;
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    followers += Math.floor(Math.random() * 150) + 20;
    data.push({
      date: date.toISOString().split("T")[0],
      followers,
      impressions: Math.floor(Math.random() * 5000) + 3000,
      engagementRate: parseFloat((Math.random() * 3 + 2).toFixed(1)),
      clicks: Math.floor(Math.random() * 400) + 100,
      conversions: Math.floor(Math.random() * 50) + 10,
      revenue: parseFloat((Math.random() * 2000 + 500).toFixed(2)),
    });
  }
  return data;
}

export const postingHeatmapData = [
  { day: "Mon", "6am": 12, "9am": 45, "12pm": 78, "3pm": 65, "6pm": 89, "9pm": 34 },
  { day: "Tue", "6am": 8, "9am": 52, "12pm": 82, "3pm": 71, "6pm": 95, "9pm": 41 },
  { day: "Wed", "6am": 15, "9am": 48, "12pm": 72, "3pm": 68, "6pm": 88, "9pm": 38 },
  { day: "Thu", "6am": 11, "9am": 55, "12pm": 85, "3pm": 74, "6pm": 92, "9pm": 45 },
  { day: "Fri", "6am": 18, "9am": 42, "12pm": 68, "3pm": 58, "6pm": 78, "9pm": 52 },
  { day: "Sat", "6am": 22, "9am": 35, "12pm": 55, "3pm": 48, "6pm": 65, "9pm": 62 },
  { day: "Sun", "6am": 25, "9am": 30, "12pm": 48, "3pm": 42, "6pm": 58, "9pm": 55 },
];

export const utmReferralData = [
  { channel: "Instagram", visits: 4500, conversions: 320, revenue: 12800 },
  { channel: "Facebook", visits: 3800, conversions: 245, revenue: 9800 },
  { channel: "LinkedIn", visits: 2100, conversions: 189, revenue: 15200 },
  { channel: "X/Twitter", visits: 1800, conversions: 95, revenue: 3800 },
  { channel: "YouTube", visits: 1200, conversions: 78, revenue: 6200 },
  { channel: "Telegram", visits: 800, conversions: 65, revenue: 2600 },
  { channel: "WhatsApp", visits: 600, conversions: 52, revenue: 4100 },
  { channel: "Referrals", visits: 950, conversions: 142, revenue: 11300 },
];

export const roiPerChannel = [
  { name: "Instagram", value: 12800, color: "#E4405F" },
  { name: "Facebook", value: 9800, color: "#1877F2" },
  { name: "LinkedIn", value: 15200, color: "#0A66C2" },
  { name: "X/Twitter", value: 3800, color: "#14171A" },
  { name: "YouTube", value: 6200, color: "#FF0000" },
  { name: "Telegram", value: 2600, color: "#26A5E4" },
  { name: "WhatsApp", value: 4100, color: "#25D366" },
  { name: "Referrals", value: 11300, color: "#F59E0B" },
];

// Campaign analytics over time (for detail page charts)
export function generateCampaignAnalytics(campaignId: string) {
  const days = 14;
  const data = [];
  const base = new Date("2026-02-20");
  for (let i = 0; i < days; i++) {
    const date = new Date(base);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString().split("T")[0],
      opens: Math.floor(Math.random() * 300) + 100,
      clicks: Math.floor(Math.random() * 80) + 20,
      conversions: Math.floor(Math.random() * 20) + 5,
      unsubscribes: Math.floor(Math.random() * 5),
    });
  }
  return data;
}
