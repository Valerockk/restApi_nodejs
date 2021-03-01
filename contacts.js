const fs = require("fs/promises");
const path = require("path");
const shortid = require("shortid");
const contactsPath = path.join(__dirname, "/db/contacts.json");

async function parsedContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return console.error(err.message);
  }
}

async function listContacts() {
  try {
    const contacts = await parsedContacts();
    console.log("List of all contacts:");
    console.table(contacts);
  } catch (err) {
    return console.error(err.message);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await parsedContacts();
    const contact = contacts.find(({ id }) => contactId === id);

    if (!contact) return console.error(`Contact with ${contactId} not found`);

    console.log(`Contact with ID ${contactId}:`);
    console.table(contact);
    return contact;
  } catch (err) {
    return console.error(err.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await parsedContacts();

    if (contacts.find(contact => contact.email === email) || contacts.find(contact => contact.phone === phone)){
        return console.error('Contacts with this email or phone already exists!')
    }

    const newContact = { id: shortid.generate(), name, email, phone };
    const newContacts = [...contacts, newContact];

    await fs.writeFile(
      contactsPath,
      JSON.stringify(newContacts, null, 2),
      "utf8"
    );

    console.log("Contact added successfully! New list contacts:");
    console.table(newContacts);

    return newContacts;
  } catch (err) {
    return console.error(err.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await parsedContacts();
    const filterContacts = contacts.filter(({ id }) => id !== contactId);

    if (contacts.length === filterContacts.length) {
      return console.error(`Contact with ${contactId} not found!`);
    }

    await fs.writeFile(
      contactsPath,
      JSON.stringify(filterContacts, null, 2),
      "utf8"
    );

    console.log("Contact removed successfully! New list contacts:");
    console.table(filterContacts);

    return filterContactss;
  } catch (err) {
    return console.error(err.message);
  }
}

module.exports = { listContacts, getContactById, addContact, removeContact };
