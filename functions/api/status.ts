// Cloudflare Pages Function: Same-origin, edge-cached proxy to VDS Gatus status API.
// Keeps CORS clean and shields the VDS behind Cloudflare's 15s edge cache.
export async function onRequestGet(): Promise<Response> {
  const upstream = 'https://status.metehanbeyaz.com/api/v1/endpoints/statuses';
  try {
    const res = await fetch(upstream, {
      headers: { Accept: 'application/json', 'User-Agent': 'metehanbeyaz-site/1.0' },
      // @ts-ignore Cloudflare Pages fetch option
      cf: { cacheTtl: 15, cacheEverything: true },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ ok: false, endpoints: [] }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=10',
        },
      });
    }

    const raw = (await res.json()) as Array<{
      name: string;
      group: string;
      key: string;
      results?: Array<{ success: boolean; duration: number; timestamp: string }>;
    }>;

    const endpoints = raw.map((ep) => {
      const last = ep.results && ep.results.length > 0 ? ep.results[ep.results.length - 1] : null;
      return {
        name: ep.name,
        group: ep.group,
        key: ep.key,
        up: Boolean(last?.success),
        ms: last ? Math.round((last.duration || 0) / 1e6) : null,
        at: last?.timestamp ?? null,
      };
    });

    const allUp = endpoints.length > 0 && endpoints.every((e) => e.up);
    return new Response(JSON.stringify({ ok: true, allUp, endpoints }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=15',
      },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, endpoints: [] }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=10',
      },
    });
  }
}
