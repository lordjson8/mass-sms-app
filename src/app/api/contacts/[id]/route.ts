import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

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

// PATCH /api/contacts/:id
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id: params.id },
      data: parsed.data,
      include: { category: true },
    });

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    await logActivity(
      (session.user as any).id,
      "UPDATE_CONTACT",
      `Updated contact: ${params.id}`,
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: "Contact updated successfully",
      data: contact,
    });
  } catch (error: any) {
    console.error("Error updating contact:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE /api/contacts/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.contact.delete({
      where: { id: params.id },
    });

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    await logActivity(
      (session.user as any).id,
      "DELETE_CONTACT",
      `Deleted contact: ${params.id}`,
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting contact:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
