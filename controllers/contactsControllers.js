import * as contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const { id: owner } = req.user;
        const contacts = await contactsServices.listContacts({ owner });
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: owner } = req.user;
        const contact = await contactsServices.getContact({ id, owner });
        if (!contact) {
            throw HttpError(404);
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: owner } = req.user;
        const contact = await contactsServices.removeContact({ id, owner });
        if (!contact) {
            throw HttpError(404);
        }
        res.status(200).json(contact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { id: owner } = req.user;
        const contact = await contactsServices.addContact({
            ...req.body,
            owner,
        });
        res.status(201).json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw HttpError(400, "Body must have at least one field");
        }
        const { id } = req.params;
        const { id: owner } = req.user;
        const contact = await contactsServices.updateContact(
            { id, owner },
            req.body
        );
        if (!contact) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

export const updateStatusContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: owner } = req.user;
        const contact = await contactsService.updateStatusContact(
            { id, owner },
            req.body
        );
        if (!contact) {
            throw HttpError(404, `Contact with id=${id} not found`);
        }
        res.json(contact);
    } catch (error) {
        next(error);
    }
};
