require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(function (tokens, req, res) {
    if (req.method === 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res),
        'ms',
        tokens.res(req, res, 'content-length'),
        tokens['body'](req),
      ].join(' ')
    }
    if (req.method !== 'POST') {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res),
        'ms',
        tokens.res(req, res, 'content-length'),
      ].join(' ')
    }
  })
)

app.get('/', (request, response) => {
  response.sendStatus('<h1>Person\'s API</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(400).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/api/info', (request, response) => {
  const date_now = new Date()
  Person.countDocuments({}).then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people</p><p>${date_now}</p>`
    )
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatePerson) => {
      response.json(updatePerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.json(person).status(204).end()
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
