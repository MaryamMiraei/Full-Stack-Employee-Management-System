interface ILoginFormData {
  email: string;
  password: string;
}

interface ILoginRequest {
  email: string;
  password: string;
  role_type: "admin" | "employee";
}

interface ILoginResponse {
  message: string;
  user: {
    id: string;
    role: "admin" | "employee";
  };
}

export type UserRole = "admin" | "employee";

export interface ISessionResponse {
  user: {
    id: string;
    role: UserRole;
  };
}