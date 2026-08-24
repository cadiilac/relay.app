/**
 * Supabase Keep-Alive Script
 * ---------------------------
 * Pings your Supabase project so it doesn't get auto-paused for inactivity
 * (free-tier projects pause after ~7 days with no activity).
 *
 * Requires Node 18+ (for built-in fetch).
 *
 * Environment variables required:
 *   SUPABASE_URL       - e.g. https://abcdefghijk.supabase.co
 *   SUPABASE_ANON_KEY  - your project's anon/public API key
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_ANON_KEY=... node keep-alive.js
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "Missing required environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

async function pingSupabase() {
  // Hitting the REST root endpoint is enough to register activity.
  // It just returns the OpenAPI schema info - no table access needed,
  // so this works even on a brand-new project with no tables yet.
  const endpoint = `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const timestamp = new Date().toISOString();

    if (res.ok) {
      console.log(`[${timestamp}] Keep-alive ping succeeded (status ${res.status}).`);
    } else {
      console.error(
        `[${timestamp}] Keep-alive ping returned non-OK status: ${res.status} ${res.statusText}`
      );
      const body = await res.text();
      console.error(body);
      process.exit(1);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Keep-alive ping failed:`, err.message);
    process.exit(1);
  }
}

pingSupabase();
