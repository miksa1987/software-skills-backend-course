import express from 'express'
import bodyParser from 'body-parser'

import { connectToDb } from './common/db'
import workoutRoutes from './workout/routes'
import exerciseRoutes from './exercise/routes'
import exerciseGroupRoutes from './exercisegroup/routes'
import userRoutes from './users/routes'

export const generateApp = async () => {
  const app = express()
  app.use(bodyParser.json())

  connectToDb()

  app.use('/workout', workoutRoutes)
  app.use('/exercises', exerciseRoutes)
  app.use('/exercisegroups', exerciseGroupRoutes)
  app.use('/users', userRoutes)

  // 404 route
  app.get('*', (req, res) => {
    res.send('ok')
  })
  return app
}
