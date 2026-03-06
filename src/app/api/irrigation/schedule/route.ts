import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "irrigation.json");

async function ensure() {
  try {
    await fs.promises.access(DATA_DIR);
  } catch (e) {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { day, time, duration, zone } = body;
    if (!day || !time || !duration || !zone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const entry = { day: String(day), time: String(time), duration: String(duration), zone: String(zone), status: "scheduled", createdAt: new Date().toISOString() };

    await ensure();

    let existing = [];
    try {
      const raw = await fs.promises.readFile(FILE, "utf-8");
      existing = JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    existing.unshift(entry);
    await fs.promises.writeFile(FILE, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json(entry);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
