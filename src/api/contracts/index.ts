import { useQuery } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getContract360 = async (id: number) => {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/api/v1/contracts/${id}/360`, {
    headers
  });

  if (!response.ok) {
    throw new Error("Failed to fetch contract 360 data");
  }

  return response.json();
};

export const useContract360 = (id: number) => {
  return useQuery({
    queryKey: ["contract360", id],
    queryFn: () => getContract360(id),
    enabled: !!id,
    refetchInterval: 30000, 
  });
};
