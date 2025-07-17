import axios from "axios";
import FormData from "form-data";
import CONFIG from "../config";

export async function uploadAvatar(base64String: string): Promise<string> {
  const matches = base64String.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  const form = new FormData();
  form.append("avatar", buffer, {
    filename: `avatar.${mimeType.split('/')[1]}`,
    contentType: mimeType,
  });

  const response = await axios.post(`${CONFIG.SERVIS_DATA}/upload_avatar`, form, {
    headers: form.getHeaders(),
  });

  return response.data.url;
}
