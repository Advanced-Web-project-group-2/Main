import express from 'express'
import cors from 'cors'
import pkg from 'pg'

const port = 3001
const { Pool }  = pkg

const app = express()
app.use(cors())

const openDb = () => {
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'moovie',
        password: 'Mochi230815!',
        port: 5432
    })
    return pool
}


app.get('/', (req, res) => {
    const pool = openDb()

    pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json(result.rows)
    })
})


app.listen(port, () => {
 console.log(`Server is running on http://localhost:${port}`)
})

app.post('/add-user', express.json(), (req, res) => {
  const pool = openDb()
  const { username, passhash, credits, icon } = req.body

  pool.query(
    'INSERT INTO users (username, passhash, credits, icon) VALUES ($1, $2, $3, $4) RETURNING *',
    [username, passhash, credits || 0, icon || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      res.status(201).json(result.rows[0])
    }
  )
})