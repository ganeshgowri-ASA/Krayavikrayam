import type { POHeader as POHeaderType } from "../../../../lib/types";
import { formatDate, formatMoney } from "../../../../lib/format";
import { Section, Stat, StatGrid } from "./Section";
import { POStatusBadge } from "./StatusBadge";

export function POHeader({ header }: { header: POHeaderType }) {
  return (
    <Section
      title="PO header"
      description={`${header.supplier.name} (${header.supplier.code})`}
      action={<POStatusBadge status={header.status} />}
    >
      <StatGrid>
        <Stat label="PO No." value={header.poNo} />
        <Stat label="Buyer" value={header.buyer} />
        <Stat label="Plant" value={header.plant} />
        <Stat
          label="Total value"
          value={formatMoney(header.value, header.currency)}
        />
        <Stat label="Issued" value={formatDate(header.issuedAt)} />
        <Stat
          label="Expected delivery"
          value={formatDate(header.expectedDelivery)}
        />
        <Stat label="Payment terms" value={header.paymentTerms} />
        <Stat label="Incoterm" value={header.incoterm} />
      </StatGrid>
    </Section>
  );
}
