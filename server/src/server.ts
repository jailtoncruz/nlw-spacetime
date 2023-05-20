import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import 'dotenv/config'
import fastify from 'fastify'
import { resolve } from 'path'
import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'
const app = fastify()

app.register(cors, {
  origin: true,
})
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '..', 'uploads'),
  prefix: '/uploads',
})

app.register(memoriesRoutes)
app.register(authRoutes)

app.register(multipart)
app.register(uploadRoutes)

if (process.env.SECRET)
  app.register(jwt, {
    secret: process.env.SECRET,
  })
else console.error(`Environment Variable [SECRET] is not defined`)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
