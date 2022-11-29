import mongoose from 'mongoose'
import { Device } from '../db/model/device'
import { settings } from '../config'

const createDbFixtures = async () => {
  const client = await mongoose.connect(settings.mongoUri)

  await client.connection.db.dropDatabase()

  await new Device({
    name: 'First Device',
    address: '10.10.10.1',
  }).save()

  await new Device({
    name: 'Second Device',
    address: '10.10.10.2',
  }).save()

  client.connection.close()
}

export default createDbFixtures
