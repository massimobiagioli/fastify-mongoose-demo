import { DB } from '../plugins/db'

const listDevicesAction = (db: DB) => async () => {
  const { Device } = db.models
  return Device.find({})
}

export default listDevicesAction
