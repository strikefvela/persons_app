import { useState } from "react";
import Filter from "./Components/Filter";
import Persons from "./Components/Persons";
import PersonsForm from "./Components/PersonForm";
import { useEffect } from "react";
import personsService from "./Services/PersonsService";
import Notification from "./Components/Notifications";

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    personsService.getAllPersons().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhoneNumber] = useState("");
  const [filterText, setFilterText] = useState("");
  const [successMessage, setSucccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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

  const filteredPersons = filterText
    ? persons.filter(
        (person) =>
          person.name?.toLowerCase().includes(filterText.toLowerCase()) ||
          String(person.number).includes(filterText)
      )
    : persons;

  const updatePhone = ({ ...person }) => {
    const confirm =
      window.confirm(`${person.name} is already added to the phonebook, replace the old
    number with a new one?`);
    if (confirm) {
      personsService
        .updatePerson(person.id, person)
        .then((returnedPerson) => {
          setPersons(
            // persons.map((x) => (person.id !== x.id ? x : returnedPerson))
            persons.concat(returnedPerson),
            setNewName(""),
            setNewPhoneNumber("")
          );
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
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
    };
    const person = persons?.find((p) => p.name === newName);
    if (!person) {
      personsService
        .createPerson(personObject)
        .then((x) => {
          setSucccessMessage(`Added ${x.name}`);
          setTimeout(() => {
            setSucccessMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.error);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    } else {
      updatePhone({
        name: personObject.name,
        number: personObject.number,
        id: person.id,
      });
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
