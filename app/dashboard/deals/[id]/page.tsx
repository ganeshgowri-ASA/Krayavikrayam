import { notFound } from "next/navigation";
import { DealDetailView } from "@/components/deals/deal-detail-view";
import { getDealById } from "@/lib/mock-data";

interface DealPageProps {
  params: Promise<{ id: string }>;
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  return <DealDetailView deal={deal} />;
}
