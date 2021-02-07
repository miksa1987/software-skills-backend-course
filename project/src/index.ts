import { generateApp } from './app'
import logger from './logger'

const init = async () => {
  const app = await generateApp()
  app.listen(process.env.PORT ?? 4000, () => {
    logger.info('Server running on port 4000')
  })
}

init()
