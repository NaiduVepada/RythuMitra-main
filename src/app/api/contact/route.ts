import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type ContactMessage = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  location?: string;
  message: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

async function ensureDataDir() {
  try {
    await fs.promises.access(DATA_DIR);
  } catch (e) {
    await fs.promises.mkdir(DATA_DIR, { recursive: true });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, phone, subject, location, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entry: ContactMessage = {
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      subject: subject ? String(subject) : undefined,
      location: location ? String(location) : undefined,
      message: String(message),
      createdAt: new Date().toISOString(),
    };

    await ensureDataDir();

    let existing: ContactMessage[] = [];
    try {
      const raw = await fs.promises.readFile(CONTACTS_FILE, "utf-8");
      existing = JSON.parse(raw) as ContactMessage[];
    } catch (err) {
      // ignore if file doesn't exist or is invalid
    }

    existing.unshift(entry);

    await fs.promises.writeFile(CONTACTS_FILE, JSON.stringify(existing, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error saving contact message:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
