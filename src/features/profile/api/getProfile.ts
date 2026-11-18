import axios from "axios";

import type {
  IUserProfile,

} from "../types/profile.type";
import { clientApi } from "@/lib/api/clientApi";

export const getProfile = async () => {
  const response = await clientApi.get<IUserProfile>("/api/profile");

  return response.data;
};

