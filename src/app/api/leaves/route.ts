import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "CASUAL";

interface ILeaveRequest {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

interface ILeave {
  id: string;
  employeeId: string;
  type: LeaveType;
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

interface IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string | null;
  position: string | null;
}

interface ILeaveWithEmployee extends ILeave {
  employee: IEmployee | null;
}

// ==============================
// GET - Fetch Leaves
// ==============================

export const GET = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = getDB();

    // 2. Get leaves with employee information
    const query =
      currentUser.role === "admin"
        ? db.prepare(
            `SELECT
              l.id,
              l.employee_id AS employeeId,
              l.type,
              l.start_date AS startDate,
              l.end_date AS endDate,
              l.reason,
              l.status,
              l.admin_comment AS adminComment,
              l.reviewed_by AS reviewedBy,
              l.reviewed_at AS reviewedAt,
              l.created_at AS createdAt,
              l.updated_at AS updatedAt,
              e.id AS employeeRecordId,
              e.first_name AS firstName,
              e.last_name AS lastName,
              e.email AS employeeEmail,
              e.department,
              e.position
            FROM leaves l
            LEFT JOIN employees e
              ON l.employee_id = e.id
              AND e.is_deleted = 0
            ORDER BY l.created_at DESC`,
          )
        : db
            .prepare(
              `SELECT
              l.id,
              l.employee_id AS employeeId,
              l.type,
              l.start_date AS startDate,
              l.end_date AS endDate,
              l.reason,
              l.status,
              l.admin_comment AS adminComment,
              l.reviewed_by AS reviewedBy,
              l.reviewed_at AS reviewedAt,
              l.created_at AS createdAt,
              l.updated_at AS updatedAt,
              e.id AS employeeRecordId,
              e.first_name AS firstName,
              e.last_name AS lastName,
              e.email AS employeeEmail,
              e.department,
              e.position
            FROM leaves l
            INNER JOIN employees e
              ON l.employee_id = e.id
            WHERE e.user_id = ?
              AND e.is_deleted = 0
            ORDER BY l.created_at DESC`,
            )
            .bind(currentUser.userId);

    const result = await query.all<{
      id: string;
      employeeId: string;
      type: LeaveType;
      startDate: string;
      endDate: string;
      reason: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
      adminComment: string | null;
      reviewedBy: string | null;
      reviewedAt: string | null;
      createdAt: string;
      updatedAt: string;
      employeeRecordId: string | null;
      firstName: string | null;
      lastName: string | null;
      employeeEmail: string | null;
      department: string | null;
      position: string | null;
    }>();

    // 3. Map employee information
    const leaves: ILeaveWithEmployee[] = result.results.map((leave) => ({
      id: leave.id,
      employeeId: leave.employeeId,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      adminComment: leave.adminComment,
      reviewedBy: leave.reviewedBy,
      reviewedAt: leave.reviewedAt,
      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
      employee: leave.employeeRecordId
        ? {
            id: leave.employeeRecordId,
            firstName: leave.firstName ?? "",
            lastName: leave.lastName ?? "",
            email: leave.employeeEmail ?? "",
            department: leave.department,
            position: leave.position,
          }
        : null,
    }));

    return NextResponse.json(leaves, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get leaves error:", error);

    return NextResponse.json(
      { message: "Failed to get leaves" },
      { status: 500 },
    );
  }
};

// ==============================
// POST - Create Leave Request
// ==============================

export const POST = async (request: Request) => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Authorization
    if (currentUser.role !== "employee") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // 3. Validate request body
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const { type, startDate, endDate, reason } = body as Partial<ILeaveRequest>;

    const validTypes: LeaveType[] = ["ANNUAL", "SICK", "UNPAID", "CASUAL"];

    if (
      !validTypes.includes(type as LeaveType) ||
      typeof startDate !== "string" ||
      typeof endDate !== "string" ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      return NextResponse.json(
        { message: "Invalid leave data" },
        { status: 400 },
      );
    }

    // 4. Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      startDate > endDate
    ) {
      return NextResponse.json(
        { message: "Invalid leave dates" },
        { status: 400 },
      );
    }

    // 5. Find active employee
    const db = getDB();

    const employee = await db
      .prepare(
        `SELECT id
         FROM employees
         WHERE user_id = ?
           AND is_deleted = 0`,
      )
      .bind(currentUser.userId)
      .first<{ id: string }>();

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    // 6. Create leave record
    const now = new Date().toISOString();

    const newLeave: ILeave = {
      id: crypto.randomUUID(),
      employeeId: employee.id,
      type: type as LeaveType,
      startDate,
      endDate,
      reason: reason.trim(),
      status: "PENDING",
      adminComment: null,
      reviewedBy: null,
      reviewedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    // 7. Insert into D1
    await db
      .prepare(
        `INSERT INTO leaves (
          id,
          employee_id,
          type,
          start_date,
          end_date,
          reason,
          status,
          admin_comment,
          reviewed_by,
          reviewed_at,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        newLeave.id,
        newLeave.employeeId,
        newLeave.type,
        newLeave.startDate,
        newLeave.endDate,
        newLeave.reason,
        newLeave.status,
        newLeave.adminComment,
        newLeave.reviewedBy,
        newLeave.reviewedAt,
        newLeave.createdAt,
        newLeave.updatedAt,
      )
      .run();

    return NextResponse.json(
      {
        message: "Leave request created successfully",
        leave: newLeave,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create leave error:", error);

    return NextResponse.json(
      { message: "Failed to create leave request" },
      { status: 500 },
    );
  }
};
