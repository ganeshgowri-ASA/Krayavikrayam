import { ForecastCharts } from "@/components/forecasting/forecast-charts";
import {
  mockDeals,
  mockQuotas,
  mockForecastData,
  mockWinLossData,
  mockPipelineValueData,
} from "@/lib/mock-data";
import { calculateDealScore } from "@/lib/utils";

export default function ForecastingPage() {
  const now = new Date();
  const openDeals = mockDeals.filter((d) => d.status === "OPEN");
  const wonDeals = mockDeals.filter((d) => d.status === "WON");
  const lostDeals = mockDeals.filter((d) => d.status === "LOST");

  const totalPipelineValue = openDeals.reduce((sum, d) => sum + d.value, 0);
  const weightedPipelineValue = Math.round(
    openDeals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0)
  );
  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.value, 0);
  const totalClosed = wonDeals.length + lostDeals.length;
  const winRate = totalClosed > 0 ? Math.round((wonDeals.length / totalClosed) * 100) : 0;
  const avgDealSize = wonDeals.length > 0 ? Math.round(totalWonValue / wonDeals.length) : 0;

  const dealScores = openDeals.map((deal) => {
    const daysSince = Math.floor(
      (now.getTime() - new Date(deal.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return {
      dealId: deal.id,
      dealTitle: deal.title,
      score: calculateDealScore(deal.probability, daysSince),
      probability: deal.probability,
    };
  });

  const winLossAnalysis = {
    totalDeals: mockDeals.length,
    wonCount: wonDeals.length,
    lostCount: lostDeals.length,
    openCount: openDeals.length,
    winRate,
    avgDealSize,
    avgTimeToClose: 45,
    topLossReasons: [
      { reason: "Price too high", count: 3 },
      { reason: "Competitor selected", count: 2 },
      { reason: "No budget", count: 1 },
    ],
  };

  return (
    <ForecastCharts
      forecast={mockForecastData}
      winLoss={mockWinLossData}
      pipelineValue={mockPipelineValueData}
      quotas={mockQuotas}
      summary={{
        totalPipelineValue,
        weightedPipelineValue,
        totalWonValue,
        winRate,
        avgDealSize,
        openDealsCount: openDeals.length,
      }}
      winLossAnalysis={winLossAnalysis}
      dealScores={dealScores}
    />
  );
}
