import { DeviceAttrs } from '../db/model/device'
import { Index } from '../db'

const createDeviceAction = (db: Index) => async (deviceAttrs: DeviceAttrs) => {
  const { Device } = db.models
  const device = await Device.addOne(deviceAttrs)
  await device.save()
  return device
}

export default createDeviceAction
