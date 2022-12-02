import {test, beforeEach} from "tap"
import createDbFixtures from "../../src/fixture/dbFixture";
import {createTestApp} from "../../src/helpers";
import stub from 'sbuts'
import {DeviceRoutesPlugin} from "../../src/routes/device";

beforeEach(async () => {
    await createDbFixtures()
})

test('create new devices', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'POST',
        url: '/api/devices',
        payload: {
            name: 'test-devices',
            address: '10.10.10.10'
        }
    })
    const device = response.json()

    t.equal(response.statusCode, 201, 'returns a 201 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'test-devices', 'returns the devices name')
    t.equal(device.address, '10.10.10.10', 'returns the devices address')
    t.equal(device.isActive, false, 'returns the devices activation status')
})

test('error create new devices', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                create: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'POST',
        url: '/api/devices',
        payload: {
            name: 'test-devices',
            address: '10.10.10.10'
        }
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('list all devices', async t => {
    const app = createTestApp()
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

test('error list all devices', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                findAll: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'GET',
        url: '/api/devices',
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('get a devices by id', async t => {
    const app = createTestApp()
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
    t.equal(device.name, 'First Device', 'returns the devices name')
    t.equal(device.address, '10.10.10.1', 'returns the devices address')
})

test('error get a devices by not existing id', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'GET',
        url: '/api/devices/9990e1ce64f51baee3def999',
    })

    t.equal(response.statusCode, 404, 'returns a 404 status code')
})

test('error get a devices by id', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                getById: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'GET',
        url: '/api/devices/6380e1ce64f51baee3def465',
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('update a device', async t => {
    const app = createTestApp()
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
    t.equal(device.name, 'Updated Device', 'returns the changed devices name')
})

test('error update a device', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                update: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PUT',
        url: '/api/devices/6380e1ce64f51baee3def465',
        payload: {
            name: 'Updated Device',
            address: '10.10.10.1'
        }
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('error update a non existing device', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PUT',
        url: '/api/devices/9990e1ce64f51baee3def999',
        payload: {
            name: 'Updated Device',
            address: '10.10.10.1'
        }
    })

    t.equal(response.statusCode, 404, 'returns a 404 status code')
})

test('delete a device', async t => {
    const app = createTestApp()
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
    t.equal(device.name, 'First Device', 'returns the devices name')
    t.equal(device.address, '10.10.10.1', 'returns the devices address')
    t.equal(devicesAfterDeletion.length, 1, 'returns one devices after deletion')
})

test('error delete a device', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                remove: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'DELETE',
        url: '/api/devices/6380e1ce64f51baee3def465',
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('error delete a non existing device', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'DELETE',
        url: '/api/devices/9990e1ce64f51baee3def999',
    })

    t.equal(response.statusCode, 404, 'returns a 404 status code')
})

test('activate a device', async t => {
    const app = createTestApp()
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

test('error activate a device', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                activate: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PATCH',
        url: '/api/devices/6380e1ce64f51baee3def465/activate'
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('error activate a non existing device', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PATCH',
        url: '/api/devices/9990e1ce64f51baee3def999/activate'
    })

    t.equal(response.statusCode, 404, 'returns a 404 status code')
})

test('deactivate a device', async t => {
    const app = createTestApp()
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

test('error deactivate a device', async t => {
    const app = createTestApp({
        autoLoadPlugins: false,
        autoLoadRoutes: false,
        decorates: {
            'Device': {
                deactivate: stub().throw(new Error('test error'))
            }
        },
        routes: [
            DeviceRoutesPlugin
        ]
    })
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PATCH',
        url: '/api/devices/6380e1ce64f51baee3def465/deactivate'
    })

    t.equal(response.statusCode, 500, 'returns a 500 status code')
})

test('error deactivate a non existing device', async t => {
    const app = createTestApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'PATCH',
        url: '/api/devices/9990e1ce64f51baee3def999/deactivate'
    })

    t.equal(response.statusCode, 404, 'returns a 404 status code')
})
