import { DeviceAttrs } from '../model/device'
import { DB } from '../model'

const createDeviceAction = (db: DB) => async (deviceAttrs: DeviceAttrs) => {
  const { Device } = db.models
  const device = await Device.addOne(deviceAttrs)
  await device.save()
  return device
}

export default createDeviceAction
