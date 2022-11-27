import { DB } from '../db'

const listDevicesAction = (db: DB) => async () => {
  const { Device } = db.models
  return Device.find({})
}

export default listDevicesAction
