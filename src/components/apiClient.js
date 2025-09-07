// components/apiClient.js
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

export async function fetchMessages() {
  const res = await fetch(`${API_BASE}/contact`, {
    headers: { "x-api-key": API_KEY },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/contact/${id}`, {
    method: "DELETE",
    headers: { "x-api-key": API_KEY },
  });
  if (!res.ok) throw new Error("Failed to delete message");
}

export async function replyMessage(id, body) {
  const res = await fetch(`${API_BASE}/contact/${id}/reply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
    },
    body: JSON.stringify({ body }),
  });
  if (!res.ok) throw new Error("Failed to send reply");
}
