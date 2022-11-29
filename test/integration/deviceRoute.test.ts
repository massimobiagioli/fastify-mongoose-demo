import {test, beforeEach} from "tap"
import createApp from "../../src/app";
import createDbFixtures from "../../src/fixture/dbFixture";

beforeEach(async () => {
    await createDbFixtures()
})

test('create new device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'POST',
        url: '/api/devices',
        payload: {
            name: 'test-device',
            address: '10.10.10.10'
        }
    })
    const device = response.json()

    t.equal(response.statusCode, 201, 'returns a 201 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'test-device', 'returns the device name')
    t.equal(device.address, '10.10.10.10', 'returns the device address')
    t.equal(device.isActive, false, 'returns the device activation status')
})

test('list all devices', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = response.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(devices.length, 2, 'returns two devices')
})

test('get a device by id', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const listDevicesResponse = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = listDevicesResponse.json()

    const response = await app.inject({
        method: 'GET',
        url: `/api/devices/${devices[0]._id}`,
    })
    const device = response.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'First Device', 'returns the device name')
    t.equal(device.address, '10.10.10.1', 'returns the device address')
})

test('update a device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const listDevicesResponse = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = listDevicesResponse.json()

    const response = await app.inject({
        method: 'PUT',
        url: `/api/devices/${devices[0]._id}`,
        payload: {
            name: 'Updated Device',
            address: '10.10.10.1'
        }
    })
    const device = response.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'Updated Device', 'returns the changed device name')
})

test('delete a device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const listDevicesResponseBeforeDeletion = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = listDevicesResponseBeforeDeletion.json()

    const response = await app.inject({
        method: 'DELETE',
        url: `/api/devices/${devices[0]._id}`,
    })
    const device = response.json()

    const listDevicesResponseAfterDeletion = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devicesAfterDeletion = listDevicesResponseAfterDeletion.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'First Device', 'returns the device name')
    t.equal(device.address, '10.10.10.1', 'returns the device address')
    t.equal(devicesAfterDeletion.length, 1, 'returns one device after deletion')
})

test('activate a device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const listDevicesResponse = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = listDevicesResponse.json()

    const response = await app.inject({
        method: 'PATCH',
        url: `/api/devices/${devices[0]._id}/activate`
    })
    const device = response.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.isActive, true, 'returns the activation status')
})

test('deactivate a device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const listDevicesResponse = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })
    const devices = listDevicesResponse.json()

    const activateResponse = await app.inject({
        method: 'PATCH',
        url: `/api/devices/${devices[0]._id}/activate`
    })
    const activatedDevice = activateResponse.json()

    const response = await app.inject({
        method: 'PATCH',
        url: `/api/devices/${devices[0]._id}/deactivate`
    })
    const deactivatedDevice = response.json()

    t.equal(response.statusCode, 200, 'returns a 200 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(activatedDevice.isActive, true, 'returns the activation status after activation')
    t.equal(deactivatedDevice.isActive, false, 'returns the activation status after deactivation')
})