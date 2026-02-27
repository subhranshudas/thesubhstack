import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Notion pre-signed S3 URLs expire in 1 hour. This proxy fetches a fresh URL
// from the Notion API on each request so the HTML never contains stale S3 URLs.
export async function GET(request: NextRequest) {
  const blockId = request.nextUrl.searchParams.get("blockId");

  if (!blockId) {
    return new NextResponse("Missing blockId", { status: 400 });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block = (await notion.blocks.retrieve({ block_id: blockId })) as any;

    let url: string | undefined;

    if (block.type === "image") {
      url = block.image?.file?.url ?? block.image?.external?.url;
    }

    if (!url) {
      return new NextResponse("Image not found in block", { status: 404 });
    }

    // Cache for 50 minutes — safely within Notion's 1-hour S3 expiry
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=3000, s-maxage=3000, stale-while-revalidate=600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch block from Notion", { status: 500 });
  }
}
