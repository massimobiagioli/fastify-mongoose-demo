import { Index } from '../db'

const listDevicesAction = (db: Index) => async () => {
  const { Device } = db.models
  return Device.find({})
}

export default listDevicesAction
