import Contact from "../db/contacts.js";

export const listContacts = () => Contact.findAll();

export const getContactById = (contactId) => Contact.findByPk(contactId);

export const addContact = (payload) => Contact.create(payload);

export const removeContact = async (contactId) => {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    await contact.destroy();
    return contact;
};

export const updateContactById = async (contactId, payload) => {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    await contact.update(payload);
    return contact;
};

export const updateStatusContact = async (contactId, { favorite }) => {
    const contact = await getContactById(contactId);
    if (!contact) return null;
    await contact.update({ favorite });
    return contact;
};
