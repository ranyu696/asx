import { NextResponse } from "next/server";

const API_URL = process.env.STRAPI_API_URL;
const ENDPOINT = '/api/websites/1?fields[]=announcement';

export async function GET() {
  try {
    const res = await fetch(`${API_URL}${ENDPOINT}`, {
      next: { revalidate: 3600 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const announcement = data?.data?.attributes?.announcement || "暂无公告";

    return NextResponse.json({ announcement });
  } catch (error) {
    console.error("获取公告失败:", error.message);
    return NextResponse.json({ error: "获取公告失败" }, { status: 500 });
  }
}
