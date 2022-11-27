import { DB } from '../db'

export type DeleteDeviceActionParams = {
  id: string
}

const getDeviceAction =
  (db: DB) =>
  async ({ id }: DeleteDeviceActionParams) => {
    const { Device } = db.models
    return Device.findByIdAndDelete(id)
  }

export default getDeviceAction
