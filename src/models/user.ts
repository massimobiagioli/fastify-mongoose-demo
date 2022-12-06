import { Schema, Document, model, Model } from 'mongoose'

export interface UserAttrs {
  username: string
  password: string
  firstname: string
  lastname: string
  email: string
}

export interface UserModel extends Model<UserDocument> {
  addOne(doc: UserAttrs): UserDocument
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

userSchema.statics.addOne = (doc: UserAttrs) => {
  const newDoc = {
    ...doc,
    password: 'hashedPassword',
  }
  return new User(newDoc)
}

export const User = model<UserDocument, UserModel>('User', userSchema)
