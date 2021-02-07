import { Document } from 'mongoose'

import ExerciseGroup, { ExerciseGroup as IExerciseGroup } from './model'

export const getAllExerciseGroups = async (): Promise<IExerciseGroup[]> => {
  const groups = await ExerciseGroup.find({})
  return groups.map((group: any) => group._doc)
}

export const createExerciseGroup = async (
  exerciseGroupData: IExerciseGroup
): Promise<Document<IExerciseGroup> | null> => {
  try {
    const unsavedExerciseGroup = new ExerciseGroup(exerciseGroupData)
    return await unsavedExerciseGroup.save()
  } catch (error) {
    return null
  }
}

export const createMultipleExerciseGroups = async (
  exercisesData: IExerciseGroup[]
): Promise<Array<Document<IExerciseGroup>>> => {
  const savedExerciseGroups = await Promise.all(
    exercisesData.map((exerciseGroupData) =>
      createExerciseGroup(exerciseGroupData)
    )
  )
  return savedExerciseGroups.filter(
    (savedExerciseGroup) => savedExerciseGroup !== null
  ) as Array<Document<IExerciseGroup>>
}
