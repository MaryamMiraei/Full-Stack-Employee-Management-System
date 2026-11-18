

export interface IUserProfile {
  id: string;
  employeeId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone: string;
  bio: string;
  profileImage: string | null;
  department: string | null;
  position: string | null;
}

export interface IUpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
}
