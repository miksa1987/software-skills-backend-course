import { Router } from 'express'

import { getUser, loginUser, createUser } from './users'

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    res.json(await getUser(req.params.id))
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    res.json({ token: await createUser(req.body) })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    res.json({ token: await loginUser(req.body) })
  } catch (error) {
    res.status(401).json({ error: error.message })
  }
})

export default router
