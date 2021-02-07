import { Router } from 'express'

import { createMultipleExerciseGroups, getAllExerciseGroups } from './groups'

const router = Router()

// TODO only admin
router.post('/', async (req, res) => {
  try {
    res.json(await createMultipleExerciseGroups(req.body))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.get('/', async (_req, res) => {
  try {
    res.json(await getAllExerciseGroups())
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

export default router
