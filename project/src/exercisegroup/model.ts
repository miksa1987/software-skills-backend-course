import mongoose from 'mongoose'

import { Exercise } from '../exercise/model'

export interface ExerciseGroup {
  number: number
  previousGroup: number
  nextGroup: number
  name: string
  exercises?: Exercise[]
}

const exerciseGroupSchema = new mongoose.Schema({
  number: { type: Number, required: true }, // < 6
  previousGroup: { type: Number, required: true },
  nextGroup: { type: Number, required: true },
  name: { type: String, required: true, unique: true },
})

export default mongoose.model('ExerciseGroup', exerciseGroupSchema)
