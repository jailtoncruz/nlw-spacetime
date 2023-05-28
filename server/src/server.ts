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
  prefix: '/api/v1/uploads',
})

app.register(memoriesRoutes, { prefix: '/api/v1' })
app.register(authRoutes, { prefix: '/api/v1' })

app.register(multipart)
app.register(uploadRoutes, { prefix: '/api/v1' })

if (process.env.SECRET)
  app.register(jwt, {
    secret: process.env.SECRET,
    prefix: '/api/v1',
  })
else console.error(`Environment Variable [SECRET] is not defined`)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then((host) => {
    console.log(`🚀 HTTP server running on ${host}`)
  })
