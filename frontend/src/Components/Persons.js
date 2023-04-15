import personsService from "../Services/PersonsService";

const handleDelete = ({ ...person }) => {
  const confirm = window.confirm(`Delete ${person.name}`);
  if (confirm) personsService.deletePerson(person.id);
};

const Persons = ({ props }) => {
  if (props) {
    return (
      <>
        <form>
          <ul>
            {props.map((p) => (
              <li key={p.id}>
                {p.name} {p.number}
                <button type="submit" onClick={() => handleDelete(p)}>
                  delete
                </button>
              </li>
            ))}
          </ul>
        </form>
      </>
    );
  }
};

export default Persons;
