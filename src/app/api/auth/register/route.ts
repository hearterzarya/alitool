import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check database connection first
    try {
      await prisma.$connect();
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection failed. Please check your DATABASE_URL environment variable and ensure the database is running.",
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 503 }
      );
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (prismaError: any) {
      console.error("Prisma query error:", prismaError);
      
      // Handle specific Prisma errors
      if (prismaError.code === 'P2024') {
        return NextResponse.json(
          { 
            error: "Database connection timed out. Please check your database connection and try again.",
            details: process.env.NODE_ENV === 'development' ? "P2024: Connection timeout" : undefined
          },
          { status: 503 }
        );
      }
      
      if (prismaError.code === 'P2021') {
        return NextResponse.json(
          { 
            error: "Database tables not found. Please run 'npm run db:push' to create the database schema.",
            details: process.env.NODE_ENV === 'development' ? "P2021: Table does not exist" : undefined
          },
          { status: 503 }
        );
      }
      
      throw prismaError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Handle Prisma errors
    if (error.code === 'P2024') {
      return NextResponse.json(
        { 
          error: "Database connection timed out. Please check your database connection.",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      );
    }
    
    if (error.code === 'P2021') {
      return NextResponse.json(
        { 
          error: "Database tables not found. Please run database migrations.",
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Something went wrong",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    // Disconnect Prisma to avoid connection pool issues
    await prisma.$disconnect().catch(() => {});
  }
}
