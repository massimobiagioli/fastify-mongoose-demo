import { DB } from '../plugins/db'

export type GetDeviceActionParams = {
  id: string
}

const getDeviceAction =
  (db: DB) =>
  async ({ id }: GetDeviceActionParams) => {
    const { Device } = db.models
    return Device.findById(id)
  }

export default getDeviceAction
