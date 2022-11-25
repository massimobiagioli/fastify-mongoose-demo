import { Schema, Document, model, Model } from 'mongoose'

export interface DeviceAttrs {
    name: string;
    address: string;
}

export interface DeviceModel extends Model<DeviceDocument> {
    addOne(doc: DeviceAttrs): DeviceDocument;
}

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

deviceSchema.statics.addOne = (doc: DeviceAttrs) => {
    return new Device(doc);
};

export const Device = model<DeviceDocument, DeviceModel>('Device', deviceSchema)
