import supertest from "supertest";
import { web } from "../src/app/web.js";
import { logger } from "../src/app/logging.js";
import {
  createManyTestContact,
  createTestContact,
  createTestUser,
  getTestContact,
  removeAllContacts,
  removeTestUser,
} from "./test-util.js";

describe("POST /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllContacts();
    await removeTestUser();
  });

  it("Should create a contact", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "testToken")
      .send({
        firstName: "Khadhi",
        lastName: "Musaid",
        email: "kmusaidsyah@gmail.com",
        phone: "081213633684",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firstName).toBe("Khadhi");
    expect(result.body.data.lastName).toBe("Musaid");
    expect(result.body.data.email).toBe("kmusaidsyah@gmail.com");
    expect(result.body.data.phone).toBe("081213633684");
  });

  it("Should reject to create a Contact if request is invalid", async () => {
    const result = await supertest(web)
      .post("/api/contacts")
      .set("Authorization", "testToken")
      .send({
        firstName: "",
        lastName: "Musaid",
        email: "kopet",
        phone: "081213633684",
      });

    logger.info(result.body);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllContacts();
    await removeTestUser();
  });

  it("Should GET a Contact", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken");

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBe(testContact.id);
    expect(result.body.data.firstName).toBe(testContact.firstName);
    expect(result.body.data.lastName).toBe(testContact.lastName);
    expect(result.body.data.email).toBe(testContact.email);
    expect(result.body.data.phone).toBe(testContact.phone);
  });

  it("Should return 404 if contactId is not found", async () => {
    const testContact = await getTestContact();

    const result = await supertest(web)
      .get("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "testToken");

    expect(result.status).toBe(404);
  });
});

describe("PATCH /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllContacts();
    await removeTestUser();
  });

  it("Should UPDATE a Contact", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken")
      .send({
        firstName: "Khadhi",
        lastName: "Musaid",
        email: "kmusaidsyah@gmail.com",
        phone: "082110769987",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firstName).toBe("Khadhi");
    expect(result.body.data.lastName).toBe("Musaid");
    expect(result.body.data.email).toBe("kmusaidsyah@gmail.com");
    expect(result.body.data.phone).toBe("082110769987");
  });

  it("Should UPDATE a Contact's firstName", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken")
      .send({
        firstName: "Khadhi",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.firstName).toBe("Khadhi");
  });

  it("Should UPDATE a Contact's lastName", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken")
      .send({
        lastName: "Musaid",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.lastName).toBe("Musaid");
  });

  it("Should UPDATE a Contact's Email and Phone", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken")
      .send({
        email: "kmusaidsyah@gmail.com",
        phone: "082110769987",
      });

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.email).toBe("kmusaidsyah@gmail.com");
    expect(result.body.data.phone).toBe("082110769987");
  });

  it("Should not UPDATE if request invalid", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + testContact.id)
      .set("Authorization", "salahToken")
      .send({
        firstName: "Kopet",
        lastName: "Said",
      });

    logger.info(result.body);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });

  it("Should not UPDATE if Contact is not found", async () => {
    const testContact = await getTestContact();
    const result = await supertest(web)
      .patch("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "testToken")
      .send({
        firstName: "Kopet",
        lastName: "Said",
      });

    logger.info(result.body);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/contacts/:contactId", () => {
  beforeEach(async () => {
    await createTestUser();
    await createTestContact();
  });

  afterEach(async () => {
    await removeAllContacts();
    await removeTestUser();
  });

  it("Should DELETE a Contact", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + testContact.id)
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data).toBe("Success");

    testContact = await getTestContact();
    expect(testContact).toBeNull();
  });

  it("Should reject DELETE if Contact isn't found", async () => {
    let testContact = await getTestContact();
    const result = await supertest(web)
      .delete("/api/contacts/" + (testContact.id + 1))
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(404);
  });
});

describe("GET /api/contacts", () => {
  beforeEach(async () => {
    await createTestUser();
    await createManyTestContact();
  });

  afterEach(async () => {
    await removeAllContacts();
    await removeTestUser();
  });

  it("Should do a Search without Parameter", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(10);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalItems).toBe(15);
  });

  it("Should do a Search to Page2", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        page: 2,
      })
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(5);
    expect(result.body.paging.page).toBe(2);
    expect(result.body.paging.totalPage).toBe(2);
    expect(result.body.paging.totalItems).toBe(15);
  });

  it("Should do a Search using Name", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        name: "test1",
      })
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(7);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(1);
    expect(result.body.paging.totalItems).toBe(7);
  });

  it("Should do a Search using Email", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        email: "test2@gmail.com",
      })
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(1);
    expect(result.body.paging.totalItems).toBe(1);
  });

  it("Should do a Search using Phone", async () => {
    const result = await supertest(web)
      .get("/api/contacts/")
      .query({
        phone: "081213633681",
      })
      .set("Authorization", "testToken");

    logger.info(result.body);

    expect(result.status).toBe(200);
    expect(result.body.data.length).toBe(7);
    expect(result.body.paging.page).toBe(1);
    expect(result.body.paging.totalPage).toBe(1);
    expect(result.body.paging.totalItems).toBe(7);
  });
});
