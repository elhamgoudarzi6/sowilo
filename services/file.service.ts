import api from "./api";

export type FileCategory =
  | "documents"
  | "reports"
  | "profiles"
  | "public";

export interface UploadFileResponse {
  category: FileCategory;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export const fileService = {
  async upload(
    file: File,
    category: FileCategory,
  ): Promise<UploadFileResponse> {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
      `/files/upload/${category}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },

  async remove(
    category: FileCategory,
    filename: string,
  ): Promise<void> {
    await api.delete(
      `/files/${category}/${filename}`,
    );
  },
};