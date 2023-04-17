import axios from "axios";
const baseUri = "/api/persons";

const getAllPersons = () => {
  const request = axios.get(baseUri);
  return request
    .then((response) => response.data)
};

const createPerson = (newObject) => {
  const request = axios.post(baseUri, newObject);
  return request
    .then((response) => response.data)
};

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUri}/${id}`, newObject);
  return request
    .then((response) => response.data)
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUri}/${id}`);
  return request
    .then((response) => response.data)
};

const exportedObject = {
  getAllPersons,
  createPerson,
  updatePerson,
  deletePerson,
};

export default exportedObject;
