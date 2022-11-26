import { DB } from '../db'

export type GetDeviceActionParams = {
  id: string
}

const getDeviceAction = (db: DB) => async (params: GetDeviceActionParams) => {
  const { Device } = db.models
  return Device.findById(params.id)
}

export default getDeviceAction
