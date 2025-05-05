import { usePostgres } from '@/db/config';
import { db } from '../../../db';
import { advocates } from '../../../db/schema';
import { advocateData } from '../../../db/seed/advocates';
import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function GET(): Promise<NextResponse> {
  try {
    const data = usePostgres ? await db.select().from(advocates) : advocateData;

    return NextResponse.json({ advocates: data });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advocates' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
