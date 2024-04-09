import {validation} from "../validation/validation.js";
import {
    getUserValidation,
    loginUserValidation,
    registerUserValidation,
    updateUserValidation
} from "../validation/user-validation.js";
import {prismaClient} from "../app/database.js";
import {ResponseError} from "../error/response-error.js";
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";

const register = async (request) => {
    const user = validation(registerUserValidation, request);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (countUser === 1) {
        throw new ResponseError(400, "Username already exists");
    }

    user.password = await bcrypt.hash(user.password, 10)

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            email   : true,
            name    : true
        }
    });
}

const login    = async (request) => {
    const loginReq = validation(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginReq.username
        },
        select : {
            username: true,
            password: true
        }
    });

    if (!user) {
        throw new ResponseError(401, "Username or Password is wrong");
    }

    const isPasswordValid = await bcrypt.compare(loginReq.password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(401, "Username or Password is wrong");
    }

    const token = uuid().toString()
    return  prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
}

const getUser = async (username) => {
    const getUserReq = validation(getUserValidation, username);

    const user = await prismaClient.user.findFirst({
        where: {
            username: getUserReq
        },
        select: {
            username: true,
            email   : true,
            name    : true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User is not found");
    }

    return user;
}

const update = async (request) => {
    const user = validation(updateUserValidation, request);

    const findUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (findUser !== 1) {
        throw new ResponseError(404, "User is not found");
    }

    const data = {};
    if (user.email) {
        data.email = user.email;
    }

    if (user.name) {
        data.name = user.name;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            email   : true,
            name    : true,
            password: true
        }
    });
}

const logout = async (username) => {
    username = validation(getUserValidation, username);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "User is not found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });
}
export default {
    register,
    login,
    getUser,
    update,
    logout
}