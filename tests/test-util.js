import {prismaClient} from "../src/app/database.js";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "testUser"
        }
    });
}

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "testUser",
            email   : "test@gmail.com",
            name    : "test",
            password: await bcrypt.hash("musimsemi123", 10),
            token   : "testToken"
        }
    });
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "testUser"
        }
    });
}

export const removeAllContacts = async () => {
    await prismaClient.contact.deleteMany({
       where: {
           username: "testUser"
       }
    });
}

export const createManyTestContact = async () => {
    for (let i = 1; i <= 15; i++) {
        await prismaClient.contact.createMany({
            data: {
                username : "testUser",
                firstName: `test${i}`,
                lastName : `test${i}`,
                email    : `test${i}@gmail.com`,
                phone    : `08121363368${i}`
            }
        });
    }
}

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username : "testUser",
            firstName: "test",
            lastName : "test",
            email    : "test@gmail.com",
            phone    : "081213633684"
        }
    });
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "testUser"
        }
    });
}

export const removeTestAddress = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: "testUser"
            }
        }
    });
}
export const createTestAddress = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id : contact.id,
            street     : "testStreet",
            city       : "testCity",
            province   : "testProvince",
            country    : "testCountry",
            postal_code: "9990999"
        }
    });
}

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "testUser"
            }
        }
    });
}

