import { Response } from 'express'

import logger from '../logger'

export const tryCatch = (res: Response, fn: Function) => {
  try {
    return fn()
  } catch (error) {
    logger.error(error.message)
    res.status(400).json({ error: error.message })
  }
}
