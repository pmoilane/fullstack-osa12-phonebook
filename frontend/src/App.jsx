import { useState, useEffect } from 'react';
import Notification from './components/Notification';
import personService from './services/persons';

const Filter = ({ filterValue, onChange }) => {
  return (
    <div>
      Filter shown with: <input value={filterValue} onChange={onChange} />
    </div>
  );
};

const Persons = ({ persons, filterValue, deleteName }) => {
  return persons
    .filter((person) =>
      person.name.toLowerCase().includes(filterValue.toLowerCase()),
    )
    .map((person) => (
      <div key={person.id}>
        {person.name} {person.number}{' '}
        <button
          onClick={() => {
            if (window.confirm(`Delete ${person.name}?`)) {
              deleteName(person.id);
            }
          }}>
          delete
        </button>
      </div>
    ));
};

const PersonForm = ({
  onSubmit,
  newName,
  handleNameField,
  newNumber,
  handleNumberField,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        Name: <input value={newName} onChange={handleNameField} />
      </div>
      <div>
        Number: <input value={newNumber} onChange={handleNumberField} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isError, setIsError] = useState(Boolean(false));

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const handleNameField = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberField = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterField = (event) => {
    setFilterValue(event.target.value);
  };

  const sendNotification = (message, errorStatus) => {
    console.log(message);
    setIsError(errorStatus);
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000);
  };

  const addName = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    personService.create(personObject).then((person) => {
      setPersons(persons.concat(person));
      setNewName('');
      setNewNumber('');
      sendNotification(`Added ${person.name}`, false);
    });
  };

  const deleteName = (id) => {
    personService.remove(id).then((person) => {
      setPersons(persons.filter((n) => n.id !== id));
      sendNotification(`Deleted ${person.name}`, false);
    });
  };

  const updateName = (personObject) => {
    const changedPerson = { ...personObject, number: newNumber };
    personService
      .update(personObject.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id !== personObject.id ? person : returnedPerson,
          ),
        );
        setNewName('');
        setNewNumber('');
        sendNotification(`Updated ${returnedPerson.name}`, false);
      })
      .catch((error) => {
        sendNotification(
          `Information of ${personObject.name} has already been removed from the server`,
          true,
        );
        setPersons(persons.filter((n) => n.id !== personObject.id));
        setNewName('');
        setNewNumber('');
      });
  };

  const checkForName = (event) => {
    event.preventDefault();
    console.log('we are checking');
    const checkForPerson = persons.find((n) => n.name === newName);
    console.log(persons);
    if (checkForPerson) {
      if (
        window.confirm(`${newName} is already added to phonebook, 
        replace the old number with a new one?`)
      ) {
        updateName(checkForPerson);
      } else {
        setNewName('');
        setNewNumber('');
      }
    } else {
      addName(event);
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} isError={isError} />
      <Filter filterValue={filterValue} onChange={handleFilterField} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={checkForName}
        newName={newName}
        handleNameField={handleNameField}
        newNumber={newNumber}
        handleNumberField={handleNumberField}
      />
      <h2>Numbers</h2>
      <Persons
        persons={persons}
        filterValue={filterValue}
        deleteName={deleteName}
      />
    </div>
  );
};

export default App;
