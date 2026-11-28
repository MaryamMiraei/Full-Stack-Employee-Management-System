import { NextResponse } from "next/server";

import { getDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/auth";

interface IProfileRow {
  id: string;
  email: string;
  role: "admin" | "employee";
  profileImage: string | null;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  bio: string | null;
  department: string | null;
  position: string | null;
}

export const GET = async () => {
  try {
    // 1. Authentication
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Get D1 database
    const db = getDB();

    // 3. Fetch user and employee profile
    const profile = await db
      .prepare(
        `SELECT
          u.id,
          u.email,
          u.role,
          u.profile_image AS profileImage,
          e.id AS employeeId,
          e.first_name AS firstName,
          e.last_name AS lastName,
          e.phone,
          e.bio,
          e.department,
          e.position
         FROM users u
         LEFT JOIN employees e
           ON e.user_id = u.id
           AND e.is_deleted = 0
         WHERE u.id = ?`,
      )
      .bind(currentUser.userId)
      .first<IProfileRow>();

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. Build profile response
    const response = {
      id: profile.id,
      employeeId: profile.employeeId,
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email,
      role: profile.role,
      phone: profile.phone ?? "",
      bio: profile.bio ?? "",
      profileImage: profile.profileImage,
      department: profile.department ?? "",
      position: profile.position ?? "",
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
};
