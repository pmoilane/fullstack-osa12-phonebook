require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/person');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
//app.use(express.static('dist'))
morgan.token('person', (request) => JSON.stringify(request.body));
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :person',
  ),
);

app.get('/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get('/info', (request, response) => {
  Person.find({}).then((persons) => {
    return response.send(`<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date().toString()}</p>`);
  });
});

app.get('/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.delete('/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(result);
    })
    .catch((error) => next(error));
});

app.post('/persons/', (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'request must have a name and a number',
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put('/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id).then((person) => {
    if (!person) {
      return response.status(404).end;
    }
    person.name = name;
    person.number = number;

    return person
      .save()
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => next(error));
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
