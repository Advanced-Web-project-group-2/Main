import request from "supertest";
import app from "../src/app.js";

export const api = request(app);

export async function registerAndLogin(
  username = "john",
  email = "john@test.com",
  password = "Password1"
) {
  const res = await api.post("/auth/register").send({
    username,
    email,
    password,
  });

  if (res.status !== 201) {
    throw new Error(
      "Registration failed: " + JSON.stringify(res.body, null, 2)
    );
  }

  return {
    token: res.body.token,
    user: res.body.user,
  };
}
