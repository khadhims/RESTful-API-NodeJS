import {validation} from "../validation/validation.js";
import {
    createAddressValidation,
    getAddressValidation,
    updateAddressValidation
} from "../validation/address-validation.js";
import {prismaClient} from "../app/database.js";
import {getContactValidation} from "../validation/contact-validation.js";
import {ResponseError} from "../error/response-error.js";
import {logger} from "../app/logging.js";

const isContactExists = async (user, contactId) => {
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

    return contactId;
}

const create = async (user, contactId, request) => {
    contactId = await isContactExists(user, contactId);

    const address = validation(createAddressValidation, request);
    address.contact_id = contactId;
    logger.info(address);

    return prismaClient.address.create({
       data: address,
       select: {
           id: true,
           street     : true,
           city       : true,
           province   : true,
           country    : true,
           postal_code: true
       }
    });

}

const get    = async (user, contactId, addressId) => {
    contactId = await isContactExists(user, contactId);

    addressId = validation(getAddressValidation, addressId);
    const getAddress = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id        : addressId
        },
        select: {
            id: true,
            street     : true,
            city       : true,
            province   : true,
            country    : true,
            postal_code: true
        }
    });

    if (!getAddress) {
        throw new ResponseError(404, "Address is not found")
    }

    return getAddress;
}

const update = async (user, contactId, request) => {
    contactId = await isContactExists(user, contactId);

    const address = validation(updateAddressValidation, request);

    const findAddress = await prismaClient.address.count({
        where: {
            contact_id: contactId,
            id        : address.id
        }
    });

    if (findAddress !== 1) {
        throw new ResponseError(404, "Address is not found");
    }

    const data = {};
    if (address.street) {
        data.street = address.street;
    }

    if (address.city) {
        data.city = address.city;
    }

    if (address.province) {
        data.province = address.province;
    }

    if (address.country) {
        data.country = address.country;
    }

    if (address.postal_code) {
        data.postal_code = address.postal_code;
    }

    return prismaClient.address.update({
        where: {
            id        : address.id
        },
        data: data,
        select: {
            id: true,
            street     : true,
            city       : true,
            province   : true,
            country    : true,
            postal_code: true
        }
    });
}

const remove = async (user, contactId, addressId) => {
    contactId = await isContactExists(user, contactId);

    addressId = validation(getAddressValidation, addressId);
    const getAddress = await prismaClient.address.findFirst({
        where: {
            contact_id: contactId,
            id        : addressId
        },
        select: {
            id: true,
            street     : true,
            city       : true,
            province   : true,
            country    : true,
            postal_code: true
        }
    });

    if (!getAddress) {
        throw new ResponseError(404, "Address is not found")
    }

    return prismaClient.address.delete({
        where: {
            id: addressId
        }
    });
}

const list = async (user, contactId) => {
    contactId = await isContactExists(user, contactId);

    return prismaClient.address.findMany({
        where: {
            contact_id: contactId
        },
        select: {
            id: true,
            street     : true,
            city       : true,
            province   : true,
            country    : true,
            postal_code: true
        }
    });
}
export default {
    create,
    get,
    update,
    remove,
    list
}