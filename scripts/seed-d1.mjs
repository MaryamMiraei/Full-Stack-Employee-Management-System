import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const dbPath = path.join(rootDir, "db.json");

if (!fs.existsSync(dbPath)) {
  throw new Error("db.json was not found in project root.");
}

const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));

const requiredCollections = [
  "users",
  "employees",
  "attendances",
  "leaves",
  "payslips",
];

for (const collection of requiredCollections) {
  if (!Array.isArray(data[collection])) {
    throw new Error(`Invalid or missing collection: ${collection}`);
  }
}

const employeeByUserId = new Map(
  data.employees.map((employee) => [employee.userId, employee]),
);

const escapeSql = (value) => {
  if (value === null || value === undefined) return "NULL";

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(`Invalid number: ${value}`);
    }

    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return `'${String(value).replaceAll("'", "''")}'`;
};

const insert = (table, values) => {
  const columns = Object.keys(values);
  const sqlColumns = columns.map((column) => `"${column}"`).join(", ");
  const sqlValues = columns
    .map((column) => escapeSql(values[column]))
    .join(", ");

  return `INSERT INTO "${table}" (${sqlColumns}) VALUES (${sqlValues});`;
};

const statements = [];

for (const user of data.users) {
  statements.push(
    insert("users", {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
      role: user.role,
      profile_image: user.profileImage ?? null,
      avatar_file_name: user.avatarFileName ?? null,
    }),
  );
}

for (const employee of data.employees) {
  statements.push(
    insert("employees", {
      id: employee.id,
      user_id: employee.userId,
      first_name: employee.firstName,
      last_name: employee.lastName,
      email: employee.email,
      phone: employee.phone ?? null,
      department: employee.department ?? null,
      position: employee.position ?? null,
      join_date: employee.joinDate ?? null,
      employment_status: employee.employmentStatus,
      basic_salary: employee.basicSalary,
      allowances: employee.allowances,
      deductions: employee.deductions,
      bio: employee.bio ?? "",
      created_at: employee.createdAt,
      updated_at: employee.updatedAt,
      is_deleted: employee.isDeleted,
    }),
  );
}

for (const attendance of data.attendances) {
  const employee = employeeByUserId.get(attendance.userId);

  if (!employee) {
    throw new Error(`Attendance ${attendance.id} has no matching employee.`);
  }

  statements.push(
    insert("attendances", {
      id: attendance.id,
      employee_id: employee.id,
      user_id: attendance.userId,
      date: attendance.date,
      check_in: attendance.checkIn,
      check_out: attendance.checkOut ?? null,
      working_minutes: attendance.workingMinutes ?? null,
      day_type: attendance.dayType,
      status: attendance.status,
      created_at: attendance.createdAt,
      updated_at: attendance.updatedAt,
    }),
  );
}

for (const leave of data.leaves) {
  const employee =
    employeeByUserId.get(leave.employeeId) ??
    data.employees.find((item) => item.id === leave.employeeId);

  if (!employee) {
    throw new Error(`Leave ${leave.id} has no matching employee.`);
  }

  statements.push(
    insert("leaves", {
      id: leave.id,
      employee_id: employee.id,
      type: leave.type,
      start_date: leave.startDate,
      end_date: leave.endDate,
      reason: leave.reason,
      status: leave.status,
      admin_comment: leave.adminComment ?? null,
      reviewed_by: leave.reviewedBy ?? null,
      reviewed_at: leave.reviewedAt ?? null,
      created_at: leave.createdAt,
      updated_at: leave.updatedAt,
    }),
  );
}

for (const payslip of data.payslips) {
  statements.push(
    insert("payslips", {
      id: payslip.id,
      employee_id: payslip.employeeId,
      basic_salary: payslip.basicSalary,
      allowances: payslip.allowances,
      deductions: payslip.deductions,
      month: payslip.month,
      year: payslip.year,
      created_at: payslip.createdAt,
      updated_at: payslip.updatedAt,
    }),
  );
}

const sql = statements.join("\n");

const sqlPath = path.join(rootDir, "seed-data.sql");

fs.writeFileSync(sqlPath, sql, "utf8");

console.log("Seed SQL generated successfully.");
console.log(`Total INSERT statements: ${statements.length}`);
console.log(`SQL file: ${sqlPath}`);

try {
  execFileSync(
    "npx",
    ["wrangler", "d1", "execute", "quick-esm-db", "--local", "--file", sqlPath],
    {
      cwd: rootDir,
      stdio: "inherit",
      shell: process.platform === "win32",
    },
  );

  console.log("Local D1 seed completed successfully.");
} catch (error) {
  console.error("Local D1 seed failed.");
  throw error;
}
