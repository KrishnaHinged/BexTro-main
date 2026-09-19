import { proxyToBackend } from "@/lib/proxyToBackend";

export async function DELETE(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/admin/challenges/${id}`);
}
