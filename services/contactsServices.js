import * as fs from "node:fs/promises";
import * as path from "node:path";
import { nanoid } from "nanoid";
import HttpError from "../helpers/HttpError.js";

const contactsPath = path.resolve("db", "contacts.json");
const updateContacts = (allContacts) =>
    fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));

export async function listContacts() {
    try {
        const data = await fs.readFile(contactsPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        throw HttpError(500, "No such file or directory");
    }
}

export async function getContactById(contactId) {
    const allContacts = await listContacts();
    const contact = allContacts.find((item) => item.id === contactId);
    return contact || null;
}

export async function removeContact(contactId) {
    const allContacts = await listContacts();
    const index = allContacts.findIndex((item) => item.id === contactId);
    if (index === -1) return null;
    const [res] = allContacts.splice(index, 1);
    await updateContacts(allContacts);
    return res;
}

export async function addContact(data) {
    const allContacts = await listContacts();
    const newContact = {
        id: nanoid(),
        ...data,
    };
    allContacts.push(newContact);
    await updateContacts(allContacts);
    return newContact;
}

export const updateContactById = async (id, data) => {
    const contacts = await listContacts();
    const index = contacts.findIndex((item) => item.id === id);
    if (index === -1) return null;
    contacts[index] = { ...contacts[index], ...data };
    await updateContacts(contacts);
    return contacts[index];
};
