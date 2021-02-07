import mongoose from 'mongoose'

export interface Exercise {
  name: string
  type: string
  equipment: string[]
  isometric: boolean
  level: string
  unilateral: boolean
  okForHigherReps: boolean
  isSkill: boolean
  mainGroup: number
  isCompound: boolean
  timeToDoRep: number
  maxHoldTime: number
  created: string
}

export interface ExerciseRequest {
  exercises: Exercise[]
}

export const exerciseRequestSchema = {
  exercises: [
    {
      name: 'string',
      type: 'in:weighted,bodyweight',
      equipment: ['in:rings,bar,barbell,dumbbell,kettlebell,none'],
      isometric: 'boolean',
      level: 'in:beginner,medium,hard,insane',
      unilateral: 'boolean',
      okForHigherReps: 'boolean',
      isSkill: 'boolean',
      mainGroup: 'max:6',
      isCompound: 'boolean',
      timeToDoRep: 'integer',
      maxHoldTime: 'integer',
      created: 'string',
    },
  ],
}

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  equipment: [{ type: String, required: true }],
  isometric: { type: Boolean, required: true },
  level: { type: String, required: true },
  unilateral: { type: Boolean, required: true },
  okForHigherReps: { type: Boolean, required: true },
  isSkill: { type: Boolean, required: true },
  mainGroup: { type: Number, required: true },
  isCompound: { type: Boolean, required: true },
  timeToDoRep: { type: Number, required: false },
  maxHoldTime: { type: Number, required: false },
  created: { type: String, required: true },
})

export default mongoose.model('Exercise', exerciseSchema)
