const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(cors())

morgan.token('req-body', (req) => {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :req-body'));

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    {
      "id": 5,
      "name": "Ivan Lee",
      "number": "32423432"
    }
]
const isUnique = (name) => {
  let nameIdx = persons.findIndex(person => person.name === name) 
  return nameIdx === -1
}

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  let person = persons.find(person => person.id === id);
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  let { name, number } = request.body
  
  if (name === undefined || number === undefined || !isUnique(name)) {
    return response.status(404).json({error: 'name must be unique'})
  }

  let newId = Math.floor(Math.random() * 1000000) 

  let newPerson = {
    name,
    number,
    id: newId
  }

  persons = persons.concat(newPerson)
  response.json(newPerson).status(200)
})

app.delete('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})