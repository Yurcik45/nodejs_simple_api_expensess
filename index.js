const express = require('express')
const cors = require('cors')

const PORT = process.env['PORT'] ?? 5000
const app = express()

app.use(cors())

app.listen(PORT, () => console.log("Server has been started on port ", PORT))

const temp_arr = JSON.stringify([])

app.get('/', (req, res) =>
{
  res.status(200).json("hello")
})

const check_type = req =>
{
  const type = req.query.typ
  if (!type) return false
  return type === "expensess" || type === "benefits"
}

app.get('/items', (req, res) =>
{
  if (!check_type(req)) res.status(400)
  // request to db, get need items
  res.status(200).json(temp_arr)
})

app.post('/items', (req, res) =>
{
  if (!check_type(req)) res.status(400)
  // request to db, post need item
  res.status(201)
})

app.update('/items', (req, res) =>
{
  if (!check_type(req)) res.status(400)
  // request to db, update need item
  res.status(201)
}

app.delete('/items', (req, res) =>
{
  if (!check_type(req)) res.status(400)
  // request to db, delete need item
  res.status(200)
}

