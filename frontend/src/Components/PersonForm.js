const PersonsForm = ({ addPerson, newName, newPhone, handleNameChange, handlePhoneChange }) => {
  return (
    <>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} /><br></br>
          phone: <input value={newPhone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default PersonsForm;
