require("dotenv").config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { db_init, make_query } = require('./db')

const PORT = process.env['PORT'] ?? 5000
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.listen(PORT, () => console.log("Server has been started on port ", PORT))

const init = async () => await db_init()
init()

const temp_arr = JSON.stringify([])

app.get('/', async (req, res) =>
{
  res.status(200).json("hello")
})

const check_type = req =>
{
  const type = req.query.type
  if (!type) return false
  if (type === "expenses" || type === "benefits") return type
}

app.get('/items', (req, res) =>
{
  const type = check_type(req)
  if (!type) return res.status(400)
  make_query(`get_${ type }`).then(db_res =>
  {
    res.status(200).json(db_res.rows)
  })
})

app.post('/items', (req, res) =>
{
  const type = check_type(req)
  if (!type) return res.status(400).json("post item type fail")
  make_query(`add_${ type.slice(0, -1) }`, req.body)
  .then(() => res.status(201).json("item posted"))
  .catch(err => res.status(500).json(JSON.stringify(err.message)))
})

app.patch('/items', (req, res) =>
{
  const type = check_type(req)
  if (!type) return res.status(400).json("patch item failed")
  make_query(`patch_${ type.slice(0, -1) }`, req.body)
  .then(() => res.status(201).json("item updated"))
  .catch(err => res.status(500).json(JSON.stringify(err.message)))
})

app.delete('/items', (req, res) =>
{
  const type = check_type(req)
  if (!type) return res.status(400).json("delete item failed")
  make_query(`delete_${ type.slice(0, -1) }`, req.body)
  .then(() => res.status(201).json("deleted") )
  .catch(err => res.status(500).json(JSON.stringify(err.message)))
})

app.get('/categories', (req, res) =>
{
  make_query('get_categories').then(db_res =>
  {
    res.status(200).json(db_res.rows)
  })
})

app.post('/categories', (req, res) =>
{
  make_query('add_category', { name: req.body.name }).then(db_res =>
  {
    res.status(200).json("category added")
  })
})
