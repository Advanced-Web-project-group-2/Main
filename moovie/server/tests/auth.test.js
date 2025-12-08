import { api, registerAndLogin } from "./testUtils.js";

describe("Auth API Tests", () => {

  test("Sign Up → success", async () => {
    const res = await api.post("/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Password1",
    });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body).toHaveProperty("token");
  });

  test("Sign In → success", async () => {
    await api.post("/auth/register").send({
      username: "user2",
      email: "user2@example.com",
      password: "Password1",
    });

    const res = await api.post("/auth/login").send({
      email: "user2@example.com",
      password: "Password1",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Delete User → requires correct password", async () => {
    const { token, user } = await registerAndLogin(
      "deluser",
      "del@example.com",
      "Password1"
    );

    const res = await api
      .delete("/auth/delete")
      .set("Authorization", `Bearer ${token}`)
      .send({ password: "Password1" });

    expect(res.status).toBe(200);
    expect(res.body.deleted.id).toBe(user.id);
  });

  test("Logout (backend-side) → protected route returns 401", async () => {
    const { token } = await registerAndLogin(
      "logoutuser",
      "out@example.com",
      "Password1"
    );

    // No token sent → should return 401
    const res = await api.get("/users/me");
    expect(res.status).toBe(401);
  });

});
