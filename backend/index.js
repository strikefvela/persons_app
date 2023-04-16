require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

morgan.token("body", function (req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    if (req.method === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.res(req, res, "content-length"),
        tokens["body"](req),
      ].join(" ");
    }
    if (req.method !== "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        "-",
        tokens["response-time"](req, res),
        "ms",
        tokens.res(req, res, "content-length"),
      ].join(" ");
    }
  })
);

app.get("/", (request, response) => {
  response.sendStatus("<h1>Person's API</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const person_response = Person.findById(request.params.id).then((person) => {
    if (person_response) response.json(person);
    else response.status(400).end();
  });
});

app.get("/api/info", (request, response) => {
  const person_count = persons.length;
  const date_now = new Date();
  response.send(
    `<p>Phonebook has info for ${person_count} people</p><p>${date_now}</p>`
  );
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  // if (persons.some((p) => p.name === person.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(person => {
    response.json(person).status(204).end();
  })
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
