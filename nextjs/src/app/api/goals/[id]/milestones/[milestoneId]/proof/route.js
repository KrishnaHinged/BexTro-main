import { proxyToBackend } from "@/lib/proxyToBackend";

export async function POST(req, { params }) {
  const { id, milestoneId } = await params;
  return proxyToBackend(req, `/goals/${id}/milestones/${milestoneId}/proof`);
}
