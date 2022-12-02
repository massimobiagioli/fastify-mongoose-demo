import { DB } from '../plugins/db'

export type DeleteDeviceActionParams = {
  id: string
}

const deleteDeviceAction =
  (db: DB) =>
  async ({ id }: DeleteDeviceActionParams) => {
    const { Device } = db.models
    return Device.findByIdAndDelete(id)
  }

export default deleteDeviceAction
