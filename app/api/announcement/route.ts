import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://strapi.xiaoxinlook.cc/api/websites/1?fields[]=announcement",
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();

    const announcement = data?.data?.attributes?.announcement || "暂无公告";

    return NextResponse.json({ announcement });
  } catch (error) {
    // console.error("获取公告失败:", error);

    return NextResponse.json({ error: "获取公告失败" }, { status: 500 });
  }
}
