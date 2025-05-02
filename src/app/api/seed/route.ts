import { db } from '../../../db';
import { advocates } from '../../../db/schema';
import { advocateData } from '../../../db/seed/advocates';
import { NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function POST() {
  try {
    const records = await db
      .insert(advocates)
      .values(advocateData)
      .onConflictDoNothing()
      .returning();
    return NextResponse.json({ advocates: records });
  } catch (error) {
    console.error('Error inserting advocates:', error);
    return NextResponse.json(
      { error: 'Failed to insert advocates' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
