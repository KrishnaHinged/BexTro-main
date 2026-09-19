import { proxyToBackend } from "@/lib/proxyToBackend";

export async function POST(req) {
  return proxyToBackend(req, "/goals/ai-plan");
}
