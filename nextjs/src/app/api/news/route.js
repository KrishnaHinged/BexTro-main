import axios from "axios";

export async function GET(req) {
  try {
    const apiKey = process.env.GNEWS_API_KEY;
    if (!apiKey) {
      throw new Error("GNEWS_API_KEY is missing in environment variables");
    }

    const response = await axios.get("https://gnews.io/api/v4/search", {
      params: {
        q: "startup",
        lang: "en",
        country: "us",
        max: 10,
        token: apiKey,
      },
    });

    return Response.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error.response?.data || error.message);
    return Response.json({ error: error.message || "Failed to fetch news" }, { status: 500 });
  }
}
