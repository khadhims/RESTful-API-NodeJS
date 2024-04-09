import contactService from "../service/contact-service.js";

const create = async (req, res, next) => {
    try {
        const user   = req.user;
        const result = await contactService.create(user, req.body);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const get = async (req, res, next) => {
    try {
        const contactId = req.params.contactId;
        const user      = req.user;
        const result    = await contactService.get(user, contactId);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const update = async (req, res, next) => {
    try {
        const user      = req.user;
        req.body.id     = req.params.contactId;
        const result    = await contactService.update(user, req.body);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
}

const remove = async (req, res, next) => {
    try {
        const user       = req.user;
        const contactId  = req.params.contactId;
        await contactService.remove(user, contactId)

        res.status(200).json({
            data: "Success"
        });
    } catch (e) {
        next(e);
    }
}

const search = async (req, res, next) => {
    try {
        const user    = req.user;
        const request = {
            name : req.query.name,
            email: req.query.email,
            phone: req.query.phone,
            page : req.query.page,
            size : req.query.size
        }

        const result  = await contactService.search(user, request);
        res.status(200).json({
            data  : result.data,
            paging: result.paging
        });
    } catch (e) {
        next(e);
    }
}

export default {
    create,
    get,
    update,
    remove,
    search
}