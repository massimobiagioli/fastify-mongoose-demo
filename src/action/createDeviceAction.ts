import { DB } from '../plugins/db'

export type CreateDeviceActionParams = {
  name: string
  address: string
}

const createDeviceAction =
  (db: DB) => async (data: CreateDeviceActionParams) => {
    const { Device } = db.models
    const device = Device.addOne(data)
    await device.save()
    return device
  }

export default createDeviceAction
