import { FETCH_GET } from "@/utils/api";
import apiError from "@/utils/api-error";

export default async function transaction(url: string) {
  try {
    const response = await FETCH_GET(url, ["user"]);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // atrasar o resultado
    await new Promise(resolve => setTimeout(resolve, 2000));

    return data.data;
  } catch (error: unknown) {
    return apiError(error);
  }
};