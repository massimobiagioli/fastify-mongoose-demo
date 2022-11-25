import { Schema, Document, model, Model } from 'mongoose'

export type DeviceModel = Model<DeviceDocument>

export interface DeviceDocument extends Document {
  name: string
  address: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
export const deviceSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

export const Device = model<DeviceDocument, DeviceModel>('Device', deviceSchema)
