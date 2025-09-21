import Contact from "../db/Contact.js";

export const listContacts = (query) => Contact.findAll({ where: query });

export const getContact = (query) => Contact.findOne({ where: query });

export const addContact = (payload) => Contact.create(payload);

export const removeContact = async (query) => {
    const contact = await getContact(query);
    if (!contact) return null;
    await contact.destroy();
    return contact;
};

export const updateContact = async (query, payload) => {
    const contact = await getContact(query);
    if (!contact) return null;
    await contact.update(payload);
    return contact;
};

export const updateStatusContact = async (query, { favorite }) => {
    const contact = await getContact(query);
    if (!contact) return null;
    await contact.update({ favorite });
    return contact;
};
