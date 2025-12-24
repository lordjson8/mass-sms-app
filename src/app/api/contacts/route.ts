import { prisma } from "@/lib/prisma";
import { contactSchema, bulkImportSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function logActivity(
  userId: string,
  action: string,
  details?: string,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      details,
      ipAddress,
      userAgent,
    },
  });
}

// GET /api/contacts
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where = categoryId ? { categoryId } : {};

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contact.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST /api/contacts (Add single or bulk import)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    // Check if it's bulk import
    if (Array.isArray(body.contacts)) {
      const parsed = bulkImportSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid data format" },
          { status: 400 }
        );
      }

      const created = await prisma.contact.createMany({
        data: parsed.data.contacts,
        skipDuplicates: true,
      });

      await logActivity(
        (session.user as any).id,
        "BULK_IMPORT_CONTACTS",
        `Imported ${created.count} contacts`,
        ipAddress,
        userAgent
      );

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${created.count} contacts`,
        data: { count: created.count },
      });
    }

    // Single contact creation
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid contact data", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: parsed.data,
      include: { category: true },
    });

    await logActivity(
      (session.user as any).id,
      "CREATE_CONTACT",
      `Added contact: ${parsed.data.phoneNumber}`,
      ipAddress,
      userAgent
    );

    return NextResponse.json(
      {
        success: true,
        message: "Contact created successfully",
        data: contact,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Contact already exists in this category" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
