import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.STRAPI_API_URL;
const VIDEOS_ENDPOINT = "/api/videos";

async function fetchVideoData(id: string) {
  const response = await fetch(`${STRAPI_URL}${VIDEOS_ENDPOINT}/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video data: ${response.statusText}`);
  }

  return response.json();
}

async function updateVideoCount(id: string, newCount: number) {
  const response = await fetch(`${STRAPI_URL}${VIDEOS_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { count: newCount } }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update video count: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const videoData = await fetchVideoData(id);
    const currentCount = videoData.data.attributes.count || 0;
    const newCount = currentCount + 1;

    const updatedData = await updateVideoCount(id, newCount);

    return NextResponse.json({
      message: "Count updated successfully",
      newCount: updatedData.data.attributes.count,
    });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
