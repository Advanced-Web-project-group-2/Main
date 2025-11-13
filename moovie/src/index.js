import express from 'express'
import cors from 'cors'
import pkg from 'pg'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


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

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Moovie API',
      version: '1.0.0',
      description: 'API documentation for the Moovie backend',
    },
    servers: [
      { url: `http://localhost:${port}` },
    ],
  },
  apis: ['./index.js'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

/**
 * @openapi
 * /:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of all users from db
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   credits:
 *                     type: number
 *                   icon:
 *                     type: string
 */


app.get('/', (req, res) => {
    const pool = openDb()

    pool.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json(result.rows)
    })
})

/**
 * @openapi
 * /add-user:
 *   post:
 *     summary: Add a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               passhash:
 *                 type: string
 *               credits:
 *                 type: number
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 *       500:
 *         description: Server error
 */

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
  console.log(`Swagger documentation at http://localhost:${port}/api-docs`)
});
