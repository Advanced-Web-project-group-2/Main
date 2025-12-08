import { api, registerAndLogin } from "./testUtils.js";

describe("Review API tests", () => {

  test("Get reviews for movie (empty list)", async () => {
    const res = await api.get("/api/reviews/movie/10000");
    expect(res.status).toBe(200);
    expect(res.body.reviews).toStrictEqual([]);
    expect(res.body.avgRating).toBe(0);
  });

  test("Add review + fetch list", async () => {
    const { token } = await registerAndLogin(
      "reviewer",
      "rev@example.com",
      "Password1"
    );

    // Add review
    const add = await api
      .post("/api/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({
        movie_id: 5,
        movie_name: "Example Movie",
        content: "Pretty good!",
        rating: 4, // FIXED — schema requires 1–5
      });

    expect(add.status).toBe(201);
    expect(add.body).toHaveProperty("id");

    // Fetch reviews — FIXED ROUTE PREFIX
    const res = await api.get("/api/reviews/movie/5");

    expect(res.status).toBe(200);
    expect(res.body.reviews.length).toBe(1);
    expect(res.body.reviews[0].content).toBe("Pretty good!");
  });

});
