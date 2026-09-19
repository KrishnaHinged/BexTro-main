import { proxyToBackend } from "@/lib/proxyToBackend";

export async function GET(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/goals/${id}`);
}

export async function PATCH(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/goals/${id}`);
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  return proxyToBackend(req, `/goals/${id}`);
}
