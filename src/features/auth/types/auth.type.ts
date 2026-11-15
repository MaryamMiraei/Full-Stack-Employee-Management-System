type UserRole = "admin" | "employee";

interface IUser {
  id: string;
  role: UserRole;
}

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
  user: IUser;
}

interface ISessionResponse {
  user: IUser;
}
