import express from 'express'
import sslRedirect from 'heroku-ssl-redirect'
import helmet from 'helmet'
import compression from 'compression'
import { api } from './api'
import session from 'cookie-session'
import path from 'path'
import fs from 'fs'

async function startup() {
  const app = express()
  app.use(sslRedirect())
  app.use(
    '/api',
    session({
      secret:
        process.env['NODE_ENV'] === 'production'
          ? process.env['SESSION_SECRET']!
          : process.env['SESSION_SECRET_DEV'] || 'urban-secret-dev-key',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    })
  )
  app.use(compression())
  app.use(helmet({ contentSecurityPolicy: false }))

  app.use(api)

  let dist = path.resolve('dist/urban/browser')
  if (!fs.existsSync(dist)) {
    dist = path.resolve('../urban/browser')
  }
  app.use(express.static(dist))
  app.use('/*', async (req, res) => {
    if (req.headers.accept?.includes('json')) {
      console.log(req)
      res.status(404).json('missing route: ' + req.originalUrl)
      return
    }
    try {
      res.sendFile(dist + '/index.html')
    } catch (err) {
      res.sendStatus(500)
    }
  })
  let port = process.env['PORT'] || 3002
  app.listen(port)
}
startup()
