import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { followerId, followingId } = await req.json();
    if (!followerId || !followingId) {
      return NextResponse.json({ error: "followerId and followingId required" }, { status: 400 });
    }
    if (followerId === followingId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/followers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${serviceKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({ follower_id: followerId, following_id: followingId }),
      });
      if (!res.ok) {
        const err = await res.text();
        return NextResponse.json({ error: err }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true, demo: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { followerId, followingId } = await req.json();
    if (!followerId || !followingId) {
      return NextResponse.json({ error: "followerId and followingId required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      await fetch(
        `${supabaseUrl}/rest/v1/followers?follower_id=eq.${followerId}&following_id=eq.${followingId}`,
        {
          method: "DELETE",
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${serviceKey}`,
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const headers = {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${serviceKey}`,
      };

      const [followersRes, followingRes] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/followers?following_id=eq.${userId}&select=follower_id`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/followers?follower_id=eq.${userId}&select=following_id`, { headers }),
      ]);

      const followers = followersRes.ok ? await followersRes.json() : [];
      const following = followingRes.ok ? await followingRes.json() : [];

      return NextResponse.json({
        followers: followers.map((f: any) => f.follower_id),
        following: following.map((f: any) => f.following_id),
        count: { followers: followers.length, following: following.length },
      });
    }

    return NextResponse.json({
      followers: [],
      following: [],
      count: { followers: 0, following: 0 },
      demo: true,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
