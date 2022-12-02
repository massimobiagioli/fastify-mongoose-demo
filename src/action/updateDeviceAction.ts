import { DB } from '../plugins/db'

export type UpdateDeviceData = {
  name: string
  address: string
}

export type UpdateDeviceActionParams = {
  id: string
  data: UpdateDeviceData
}

const updateDeviceAction =
  (db: DB) =>
  async ({ id, data }: UpdateDeviceActionParams) => {
    const { Device } = db.models
    return Device.findByIdAndUpdate(id, data, { new: true })
  }

export default updateDeviceAction
