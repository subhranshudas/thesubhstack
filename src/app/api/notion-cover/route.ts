import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Cover images on Notion pages are also pre-signed S3 URLs that expire in 1 hour.
// This proxy retrieves a fresh cover URL from the page object on each request.
export async function GET(request: NextRequest) {
  const pageId = request.nextUrl.searchParams.get("pageId");

  if (!pageId) {
    return new NextResponse("Missing pageId", { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const page = (await notion.pages.retrieve({ page_id: pageId })) as any;

    const cover = page.cover;
    let url: string | undefined;

    if (cover?.type === "external") url = cover.external?.url;
    if (cover?.type === "file") url = cover.file?.url;

    if (!url) {
      return new NextResponse("No cover image on page", { status: 404 });
    }

    // Cache for 50 minutes — safely within Notion's 1-hour S3 expiry
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=3000, s-maxage=3000, stale-while-revalidate=600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch page from Notion", { status: 500 });
  }
}
