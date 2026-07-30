import api from "../api/axios";

export async function registerFace(images) {
  const formData = new FormData();

  images.forEach((image) => {
    formData.append("files", image);
  });

  const response = await api.post(
    "/face/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}