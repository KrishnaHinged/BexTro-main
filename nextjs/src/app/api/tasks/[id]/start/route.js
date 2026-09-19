import { proxyToBackend } from "@/lib/proxyToBackend";

export async function POST(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/tasks/${id}/start`);
}
