import { NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";
import { getCurrentUser } from "@/lib/auth/auth";

import type { IUserProfile } from "@/features/profile/types/profile.type";
import type { IEmployee } from "@/features/employees/types/employee.type";

export const GET = async () => {
  try {
    // 1. احراز هویت
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. دریافت اطلاعات حساب کاربر
    const userResponse = await serverApi.get(`/users/${currentUser.userId}`);

    const user = userResponse.data;

    // 3. دریافت اطلاعات کارمند متناظر با کاربر
    const employeeResponse = await serverApi.get<IEmployee[]>("/employees", {
      params: {
        userId: currentUser.userId,
        isDeleted: false,
      },
    });

    const employee = employeeResponse.data[0] ?? null;

    // 4. ساخت اطلاعات پروفایل
    const profile: IUserProfile = {
      id: user.id,
      employeeId: employee?.id ?? null,
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      email: user.email,
      role: currentUser.role,
      phone: employee?.phone ?? "",
      bio: employee?.bio ?? "",
      profileImage: user.profileImage ?? null,
      department: employee?.department ?? null,
      position: employee?.position ?? null,
    };

    // 5. ارسال اطلاعات
    return NextResponse.json(profile, {
      status: 200,
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return NextResponse.json(
      { message: "Failed to get profile." },
      { status: 500 },
    );
  }
};
