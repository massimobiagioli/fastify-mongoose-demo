import { Static, Type } from '@sinclair/typebox'

export const Device = Type.Object({
  id: Type.String(),
  name: Type.String(),
  address: Type.String(),
  isActive: Type.Boolean(),
  createdAt: Type.String(),
  updatedAt: Type.String(),
})
export type Device = Static<typeof Device>

export const CreateDeviceCommand = Type.Object({
  name: Type.String(),
  address: Type.String(),
})
export type CreateDeviceCommand = Static<typeof CreateDeviceCommand>

export const UpdateDeviceCommand = Type.Partial(CreateDeviceCommand)
export type UpdateDeviceCommand = Static<typeof UpdateDeviceCommand>
