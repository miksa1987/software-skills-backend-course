import { flatten } from 'lodash'

import { getExercisesWithConditions } from '../exercise/exercises'
import { getAllExerciseGroups } from '../exercisegroup/groups'
import { Exercise } from '../exercise/model'
import { ExerciseGroup } from '../exercisegroup/model'

import { Workout } from './model'

interface AdjustmentValues {
  strength: number
  muscle: number
  endurance: number
}

const maxRepRanges: AdjustmentValues = {
  strength: 5,
  muscle: 12,
  endurance: 40,
}

const maxHoldRanges: AdjustmentValues = {
  strength: 10,
  muscle: 30,
  endurance: 60,
}

const maxSetRanges: AdjustmentValues = {
  strength: 12,
  muscle: 7,
  endurance: 3,
}

const restPeriods: AdjustmentValues = {
  strength: 45,
  muscle: 30,
  endurance: 30,
}

const difficultyFactors: { [idx: string]: number } = {
  beginner: 1,
  medium: 1.2,
  hard: 1.4,
  insane: 1.7,
  sensei: 2,
}

type Equipment =
  | 'bar'
  | 'barbell'
  | 'dumbbell'
  | 'kettlebell'
  | 'rings'
  | 'none'
  | 'parallettes'
type Goal = 'strength' | 'muscle' | 'endurance'
type Type = 'bodyweight' | 'weights' | 'isometric' | 'dynamic'
type Level = 'beginner' | 'medium' | 'hard' | 'insane' | 'sensei'

interface WorkoutParams {
  goal: Goal
  level?: Level
  equipment: Equipment[]
  group: number
  groupsNum: number
  exercisesPerGroup?: number
  time?: number
  isometric: boolean
}

const getRandomSets = (
  values: AdjustmentValues,
  type: string,
  numOfExercises: number
): number => {
  const dividers: { [idx: number]: number } = {
    1: 2,
    2: 2,
    3: 3,
    4: 3,
    5: 4,
    6: 4,
    7: 5,
    8: 5,
    9: 5,
    10: 6,
    11: 6,
    12: 6,
    13: 7,
    14: 7,
    15: 7, // NOTE no one should really do over 15 different exercises per group. Period.
  }
  const divider = dividers[numOfExercises]

  switch (type) {
    case 'endurance':
      return Math.ceil(Math.random() * values.endurance)
    case 'muscle':
      return Math.ceil(
        Math.random() * (values.muscle - values.endurance) +
          values.muscle / divider
      )
    case 'strength':
      return Math.ceil(
        Math.random() * (values.strength - values.muscle) +
          values.strength / divider
      )
    default:
      return Math.ceil(Math.random() * values.strength)
  }
}

const getRandomReps = (values: AdjustmentValues, type: string): number => {
  switch (type) {
    case 'strength':
      return Math.ceil(Math.random() * values.strength)
    case 'muscle':
      return Math.ceil(
        Math.random() * (values.muscle - values.strength) + values.strength
      )
    case 'endurance':
      return Math.ceil(
        Math.random() * (values.endurance - values.muscle) + values.muscle
      )
    default:
      return Math.ceil(Math.random() * values.strength)
  }
}

const getRandomExercises = (
  exercises: Exercise[],
  number: number
): Exercise[] => {
  if (exercises.length < number) {
    return exercises
  }
  const randomIndexes: number[] = []
  for (let i = 0; i < number; i++) {
    let random: number
    do {
      random = Math.round(Math.random() * (exercises.length - 1))
    } while (randomIndexes.includes(random) || exercises.length <= 2)
    randomIndexes.push(random)
  }

  return randomIndexes.map((index) => exercises[index])
}

const selectExerciseGroups = async (
  startingGroup: number,
  numOfGroups: number
) => {
  const groups = ((await getAllExerciseGroups()) as unknown) as ExerciseGroup[]

  const selectedGroups = []
  let counter = numOfGroups
  let i = startingGroup

  while (counter > 0) {
    selectedGroups.push(groups.find((group) => group.number === i))
    i++
    counter--

    if (i >= groups.length) i = 0
  }
  return selectedGroups
}

const fillGroupsWithExercises = async (
  groups: ExerciseGroup[],
  params: WorkoutParams
) => {
  return await Promise.all(
    (groups.map(async (group) => ({
      ...group,
      exercises: await getExercisesWithConditions({
        level: params.level ?? 'medium',
        group: group!.number,
        equipment: params.equipment ?? ['barbell'],
        type: params.goal ?? 'strength',
        isometric: params.isometric ?? false,
      }),
    })) as unknown) as ExerciseGroup[] // FIXME typing?
  )
}

const selectedExerciseToString = (params: WorkoutParams) => (
  exercise: Exercise
) => {
  const sets = Math.round(
    getRandomSets(maxSetRanges, params.goal, params.exercisesPerGroup ?? 2) *
      difficultyFactors[params.level ?? 'medium']
  )
  const reps = getRandomReps(
    params.isometric ? maxHoldRanges : maxRepRanges,
    params.goal
  )

  return `${exercise.name}: ${sets} sets of ${reps} ${
    params.isometric ? 'seconds' : 'reps'
  }`
}

const exerciseData = (params: WorkoutParams) => (exercise: Exercise) => {
  const sets = Math.round(
    getRandomSets(maxSetRanges, params.goal, params.exercisesPerGroup ?? 2) *
      difficultyFactors[params.level ?? 'medium']
  )
  const reps = getRandomReps(
    params.isometric ? maxHoldRanges : maxRepRanges,
    params.goal
  )

  const duration =
    sets * reps * (exercise.timeToDoRep !== 0 ? exercise.timeToDoRep : 1) +
    sets * restPeriods[params.goal]

  return {
    duration,
    sets,
    repsPerSet: reps,
    name: exercise.name,
  }
}

export const getWorkout = async (params: WorkoutParams): Promise<Workout> => {
  const selectedExerciseGroups = await selectExerciseGroups(
    params.group,
    params.groupsNum
  )

  const groupsWithExercises = await fillGroupsWithExercises(
    (selectedExerciseGroups as unknown) as ExerciseGroup[],
    params
  )

  const workoutExercises = flatten(
    await Promise.all(
      groupsWithExercises.map((group) =>
        getRandomExercises(group!.exercises!, params.exercisesPerGroup ?? 2)
      )
    )
  )

  const workout = workoutExercises
    .filter((e) => e !== undefined)
    .map(exerciseData(params))

  const totalDurationInSeconds =
    workout.map((e) => e.duration).reduce((acc, curr) => acc + curr, 0) +
    workout.length * restPeriods[params.goal] * 2

  return {
    workout,
    groups: selectedExerciseGroups as ExerciseGroup[],
    totalDurationInSeconds,
    restBetweenSetsSeconds: restPeriods[params.goal],
    restBetweenExercisesSeconds: restPeriods[params.goal] * 2,
    created: new Date().toISOString(),
  }
}
