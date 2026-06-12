const request = require("supertest");
const app = require("../server");

describe("GET /", () => {
  it("should return 200 and serve the index page test", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });
});

describe("Static assets", () => {
  it("should serve static files from /public", async () => {
    const res = await request(app).get("/veritas.jpg");
    expect(res.statusCode).toBe(200);
  });
});
