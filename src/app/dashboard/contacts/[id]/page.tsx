"use client";

import { use } from "react";
import { ContactDetail } from "@/components/contacts/contact-detail";

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <ContactDetail contactId={id} />;
}
