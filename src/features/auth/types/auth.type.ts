interface ILoginFormData {
  email: string;
  password: string;
}

interface ISigninData {
  email: string;
  password: string;
  role_type: "admin" | "employee";
}
