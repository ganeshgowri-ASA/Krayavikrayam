"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockPipeline } from "@/lib/mock-data";

export function CreateDealForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stageOptions = mockPipeline.stages
    .filter((s) => s.order <= 4)
    .map((s) => ({
      value: s.id,
      label: `${s.name} (${s.probability}%)`,
    }));

  const currencyOptions = [
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
    { value: "GBP", label: "GBP" },
    { value: "INR", label: "INR" },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const selectedStage = mockPipeline.stages.find(
      (s) => s.id === formData.get("stageId")
    );

    const data = {
      title: formData.get("title"),
      value: parseFloat(formData.get("value") as string) || 0,
      currency: formData.get("currency"),
      expectedCloseDate: formData.get("expectedCloseDate") || null,
      stageId: formData.get("stageId"),
      contactName: formData.get("contactName") || null,
      accountName: formData.get("accountName") || null,
      ownerName: formData.get("ownerName") || null,
      probability: selectedStage?.probability || 0,
      notes: formData.get("notes") || null,
    };

    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/dashboard/pipeline");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Deal</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Add a new deal to your sales pipeline
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Deal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="title"
              name="title"
              label="Deal Title"
              placeholder="e.g., Acme Corp - Enterprise Plan"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="value"
                name="value"
                label="Value"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
              <Select
                id="currency"
                name="currency"
                label="Currency"
                options={currencyOptions}
                defaultValue="USD"
              />
            </div>
            <Input
              id="expectedCloseDate"
              name="expectedCloseDate"
              label="Expected Close Date"
              type="date"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline &amp; Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pipeline</label>
              <p className="text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-md px-3 py-2">
                {mockPipeline.name}
              </p>
            </div>
            <Select
              id="stageId"
              name="stageId"
              label="Stage"
              options={stageOptions}
              defaultValue={stageOptions[0]?.value}
              required
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacts &amp; Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="contactName"
              name="contactName"
              label="Contact Name"
              placeholder="e.g., John Smith"
            />
            <Input
              id="accountName"
              name="accountName"
              label="Account Name"
              placeholder="e.g., Acme Corp"
            />
            <Input
              id="ownerName"
              name="ownerName"
              label="Deal Owner"
              placeholder="e.g., Alice Johnson"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-[var(--foreground)]"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="flex w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="Additional notes about this deal..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Deal"}
          </Button>
        </div>
      </div>
    </form>
  );
}
