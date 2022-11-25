import { DB } from '../model'

const getDeviceAction = (db: DB) => async (id: string) => {
  const { Device } = db.models
  return Device.findById(id)
}

export default getDeviceAction
