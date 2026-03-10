"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StatusBadge, PriorityBadge } from "@/components/StatusBadge";
import { SlaStatusBar } from "@/components/SlaCountdown";
import { ArrowLeft, Send, Lock, UserPlus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Comment {
  id: string;
  userId: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

interface TicketDetail {
  id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  contactId: string | null;
  assignedTo: string | null;
  orgId: string;
  slaDeadline: string | null;
  resolvedAt: string | null;
  createdAt: string;
  comments: Comment[];
  csatSurvey: { id: string; rating: number | null; feedback: string | null } | null;
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [assignTo, setAssignTo] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  async function fetchTicket() {
    const res = await fetch(`/api/tickets/${params.id}`);
    if (!res.ok) {
      router.push("/dashboard/tickets");
      return;
    }
    setTicket(await res.json());
    setLoading(false);
  }

  async function updateStatus(status: string) {
    await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchTicket();
  }

  async function escalatePriority() {
    const escalation: Record<string, string> = {
      low: "medium",
      medium: "high",
      high: "urgent",
      urgent: "urgent",
    };
    if (!ticket) return;
    await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priority: escalation[ticket.priority] }),
    });
    fetchTicket();
  }

  async function assignTicket(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/tickets/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assignedTo: assignTo }),
    });
    setShowAssignModal(false);
    setAssignTo("");
    fetchTicket();
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;
    await fetch(`/api/tickets/${params.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: commentText,
        isInternal,
        userId: "current-user",
      }),
    });
    setCommentText("");
    setIsInternal(false);
    fetchTicket();
  }

  if (loading) return <div className="p-8 text-gray-500">Loading...</div>;
  if (!ticket) return null;

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/dashboard/tickets"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
          <div className="flex items-center gap-3">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-sm text-gray-500">
              Assigned to: {ticket.assignedTo || "Unassigned"}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            <UserPlus className="h-4 w-4" />
            Assign
          </button>
          {ticket.priority !== "urgent" && (
            <button
              onClick={escalatePriority}
              className="px-3 py-1.5 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
            >
              Escalate
            </button>
          )}
          {ticket.status === "open" && (
            <button
              onClick={() => updateStatus("in_progress")}
              className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
            >
              Start Work
            </button>
          )}
          {(ticket.status === "open" || ticket.status === "in_progress") && (
            <button
              onClick={() => updateStatus("resolved")}
              className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
            >
              Resolve
            </button>
          )}
          {ticket.status === "resolved" && (
            <button
              onClick={() => updateStatus("closed")}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <SlaStatusBar
        deadline={ticket.slaDeadline}
        createdAt={ticket.createdAt}
        resolvedAt={ticket.resolvedAt}
      />

      <div className="mt-6 bg-white border rounded-lg p-6">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-4">
          Comments ({ticket.comments.length})
        </h3>
        <div className="space-y-4 mb-6">
          {ticket.comments.map((comment) => (
            <div
              key={comment.id}
              className={`border rounded-lg p-4 ${
                comment.isInternal
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">{comment.userId}</span>
                {comment.isInternal && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600">
                    <Lock className="h-3 w-3" />
                    Internal
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.content}</p>
            </div>
          ))}
          {ticket.comments.length === 0 && (
            <p className="text-gray-400 text-sm">No comments yet.</p>
          )}
        </div>

        <form onSubmit={addComment} className="bg-white border rounded-lg p-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full border rounded-lg px-3 py-2 mb-3 resize-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded"
              />
              <Lock className="h-3 w-3" />
              Internal note
            </label>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>
      </div>

      {ticket.csatSurvey && (
        <div className="mt-6 bg-white border rounded-lg p-6">
          <h3 className="font-medium mb-2">Customer Satisfaction</h3>
          {ticket.csatSurvey.rating ? (
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= (ticket.csatSurvey?.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              {ticket.csatSurvey.feedback && (
                <p className="text-sm text-gray-600">
                  {ticket.csatSurvey.feedback}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Survey sent — awaiting customer response.
            </p>
          )}
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-4">Assign Ticket</h2>
            <form onSubmit={assignTicket} className="space-y-4">
              <input
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                placeholder="Agent name or ID"
                className="w-full border rounded-lg px-3 py-2"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
