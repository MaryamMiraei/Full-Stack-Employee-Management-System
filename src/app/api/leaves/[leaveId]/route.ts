import { NextRequest, NextResponse } from "next/server";

import { serverApi } from "@/lib/api/serverApi";

import type {
  ILeave,
  IUpdateLeaveStatusRequest,
} from "@/features/leaves/types/leave.type";
import { getCurrentUser } from "@/lib/auth/auth";

interface IRouteParams {
  params: Promise<{
    leaveId: string;
  }>;
}

export const PATCH = async (request: NextRequest, { params }: IRouteParams) => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { leaveId } = await params;

    const body: IUpdateLeaveStatusRequest = await request.json();

    if (!["APPROVED", "REJECTED"].includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid leave status" },
        { status: 400 },
      );
    }

    const { data: leaves } = await serverApi.get<ILeave[]>("/leaves");

    const leave = leaves.find((item) => item.id === leaveId);

    if (!leave) {
      return NextResponse.json({ message: "Leave not found" }, { status: 404 });
    }

    if (leave.status !== "PENDING") {
      return NextResponse.json(
        { message: "This leave has already been reviewed" },
        { status: 400 },
      );
    }

    const updatedLeave = {
      ...leave,
      status: body.status,
      adminComment: body.adminComment ?? "",
      reviewedBy: user.userId,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data } = await serverApi.patch<ILeave>(
      `/leaves/${leaveId}`,
      updatedLeave,
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update leave status error:", error);

    return NextResponse.json(
      { message: "Failed to update leave status" },
      { status: 500 },
    );
  }
};
