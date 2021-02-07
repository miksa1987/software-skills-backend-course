import mongoose from 'mongoose'

import logger from '../logger'

export const connectToDb = async () => {
  logger.info('Connecting to database...')
  await mongoose.connect(process.env.MONGO_URI!, {
    bufferCommands: false,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  logger.info('Connected to database')
}
