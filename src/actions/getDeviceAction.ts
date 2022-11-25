import { Index } from '../db'

const getDeviceAction = (db: Index) => async (id: string) => {
  const { Device } = db.models
  return Device.findById(id)
}

export default getDeviceAction
