import {
    createTestAddress,
    createTestContact,
    createTestUser, getTestAddress,
    getTestContact,
    removeAllContacts,
    removeTestAddress,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/app/web.js";
import {logger} from "../src/app/logging.js";

describe("POST /api/contacts/:contactId/addresses", () => {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

   it("Should CREATE an Address for a Contact", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'testToken')
            .send({
                street     : "testStreet",
                city       : "testCity",
                province   : "testProvince",
                country    : "testCountry",
                postal_code: "9990999"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("testStreet");
        expect(result.body.data.city).toBe("testCity");
        expect(result.body.data.province).toBe("testProvince");
        expect(result.body.data.country).toBe("testCountry");
        expect(result.body.data.postal_code).toBe("9990999");
   });

    it("Should Reject to CREATE an Address for a Contact if request invalid", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'testToken')
            .send({
                street     : "testStreet",
                city       : "testCity",
                province   : "testProvince",
                country    : "",
                postal_code: "9990999"
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
    });

    it("Should Reject to CREATE an Address for a Contact if Contact isn't found", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .post('/api/contacts/' + (testContact.id + 1) + '/addresses')
            .set('Authorization', 'testToken')
            .send({
                street     : "testStreet",
                city       : "testCity",
                province   : "testProvince",
                country    : "testCountry",
                postal_code: "9990999"
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
    });
});

describe("GET /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should GET a Contact's Address", async () => {
       const testContact = await getTestContact();
       const testAddress = await getTestAddress();

       const result = await supertest(web)
           .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
           .set('Authorization', 'testToken')

       logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe(testAddress.street);
        expect(result.body.data.city).toBe(testAddress.city);
        expect(result.body.data.province).toBe(testAddress.province);
        expect(result.body.data.country).toBe(testAddress.country);
        expect(result.body.data.postal_code).toBe(testAddress.postal_code);
    });

    it("Should Reject GET a Contact's Address if address isn't found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'testToken');

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("Should Reject GET a Contact's Address if contact isn't found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id )
            .set('Authorization', 'testToken');

        logger.info(result.body);

        expect(result.status).toBe(404);
    });
});

describe("PATCH /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should UPDATE a Contact's Address", async () => {
       const testContact = await getTestContact();
       const testAddress = await getTestAddress();

       const result = await supertest(web)
           .patch('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
           .set('Authorization', 'testToken')
           .send({
              street     : "Jl. Sunu Raya",
              city       : "Makassar",
              province   : "Sulsel",
              country    : "Indonesia",
              postal_code: "1521009"
           });

       logger.info(result.body);

       expect(result.status).toBe(200);
       expect(result.body.data.id).toBeDefined();
       expect(result.body.data.street).toBe("Jl. Sunu Raya");
       expect(result.body.data.city).toBe("Makassar");
       expect(result.body.data.province).toBe("Sulsel");
       expect(result.body.data.country).toBe("Indonesia");
       expect(result.body.data.postal_code).toBe("1521009");
    });

    it("Should UPDATE only partial of a Contact's Address (1)", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .patch('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'testToken')
            .send({
                street     : "Jl. Sunu Raya",
                city       : "Makassar",
                postal_code: "1521009"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("Jl. Sunu Raya");
        expect(result.body.data.city).toBe("Makassar");
        expect(result.body.data.province).toBe("testProvince");
        expect(result.body.data.country).toBe("testCountry");
        expect(result.body.data.postal_code).toBe("1521009");
    });

    it("Should UPDATE only partial of a Contact's Address (2)", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .patch('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'testToken')
            .send({
                city       : "Palu"
            });

        logger.info(result.body);

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe("testStreet");
        expect(result.body.data.city).toBe("Palu");
        expect(result.body.data.province).toBe("testProvince");
        expect(result.body.data.country).toBe("testCountry");
        expect(result.body.data.postal_code).toBe("9990999");
    });

    it("Should not UPDATE a Contact's Address if Contact is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .patch('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'testToken')
            .send({
                city       : "Palu"
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("Should not UPDATE a Contact's Address if Address is not found", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .patch('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'testToken')
            .send({
                city       : "Palu"
            });

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("Should not UPDATE a Contact's Address if request invalid", async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .patch('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id )
            .set('Authorization', 'testToken')
            .send({
                city    : "Makassar",
                country : ""
            });

        logger.info(result.body);

        expect(result.status).toBe(400);
    });
});

describe("DELETE /api/contacts/:contactId/addresses/:addressId", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should DELETE a Contact's Address", async () => {
       const testContact = await getTestContact();
       let   testAddress = await getTestAddress();

       const result = await supertest(web)
           .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
           .set('Authorization', 'testToken');

       logger.info(result.body);

       expect(result.status).toBe(200);
       expect(result.body.data).toBe("Success");

       testAddress = await getTestAddress();
       expect(testAddress).toBeNull();
    });

    it("Should DELETE a Contact's Address if Address is not found", async () => {
        const testContact = await getTestContact();
        let   testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + (testAddress.id + 1))
            .set('Authorization', 'testToken');

        logger.info(result.body);

        expect(result.status).toBe(404);
    });

    it("Should DELETE a Contact's Address if Contact is not found", async () => {
        const testContact = await getTestContact();
        let testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + (testContact.id + 1) + '/addresses/' + testAddress.id)
            .set('Authorization', 'testToken');

        logger.info(result.body);

        expect(result.status).toBe(404);
    });
});

describe("GET /api/contacts/:contactId/addresses", () => {
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddress();
    });

    afterEach(async () => {
        await removeTestAddress();
        await removeAllContacts();
        await removeTestUser();
    });

    it("Should show a Contact's Addresses LIST", async () => {
       const testContact = await getTestContact();

       const result = await supertest(web)
           .get('/api/contacts/' + testContact.id +'/addresses')
           .set('Authorization', 'testToken')

       logger.info(result.body);

       expect(result.status).toBe(200);
       expect(result.body.data.length).toBe(1);
    });

    it("Should NOT show a Contact's Addresses LIST if Contact isn't found", async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + (testContact.id + 1) +'/addresses')
            .set('Authorization', 'testToken')

        logger.info(result.body);

        expect(result.status).toBe(404);
    });
});
