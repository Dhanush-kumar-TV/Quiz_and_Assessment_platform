import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import * as XLSX from "xlsx";
import { sendWelcomeEmail } from "@/lib/emailService";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet) as { name?: string; email?: string; password?: string | number }[];

    await connectToDatabase();

    const results = {
      success: 0,
      errors: 0,
      details: [] as string[]
    };

    for (const row of rows) {
      const { name, email, password } = row;

      if (!name || !email || !password) {
        results.errors++;
        results.details.push(`Skipped ${email || 'unknown'}: Missing required fields`);
        continue;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        results.errors++;
        results.details.push(`Skipped ${email}: User already exists`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(password.toString(), 10);
      try {
        await User.create({
          name,
          email,
          password: hashedPassword,
          role: 'user',
          status: 'active'
        });
        
        await sendWelcomeEmail(email, name, password.toString());
        
        results.success++;
      } catch (err: unknown) {
        results.errors++;
        results.details.push(`Error creating ${email}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
  }
}
