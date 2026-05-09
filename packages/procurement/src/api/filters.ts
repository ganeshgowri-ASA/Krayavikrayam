import type { Rfq, RfqFilters } from "../types";

export function applyFilters(rfqs: Rfq[], f: RfqFilters | undefined): Rfq[] {
  if (!f) return rfqs;
  return rfqs.filter((r) => {
    if (f.status?.length && !f.status.includes(r.status)) return false;
    if (f.buyerId?.length && !f.buyerId.includes(r.buyer.id)) return false;
    if (f.country?.length && !f.country.includes(r.plant.country)) return false;
    if (f.plantId?.length && !f.plantId.includes(r.plant.id)) return false;
    if (
      f.materialCode?.length &&
      !r.materialCodes.some((c) => f.materialCode!.includes(c))
    )
      return false;
    if (f.dueDateFrom && new Date(r.dueDate) < new Date(f.dueDateFrom)) return false;
    if (f.dueDateTo && new Date(r.dueDate) > new Date(f.dueDateTo)) return false;
    if (f.search) {
      const q = f.search.toLowerCase();
      const blob = `${r.number} ${r.title} ${r.buyer.name} ${r.plant.name}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });
}
