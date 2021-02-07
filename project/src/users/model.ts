import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { Workout } from '../workout/model'

export interface User {
  _id?: string
  username: string
  description: string
  photo: string
  workouts?: Workout[]
}

export interface UserWithPassword extends User {
  password: string
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    uniqueCaseInsensitive: true,
  },
  password: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: true },
  workouts: [{ type: String }],
})
userSchema.plugin(uniqueValidator)

export default mongoose.model('User', userSchema)
