import { useState } from "react";
import Filter from "./Components/Filter";
import Persons from "./Components/Persons";
import PersonsForm from "./Components/PersonForm";
import { useEffect } from "react";
import personsService from "./Services/PersonsService";
import Notification from "./Components/Notifications";

const App = () => {
  const [persons, setPerson] = useState(null);

  const hook = () => {
    personsService
    .getAllPersons()
    .then((persons) => {
      setPerson(persons);
    });
    if(!persons) {
      return undefined;
    }
  };
  useEffect(hook, []);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhoneNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [successMessage, setSucccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleNameChange = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    event.preventDefault();
    setNewPhoneNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    event.preventDefault();
    setFilterText(event.target.value);
  };

  const filteredPersons = persons?.filter(
    (persons) =>
      persons.name.toLowerCase().includes(filterText.toLowerCase()) ||
      persons.number.toLowerCase().includes(filterText.toLowerCase())
  );

  const updatePhone = ({ ...person }) => {
    const confirm =
      window.confirm(`${person.name} is already added to the phonebook, replace the old
    number with a new one?`);
    if (confirm) {
      personsService
        .updatePerson(person.id, person)
        .then((returnedPerson) => {
          setPerson(
            persons.map((x) => (person.id !== x.id ? x : returnedPerson))
          );
        })
        .catch(() => {
          setErrorMessage(`person ${person.name} has already been deleted from the server.`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newPhone,
      id: Math.floor(Math.random()),
    };
    const person = persons?.find((p) => p.name === newName);
    if (!person) {
      personsService.createPerson(personObject).then((x) => {
        setSucccessMessage(`Added ${x.name}`);
        setTimeout(() => {
          setSucccessMessage(null);
        }, 5000);
      });
    } else {
      updatePhone(person);
    }
    setSucccessMessage("");
    setNewName("");
    setNewPhoneNumber("");
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messaage={successMessage} type="success"></Notification>
      <Notification messaage={errorMessage} type="error"></Notification>
      <Filter
        filter={filterText}
        handleFilterChange={handleFilterChange}
      ></Filter>
      <h3>add a new</h3>
      <PersonsForm
        addPerson={addPerson}
        newName={newName}
        newPhone={newPhone}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
      ></PersonsForm>
      <h3>Numbers</h3>
      <Persons props={filteredPersons}></Persons>
    </div>
  );
};

export default App;
