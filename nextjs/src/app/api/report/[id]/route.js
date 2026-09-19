import { proxyToBackend } from "@/lib/proxyToBackend";

export async function PATCH(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/report/${id}`);
}
