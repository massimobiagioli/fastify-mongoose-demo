import { DB } from '../plugins/db'

export type ChangeDeviceActivationStatusActionParams = {
  id: string
  active: boolean
}

const changeDeviceActivationStatusAction =
  (db: DB) =>
  async ({ id, active }: ChangeDeviceActivationStatusActionParams) => {
    const { Device } = db.models
    return Device.findByIdAndUpdate(id, { isActive: active }, { new: true })
  }

export default changeDeviceActivationStatusAction
