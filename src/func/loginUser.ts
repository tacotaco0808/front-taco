import axios from "axios";

export async function loginUser(login_id: string, password: string) {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_IMAGE_API}/login`,
      {
        username: login_id,
        password: password,
      },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}
