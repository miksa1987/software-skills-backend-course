import { Router } from 'express'

import { saveWorkoutToUser } from '../users/users'

import { getWorkout } from './workout'

const router = Router()

router.post('/save', async (req, res) => {
  try {
    res
      .status(201)
      .json(await saveWorkoutToUser(req!.headers!.authorization!, req.body))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    res.json(await getWorkout(req.body))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
