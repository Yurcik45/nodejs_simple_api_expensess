const express = require('express')
const cors = require('cors')

const PORT = process.env['PORT'] ?? 5000
const app = express()

app.use(cors())

app.listen(PORT, () => console.log("Server has been started on port ", PORT))

app.get('/', (req, res) =>
{
  res.status(200).json("hello")
})
