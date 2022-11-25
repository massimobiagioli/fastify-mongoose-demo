import { DB } from '../model'

const listDevicesAction = (db: DB) => async () => {
  const { Device } = db.models
  return Device.find({})
}

export default listDevicesAction
