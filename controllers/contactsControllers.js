import { createContactSchema } from "../schemas/contactsSchemas.js";
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
} from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContactById(id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedContact = await removeContact(id);

    if (!removedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(removedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const newContact = await addContact(req.body);
    return res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

/*
PUT /api/contacts/:id
Отримує body в json-форматі з будь-яким набором оновлених полів (name, email, phone) (всі поля вимагати в боді як 
    обов'язкові не потрібно: якщо якесь із полів не передане, воно має зберегтись у контакта зі значенням, яке було 
    до оновлення)
Якщо запит на оновлення здійснено без передачі в body хоча б одного поля, повертає json формату {"message": "Body 
must have at least one field"} зі статусом 400.
Передані в боді поля мають бути провалідовані - для валідації створи у файлі contactsSchemas.js (знаходиться 
    у папці schemas) схему з використанням пакета joi. Якщо передані поля мають не валідне значення, повертає 
    json формату {"message": error.message} (де error.message - змістовне повідомлення з суттю помилки) зі статусом 400
Якщо з body все добре, викликає функцію-сервіс updateContact, яку слід створити в файлі contactsServices.js 
(знаходиться в папці services). Ця функція має приймати id контакта, що підлягає оновленню, та дані з body, 
і оновити контакт у json-файлі contacts.json
За результатом роботи функції повертає оновлений об'єкт контакту зі статусом 200.
Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404
*/
export const updateContact = (req, res) => {};
