import { useQuery } from "@tanstack/react-query";
import { getLeaves } from "../api/getLeaves";

export const useGetLeaves = () => {
  return useQuery({
    queryKey: ["leaves"],
    queryFn: getLeaves,
  });
};
