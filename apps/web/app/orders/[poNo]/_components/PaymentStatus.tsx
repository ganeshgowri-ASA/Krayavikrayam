import type { PaymentSummary } from "../../../../lib/types";
import { formatDate, formatMoney } from "../../../../lib/format";
import { Section, Stat, StatGrid } from "./Section";
import { PaymentStateBadge } from "./StatusBadge";

interface PaymentStatusProps {
  summary: PaymentSummary;
  currency: string;
}

export function PaymentStatus({ summary, currency }: PaymentStatusProps) {
  return (
    <Section
      title="Payment status"
      action={<PaymentStateBadge state={summary.state} />}
    >
      <StatGrid>
        <Stat
          label="Total invoiced"
          value={formatMoney(summary.totalInvoiced, currency)}
        />
        <Stat
          label="Total paid"
          value={formatMoney(summary.totalPaid, currency)}
        />
        <Stat
          label="Outstanding"
          value={formatMoney(summary.outstanding, currency)}
        />
        <Stat label="Next due" value={formatDate(summary.nextDueDate)} />
      </StatGrid>
    </Section>
  );
}
