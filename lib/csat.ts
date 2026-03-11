export function getCsatLabel(rating: number | null): string {
  if (!rating) return "Pending";
  if (rating >= 4) return "Satisfied";
  if (rating === 3) return "Neutral";
  return "Unsatisfied";
}

export async function triggerCsatSurvey(ticketId: string): Promise<void> {
  // Stub: sends CSAT survey email via Resend
}
