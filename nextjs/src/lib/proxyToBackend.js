import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5005";

export async function proxyToBackend(req, backendPath, options = {}) {
  try {
    const url = new URL(req.url);
    const targetUrl = `${BACKEND_URL}/api/v1${backendPath}${url.search}`;

    const headers = new Headers();
    
    // Forward relevant headers
    const contentType = req.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);

    const authorization = req.headers.get("authorization");
    if (authorization) headers.set("authorization", authorization);

    // Forward cookies
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    } else {
      const rawCookie = req.headers.get("cookie");
      if (rawCookie) headers.set("cookie", rawCookie);
    }

    let body = undefined;
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
      if (contentType?.includes("multipart/form-data")) {
        body = await req.formData();
      } else if (contentType?.includes("application/json")) {
        try {
          body = JSON.stringify(await req.json());
        } catch {
          body = undefined;
        }
      } else {
        try {
          body = await req.text();
        } catch {
          body = undefined;
        }
      }
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      ...options,
    });

    const data = await response.text();
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch {
      jsonData = data;
    }

    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        resHeaders.append(key, value);
      }
    });

    return Response.json(jsonData, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error(`Proxy Error [${backendPath}]:`, error);
    return Response.json(
      { message: "Backend proxy error", error: error.message },
      { status: 502 }
    );
  }
}
