import { proxyToBackend } from "@/lib/proxyToBackend";

export async function GET(req) {
  return proxyToBackend(req, "/next-action");
}

export async function POST(req) {
  return proxyToBackend(req, "/next-action");
}
