import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth/token";

interface RouteParams {
  params: Promise<{
    leaveId: string;
  }>;
}

interface IUpdateLeaveRequest {
  status: "APPROVED" | "REJECTED";
  adminComment?: string;
}

interface ILeave {
  id: string;
  employeeId: string;
  type: "ANNUAL" | "SICK" | "UNPAID" | "CASUAL";
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminComment: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PATCH = async (request: Request, { params }: RouteParams) => {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json(
        { message: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // 2. Authorization
    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Get leave ID
    const { leaveId } = await params;

    // 4. Validate request body
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const { status, adminComment } = body as Partial<IUpdateLeaveRequest>;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { message: "Invalid leave status" },
        { status: 400 },
      );
    }

    if (adminComment !== undefined && typeof adminComment !== "string") {
      return NextResponse.json(
        { message: "Invalid admin comment" },
        { status: 400 },
      );
    }

    // 5. Find leave
    const db = getDB();

    const leave = await db
      .prepare(
        `SELECT
          id,
          employee_id AS employeeId,
          type,
          start_date AS startDate,
          end_date AS endDate,
          reason,
          status,
          admin_comment AS adminComment,
          reviewed_by AS reviewedBy,
          reviewed_at AS reviewedAt,
          created_at AS createdAt,
          updated_at AS updatedAt
         FROM leaves
         WHERE id = ?`,
      )
      .bind(leaveId)
      .first<ILeave>();

    if (!leave) {
      return NextResponse.json(
        { message: "Leave request not found" },
        { status: 404 },
      );
    }

    // 6. Only pending requests can be reviewed
    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { message: "This leave request has already been reviewed" },
        { status: 400 },
      );
    }

    // 7. Update leave
    const now = new Date().toISOString();
    const comment = adminComment ?? "";

    const updateResult = await db
      .prepare(
        `UPDATE leaves
         SET
           status = ?,
           admin_comment = ?,
           reviewed_by = ?,
           reviewed_at = ?,
           updated_at = ?
         WHERE id = ?
           AND status = 'PENDING'`,
      )
      .bind(status, comment, session.userId, now, now, leaveId)
      .run();

    if (updateResult.meta.changes === 0) {
      return NextResponse.json(
        { message: "Leave request has already been reviewed" },
        { status: 409 },
      );
    }

    // 8. Return updated leave
    const updatedLeave: ILeave = {
      ...leave,
      status,
      adminComment: comment,
      reviewedBy: session.userId,
      reviewedAt: now,
      updatedAt: now,
    };

    return NextResponse.json(
      {
        message: `Leave request ${status.toLowerCase()} successfully`,
        leave: updatedLeave,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update leave error:", error);

    return NextResponse.json(
      { message: "Failed to update leave request" },
      { status: 500 },
    );
  }
};
