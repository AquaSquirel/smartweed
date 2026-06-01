import { addReading, getReadings } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json(
    { readings: getReadings() },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}

export async function POST(request: Request) {
  const token = process.env.API_TOKEN;
  if (token) {
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${token}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  let body: { device_id?: string; distance_cm?: number };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { device_id, distance_cm } = body;

  if (typeof distance_cm !== 'number' || isNaN(distance_cm)) {
    return Response.json({ error: 'distance_cm é obrigatório e deve ser um número' }, { status: 400 });
  }

  const reading = addReading(device_id ?? 'sensor-desconhecido', distance_cm);
  return Response.json({ ok: true, reading });
}
