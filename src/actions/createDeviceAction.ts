import { DB } from '../db'

export type CreateDeviceActionParams = {
  name: string
  address: string
}

const createDeviceAction =
  (db: DB) => async (params: CreateDeviceActionParams) => {
    const { Device } = db.models
    const device = Device.addOne(params)
    await device.save()
    return device
  }

export default createDeviceAction
