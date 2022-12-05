import { Schema, Document, model, Model } from 'mongoose'

export interface UserAttrs {
  username: string
  firstname: string
  lastname: string
  email: string
}

export interface UserModel extends Model<UserDocument> {
  addOne(doc: UserAttrs): UserDocument
}

export interface UserDocument extends Document {
  username: string
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
  return new User(doc)
}

export const User = model<UserDocument, UserModel>('User', userSchema)
