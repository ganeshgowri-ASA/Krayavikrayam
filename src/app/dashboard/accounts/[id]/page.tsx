"use client";

import { use } from "react";
import { AccountDetail } from "@/components/accounts/account-detail";

export default function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AccountDetail accountId={id} />;
}
