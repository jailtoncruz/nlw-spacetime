import axios, { AxiosError } from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const userSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
  avatar_url: z.string().url(),
})

type UserInfo = z.infer<typeof userSchema>

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)
    let userInfo: UserInfo | undefined

    try {
      const accessTokenResponse = await axios.post(
        `https://github.com/login/oauth/access_token`,
        null,
        {
          params: {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code,
          },
          headers: {
            Accept: 'application/json',
          },
        },
      )

      const { access_token } = accessTokenResponse.data

      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      userInfo = userSchema.parse(userResponse.data)
    } catch (_err) {
      const err = _err as AxiosError
      console.error({
        url: err.response?.config.url,
        data: err.response?.data,
        cause: err.cause,
      })
    }

    if (!userInfo) throw new Error('not found')

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (!user)
      user = await prisma.user.create({
        data: {
          avatarUrl: userInfo.avatar_url,
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
        },
      })

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      { sub: user.id, expiresIn: '30 days' },
    )

    return {
      token,
    }
  })
}
