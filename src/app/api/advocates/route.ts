import { usePostgres } from "@/db/config";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  return usePostgres ? await db.select().from(advocates) : Response.json({advocateData})
}