import { Schema, Document, model, Model } from 'mongoose'
import * as crypto from 'crypto'
import { settings } from '../config'

export interface UserAttrs {
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
}

export interface UserModel extends Model<UserDocument> {
  addOne(doc: UserAttrs): UserDocument
  verifyPassword(username: string, password: string): boolean
}

export interface UserDocument extends Document {
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
  createdAt: string
  updatedAt: string
}

export const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const createPasswordHash = (username: string, password: string) => {
  const salt = crypto
    .createHash('sha256')
    .update(username + settings.hashedPasswordSalt)
    .digest('base64')
  const input = password + salt
  return crypto.createHash('sha256').update(input).digest('base64')
}

userSchema.statics.addOne = (doc: UserAttrs) => {
  const password = createPasswordHash(doc.username, doc.password)
  return new User({
    ...doc,
    password,
  })
}

userSchema.statics.verifyPassword = async (
  username: string,
  password: string,
) => {
  const user = await User.findOne({ username })
  return user?.password === createPasswordHash(username, password)
}

export const User = model<UserDocument, UserModel>('User', userSchema)
