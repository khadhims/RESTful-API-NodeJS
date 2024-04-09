import {validation} from "../validation/validation.js";
import {
    createContactValidation,
    getContactValidation, searchContactValidation,
    updateContactValidation
} from "../validation/contact-validation.js";
import {prismaClient} from "../app/database.js";
import {ResponseError} from "../error/response-error.js";

const create = async (user, request) => {
    const contact = validation(createContactValidation, request);
    contact.username = user.username;

    return prismaClient.contact.create({
        data: contact,
        select: {
            id: true,
            firstName: true,
            lastName : true,
            email    : true,
            phone    : true
        }
    });
}

const get = async (user, contactId) => {
    contactId = validation(getContactValidation, contactId);

    const getContact = await prismaClient.contact.findFirst({
        where: {
            username: user.username,
            id      : contactId
        },
        select: {
            id: true,
            firstName: true,
            lastName : true,
            email    : true,
            phone    : true
        }
    });

    if (!getContact) {
        throw new ResponseError(404, "Contact is not found");
    }

    return getContact;
}

const update = async (user, request) => {
    const contact = validation(updateContactValidation, request);

    const findContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id      : contact.id
        }
    });

    if (findContact !== 1) {
        throw new ResponseError(404, "Contact is not found");
    }

    const data = {};
    if (contact.firstName) {
        data.firstName = contact.firstName;
    }

    if (contact.lastName) {
        data.lastName = contact.lastName;
    }

    if (contact.email) {
        data.email = contact.email;
    }

    if (contact.phone) {
        data.phone = contact.phone;
    }

    return prismaClient.contact.update({
        where: {
            id: contact.id
        },
        data: data,
        select: {
            id: true,
            firstName: true,
            lastName : true,
            email    : true,
            phone    : true
        }
    });
}

const remove = async (user, contactId) => {
    contactId = validation(getContactValidation, contactId);

    const findContact = await prismaClient.contact.count({
        where: {
            username: user.username,
            id      : contactId
        }
    });

    if (findContact !== 1) {
        throw new ResponseError(404, "Contact is not found");
    }

    return prismaClient.contact.delete({
        where: {
            id: contactId
        }
    });
}

const search = async (user, request) => {
    request = validation(searchContactValidation, request);

    //page 1 : ((page - 1) * size) = 0, size = 10
    //page 2 : ((page - 1) * size) = 10, size = 10
    const skip    = (request.page - 1) * request.size;
    const filters = [];

    filters.push({
        username: user.username
    });

    if (request.name) {
        filters.push({
            OR: [
                {
                    firstName: {contains: request.name}
                },
                {
                    lastName : {contains: request.name}
                }
            ]

        });
    }

    if (request.email) {
        filters.push({
            email: {contains: request.email}
        });
    }

    if (request.phone) {
        filters.push({
            phone: {contains: request.phone}
        });
    }

    const contact = await prismaClient.contact.findMany({
        where: {
            AND: filters
        },
        take: request.size,
        skip: skip
    });

    const totalItems = await prismaClient.contact.count({
       where: {
           AND: filters
       }
    });

    return {
        data: contact,
        paging: {
            page: request.page,
            totalItems: totalItems,
            totalPage : Math.ceil(totalItems / request.size)
        }
    }
}
export default {
    create,
    get,
    update,
    remove,
    search
}