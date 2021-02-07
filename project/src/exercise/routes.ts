import { Router } from 'express'

import { validateObject } from '../common/validator'

import { createMultipleExercises, getAllExercises } from './exercises'
import { exerciseRequestSchema } from './model'

const router = Router()

// TODO only admin
router.post('/', async (req, res) => {
  try {
    res.json(await createMultipleExercises(req.body.exercises))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (_req, res) => {
  try {
    res.json(await getAllExercises())
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
