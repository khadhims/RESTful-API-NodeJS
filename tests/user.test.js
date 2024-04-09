import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("Should be able to register new User", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "testUser",
      email: "test@gmail.com",
      name: "test",
      password: "musimsemi123",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  it("Should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      username: "",
      email: "",
      name: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      username: "testUser",
      email: "test@gmail.com",
      name: "test",
      password: "musimsemi123",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      username: "testUser",
      email: "test@gmail.com",
      name: "test",
      password: "musimsemi123",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should be able to login user", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "testUser",
      password: "musimsemi123",
    });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.token).toBeDefined();
    expect(result.body.data.token).not.toBe("tokenTest");
  });

  it("Should reject to login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "",
      password: "",
    });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("Should reject to login if password is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      username: "testUser",
      password: "salah123",
    });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/users", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should GET a username", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.name).toBe("test");
  });

  it("Should reject if token is invalid", async () => {
    const result = await supertest(web)
      .get("/api/users/current")
      .set("Authorization", "salahToken");

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PATCH /api/users/current", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should update user's data", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testToken")
      .send({
        email: "kodaayy@gmail.com",
        name: "Khadhi Musaid Syah",
        password: "rahasia123",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.email).toBe("kodaayy@gmail.com");
    expect(result.body.data.name).toBe("Khadhi Musaid Syah");
    expect(await bcrypt.compare("rahasia123", result.body.data.password)).toBe(
      true
    );
  });

  it("Should update user's name", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testToken")
      .send({
        name: "Khadhi Musaid Syah",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.name).toBe("Khadhi Musaid Syah");
  });

  it("Should update user's email", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testToken")
      .send({
        email: "jamal12@gmail.com",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(result.body.data.email).toBe("jamal12@gmail.com");
  });

  it("Should update user's password", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "testToken")
      .send({
        password: "nabila123",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.username).toBe("testUser");
    expect(await bcrypt.compare("nabila123", result.body.data.password)).toBe(
      true
    );
  });

  it("Should reject if request is not valid", async () => {
    const result = await supertest(web)
      .patch("/api/users/current")
      .set("Authorization", "salahToken")
      .send({
        name: "kopet",
        password: "nabila123",
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/users/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("Should logout a user", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "testToken");

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("OK");

    const user = await getTestUser();
    expect(user.token).toBeNull();
  });

  it("Should reject logout if token is invalid", async () => {
    const result = await supertest(web)
      .delete("/api/users/logout")
      .set("Authorization", "salahToken");

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});
