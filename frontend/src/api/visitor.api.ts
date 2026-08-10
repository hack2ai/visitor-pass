import api from "./axios";

import type {
  Visitor,
  CreateVisitorDto,
  VisitorStatus,
} from "../types/visitor";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getVisitors = async (): Promise<ApiResponse<Visitor[]>> => {
  const response = await api.get<ApiResponse<Visitor[]>>("/visitors");

  return response.data;
};

export const getVisitorById = async (
  id: string
): Promise<ApiResponse<Visitor>> => {
  const response = await api.get<ApiResponse<Visitor>>(
    `/visitors/${id}`
  );

  return response.data;
};

export const createVisitor = async (
  data: CreateVisitorDto
): Promise<ApiResponse<Visitor>> => {
  const response = await api.post<ApiResponse<Visitor>>(
    "/visitors",
    data
  );

  return response.data;
};

export const updateVisitor = async (
  id: string,
  data: Partial<CreateVisitorDto>
): Promise<ApiResponse<Visitor>> => {
  const response = await api.put<ApiResponse<Visitor>>(
    `/visitors/${id}`,
    data
  );

  return response.data;
};

export const updateVisitorStatus = async (
  id: string,
  status: VisitorStatus
): Promise<ApiResponse<Visitor>> => {
  const response = await api.patch<ApiResponse<Visitor>>(
    `/visitors/${id}/status`,
    { status }
  );

  return response.data;
};

export const deleteVisitor = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(
    `/visitors/${id}`
  );

  return response.data;
};

export const downloadVisitorPass = async (
  id: string
): Promise<Blob> => {
  const response = await api.get(
    `/visitors/${id}/pass`,
    {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
      params: {
        t: Date.now(),
      },
    }
  );

  if (!(response.data instanceof Blob)) {
    throw new Error("Response is not a Blob.");
  }

  if (response.data.size === 0) {
    throw new Error("Downloaded PDF is empty.");
  }

  return response.data;
};