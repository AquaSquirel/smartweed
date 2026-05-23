export async function GET(request: Request) {
  const channelId = process.env.THINGSPEAK_CHANNEL_ID;
  const apiKey = process.env.THINGSPEAK_READ_API_KEY;

  if (!channelId || !apiKey) {
    return Response.json(
      { error: 'ThingSpeak não configurado. Defina THINGSPEAK_CHANNEL_ID e THINGSPEAK_READ_API_KEY no .env.local' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const results = searchParams.get('results') || '100';

  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=${results}`;
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      throw new Error(`ThingSpeak retornou status ${res.status}`);
    }

    const data = await res.json();

    if (data === -1 || data?.status === '-1') {
      return Response.json(
        { error: 'API Key inválida ou canal privado sem permissão' },
        { status: 401 }
      );
    }

    return Response.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    return Response.json(
      { error: 'Erro ao buscar dados do ThingSpeak' },
      { status: 500 }
    );
  }
}
