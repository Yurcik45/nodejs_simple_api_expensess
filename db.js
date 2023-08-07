const fs = require('fs')
const util = require('util')
const { Pool } = require('pg')

const readFileAsync = util.promisify(fs.readFile)

const db_err_handling_hoc = func =>
{
  return async (...args) => {
    try {
      const result = await func(...args);
      return result;
    }
    catch (err) { console.error('Error:', err) }
  }
}

const log_battle_rows = res => console.table(res.rows.map(r => ({ ...r })))

const db_connect = async () =>
{
  const pool = new Pool({
    user: process.env['DB_USER'],
    password: process.env['DB_PASSWORD'],
    database: process.env['DB_NAME'],
    host: process.env['DB_HOST'] ?? "localhost", // default PostgreSQL host
    port: process.env['DB_PORT'] ?? 5432, // default PostgreSQL port
  })

  try {
    const client = await pool.connect()
    console.log('Connected to PostgreSQL database')
    return {
      client,
      done: () => {
        client.release()
        console.log('Client released back to the pool')
      }
    }
  } catch (err) {
    console.error('Error connecting to database', err)
    throw err // Rethrow the error to be caught by the calling code
  }
}

const db_init = db_err_handling_hoc(async () =>
{
  const data = await readFileAsync('./tables.sql', 'utf8')
  const createTables = data

  const { client, done } = await db_connect()
  await client.query(createTables)
  console.log('Tables created successfully')
  done()
})

const execute_query = async query =>
{
  const { client, done } = await db_connect();
  const result = await client.query(query);
  log_battle_rows(result)
  done();
  return result
}

const execute_query_safety = db_err_handling_hoc(execute_query)

const query_builder = ({ ...params }) =>
({
  get_expenses:   `SELECT * FROM expensess`,
  get_benefits:   `SELECT * FROM benefits`,
  add_expense:    `INSERT INTO expensess (name, sum, category, description)
                   VALUES ('${ params.name }', ${ params.sum }, '${ params.category }', '${ params.description }')`,
  add_benefit:    `INSERT INTO benefits (name, sum, category, description)
                   VALUES ('${ params.name }', ${ params.sum }, '${ params.category }', '${ params.description }')`,
  patch_expense:  `UPDATE expensess
                   SET name='${ params.name }', sum=${ params.sum }, category='${ params.category }', description='${ params.description }'
                   WHERE id=${ params.id }`,
  patch_benefit:  `UPDATE benefits
                   SET name='${ params.name }', sum=${ params.sum }, category='${ params.category }', description='${ params.description }'
                   WHERE id=${ params.id }`,
  delete_expense: `DELETE FROM expensess
                   WHERE id=${ params.id }`,
  delete_benefit: `DELETE FROM benefits
                   WHERE id=${ params.id }`,
  get_categories: `SELECT * FROM categories`,
  add_category:   `INSERT INTO categories (name) VALUES ('${ params.name }')`,
})

const make_query = async (query_type, params = {}, castom) =>
{
  console.log("make_query", { query_type, params, castom  })
  const possible_query_types = Object.keys(query_builder({}))
  if (!castom  && possible_query_types.indexOf(query_type) === -1) return
  return await execute_query_safety(castom ?? query_builder(params)[query_type])
}

module.exports = {
  db_init,
  make_query,
}
