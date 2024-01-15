import express from 'express'
import dotenv from 'dotenv'

const app = express()

dotenv.config()

const port = process.env.PORT

app.get('/', (_req, res) => {
  res.send('Setup')
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} 🚀`)
})