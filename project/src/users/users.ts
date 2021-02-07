import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { Workout } from '../workout/model'

import User, { UserWithPassword, User as IUser } from './model'

// TODO implement google auth?

interface DecodedToken {
  _id: string
}

const createToken = (payload: IUser) => {
  const tokenPayload = { _id: payload._id }
  return jwt.sign(tokenPayload, process.env.JWT_SECRET!)
}

export const createUser = async (payload: UserWithPassword) => {
  const payloadWithLowerCaseUsername = {
    ...payload,
    username: payload.username.toLowerCase(),
  }
  const hashedPass = await bcrypt.hash(payload.password, 10)
  const payloadWithHashedPassword = {
    ...payloadWithLowerCaseUsername,
    password: hashedPass,
  }
  const savedUser = await new User(payloadWithHashedPassword).save()
  const token = await createToken((savedUser as unknown) as IUser)
  return token
}

export const loginUser = async (payload: {
  username: string
  password: string
}) => {
  const user = ((await User.findOne({
    username: payload.username.toLowerCase(),
  })) as unknown) as UserWithPassword
  const passwordCorrect =
    user && user!.password && bcrypt.compare(payload.password, user.password)

  if (!passwordCorrect) {
    throw new Error('Password incorrect or user not found')
  }

  return createToken((user! as unknown) as IUser)
}

export const getUser = (id: string) => User.findOne({ _id: id })

export const saveWorkoutToUser = async (token: string, workout: Workout) => {
  const decodedToken = (await jwt.decode(token)) as DecodedToken
  const user = ((await User.findOne({
    _id: decodedToken._id,
  })) as unknown) as IUser
  if (!user) {
    throw new Error('User not found')
  }

  const updatedUserData = {
    ...user,
    workouts: user.workouts ? user.workouts.concat(workout) : [workout],
  }

  return await User.findByIdAndUpdate(user._id, updatedUserData, { new: true })
}
