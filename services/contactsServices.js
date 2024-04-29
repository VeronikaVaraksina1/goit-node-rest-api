import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const contactsPath = path.resolve("db", "contacts.json");

async function readContacts() {
  const allContacts = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(allContacts);
}

async function writeContacts(contacts) {
  const newContacts = await fs.writeFile(
    contactsPath,
    JSON.stringify(contacts, null, 2)
  );
  return newContacts;
}

export async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

export async function getContactById(contactId) {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

export async function addContact({ name, email, phone }) {
  const contacts = await readContacts();

  const addedContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(addedContact);
  await writeContacts(contacts);
  return addedContact;
}

export async function amendContact(contactId, { name, email, phone }) {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const updatedContact = contacts[index];

  if (name) {
    updatedContact.name = name;
  }

  if (email) {
    updatedContact.email = email;
  }

  if (phone) {
    updatedContact.phone = phone;
  }
  
  await writeContacts(contacts);
  return updatedContact;
}