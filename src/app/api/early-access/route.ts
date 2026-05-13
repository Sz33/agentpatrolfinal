import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    const { name, email, company, use_case } = await req.json();

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    await sql`
      CREATE TABLE IF NOT EXISTS early_access_requests (
        id         SERIAL PRIMARY KEY,
        name       TEXT NOT NULL,
        email      TEXT NOT NULL,
        company    TEXT,
        use_case   TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO early_access_requests (name, email, company, use_case)
      VALUES (${name.trim()}, ${email.trim()}, ${company?.trim() ?? null}, ${use_case?.trim() ?? null})
    `;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[early-access]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
