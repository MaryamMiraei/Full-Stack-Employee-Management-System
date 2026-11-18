import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { serverApi } from "@/lib/api/serverApi";
import type { ICreateEmployeeRequest } from "@/features/employees/types/employee.type";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/token";

interface IUser {
  id: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
}

interface IEmployee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  employmentStatus: "ACTIVE" | "INACTIVE";
  basicSalary: number;
  allowances: number;
  deductions: number;
  bio: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export const POST = async (request: Request) => {
  let createdUser: IUser | null = null;

  try {
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

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body: ICreateEmployeeRequest = await request.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      department,
      position,
      joinDate,
      employmentStatus,
      basicSalary,
      allowances,
      deductions,
      bio,
    } = body;

    // Validate required fields
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 6 ||
      typeof firstName !== "string" ||
      !firstName.trim() ||
      typeof lastName !== "string" ||
      !lastName.trim() ||
      typeof phone !== "string" ||
      typeof department !== "string" ||
      typeof position !== "string" ||
      typeof joinDate !== "string" ||
      (employmentStatus !== "ACTIVE" && employmentStatus !== "INACTIVE") ||
      ![basicSalary, allowances, deductions].every(
        (value) =>
          typeof value === "number" && Number.isFinite(value) && value >= 0,
      )
    ) {
      return NextResponse.json(
        { message: "Invalid employee data" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const usersResponse = await serverApi.get<IUser[]>("/users");

    const existingUser = usersResponse.data.find(
      (user) => user.email.toLowerCase() === normalizedEmail,
    );

    if (existingUser) {
      return NextResponse.json(
        { message: "This email is already registered" },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User
    const userResponse = await serverApi.post<IUser>("/users", {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash,
      role: "employee",
    });

    createdUser = userResponse.data;

    // Create Employee
    const now = new Date().toISOString();

    const employeeResponse = await serverApi.post<IEmployee>("/employees", {
      id: crypto.randomUUID(),
      userId: createdUser.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      phone,
      department,
      position,
      joinDate,
      employmentStatus,
      basicSalary,
      allowances,
      deductions,
      bio: bio ?? "",
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    });

    return NextResponse.json(
      {
        message: "Employee created successfully",
        employee: employeeResponse.data,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create employee error:", error);

    // Roll back User if Employee creation failed
    if (createdUser) {
      try {
        await serverApi.delete(`/users/${createdUser.id}`);
      } catch (rollbackError) {
        console.error("User rollback failed:", rollbackError);
      }
    }

    return NextResponse.json(
      { message: "Unable to create employee" },
      { status: 500 },
    );
  }
};

export const GET = async (request: Request) => {
  try {
    // 1. Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const session = await verifyToken(token);

    if (!session) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 2. Get department query parameter
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");

    // 3. Get employees from JSON Server
    const response = await serverApi.get<IEmployee[]>("/employees");

    // 4. Filter employees
    const employees = response.data.filter((employee) => {
      const isActive = !employee.isDeleted;

      const matchesDepartment =
        !department || employee.department === department;

      return isActive && matchesDepartment;
    });

    return NextResponse.json(employees, { status: 200 });
  } catch (error) {
    console.error("GET employees error:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
};
