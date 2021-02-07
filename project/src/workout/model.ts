import { ExerciseGroup } from '../exercisegroup/model'

interface ExerciseSetsAndReps {
  sets: number
  repsPerSet: number
  name: string
  duration: number
}

export interface Workout {
  groups: ExerciseGroup[]
  workout: ExerciseSetsAndReps[]
  totalDurationInSeconds: number
  restBetweenSetsSeconds: number
  restBetweenExercisesSeconds: number
  created: string
}
