import { Document } from 'mongoose'

import Exercise, { Exercise as IExercise } from './model'
let cachedExercises: IExercise[] = []

const hasAnyOfEquipment = (
  exerciseEquipment: string[],
  availableEquipment: string[]
) =>
  !!exerciseEquipment.filter((equipment) =>
    availableEquipment.includes(equipment)
  )

const hasLevels = (exercise: IExercise, level: string) => {
  const levels: { [idx: string]: string[] } = {
    beginner: ['beginner'],
    medium: ['medium', 'beginner'],
    hard: ['hard', 'medium'],
    insane: ['medium', 'hard', 'insane'],
    sensei: ['hard', 'insane', 'sensei'],
  }

  return levels[level].includes(exercise.level)
}

const hasWeights = (equipment: string[]) => {
  for (const piece of ['dumbbell', 'kettlebell', 'barbell']) {
    if (equipment.includes(piece)) {
      return true
    }
  }
  return false
}

interface ExerciseConditions {
  equipment: string[]
  group: number
  level: string
  isometric: boolean
  skill?: boolean
  type?: string
  compound?: boolean
}
export const getExercisesWithConditions = async (
  conditions: ExerciseConditions
) => {
  const exercises = await getAllExercises()

  // TODO cleanup
  return exercises
    .filter((e) => e.mainGroup === conditions.group)
    .filter((e) => e.isometric === conditions.isometric)
    .filter((e) => hasAnyOfEquipment(e.equipment, conditions.equipment))
    .filter((e) =>
      hasWeights(conditions.equipment) ? e : hasLevels(e, conditions.level)
    )
    .filter((e) =>
      hasWeights(e.equipment) ? e : hasLevels(e, conditions.level)
    )
    .filter((e) =>
      hasWeights(conditions.equipment)
        ? hasWeights(e.equipment)
        : !hasWeights(e.equipment)
    )
    .filter((e) => e.isometric === conditions.isometric)
}

export const getAllExercises = async () => {
  const newExercises = await Exercise.find({})
  cachedExercises = (newExercises.map(
    (exercise: any) => exercise._doc
  ) as unknown) as IExercise[]
  return newExercises.map((e: any) => e._doc)
}

export const createExercise = async (
  exerciseData: IExercise
): Promise<Document<IExercise> | null> => {
  try {
    const unsavedExercise = new Exercise(exerciseData)
    return await unsavedExercise.save()
  } catch (error) {
    return null
  }
}

export const createMultipleExercises = async (
  exercisesData: IExercise[]
): Promise<Array<Document<IExercise>>> => {
  const savedExercises = await Promise.all(
    exercisesData.map((exerciseData) => createExercise(exerciseData))
  )
  return savedExercises.filter(
    (savedExercise) => savedExercise !== null
  ) as Array<Document<IExercise>>
}
