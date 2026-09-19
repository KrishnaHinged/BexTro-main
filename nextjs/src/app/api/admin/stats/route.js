import { proxyToBackend } from "@/lib/proxyToBackend";

export async function GET(req) {
  return proxyToBackend(req, "/admin/stats");
}
