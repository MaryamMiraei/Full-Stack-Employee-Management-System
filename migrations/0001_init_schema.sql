-- Migration number: 0001 	 2026-11-28T10:39:14.579Z

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
  profile_image TEXT,
  avatar_file_name TEXT
);

-- 2. Employees
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  phone TEXT,
  department TEXT,
  position TEXT,
  join_date TEXT,
  employment_status TEXT NOT NULL
    CHECK (employment_status IN ('ACTIVE', 'INACTIVE')),
  basic_salary REAL NOT NULL DEFAULT 0,
  allowances REAL NOT NULL DEFAULT 0,
  deductions REAL NOT NULL DEFAULT 0,
  bio TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  is_deleted INTEGER NOT NULL DEFAULT 0
    CHECK (is_deleted IN (0, 1)),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. Attendances
CREATE TABLE IF NOT EXISTS attendances (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT,
  working_minutes INTEGER,
  day_type TEXT NOT NULL
    CHECK (day_type IN ('WORKDAY', 'WEEKEND', 'HOLIDAY')),
  status TEXT NOT NULL
    CHECK (status IN ('IN_PROGRESS', 'COMPLETED')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE (user_id, date)
);

-- 4. Leaves
CREATE TABLE IF NOT EXISTS leaves (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('ANNUAL', 'SICK', 'UNPAID', 'CASUAL')),
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_comment TEXT,
  reviewed_by TEXT,
  reviewed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- 5. Payslips
CREATE TABLE IF NOT EXISTS payslips (
  id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  basic_salary REAL NOT NULL,
  allowances REAL NOT NULL,
  deductions REAL NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL CHECK (year BETWEEN 2000 AND 2100),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_employees_is_deleted
  ON employees(is_deleted);

CREATE INDEX IF NOT EXISTS idx_attendances_date
  ON attendances(date);

CREATE INDEX IF NOT EXISTS idx_leaves_employee_status
  ON leaves(employee_id, status);

CREATE INDEX IF NOT EXISTS idx_payslips_employee_period
  ON payslips(employee_id, year, month);

