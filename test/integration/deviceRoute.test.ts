import {test} from "tap"
import createApp from "../../src/app";

// TODO: Add reset db before each test

test('create new device', async t => {
    const app = createApp()
    t.teardown(app.close.bind(app))

    const response = await app.inject({
        method: 'POST',
        url: '/api/devices',
        payload: {
            name: 'test-device',
            address: '10.10.10.1'
        }
    })
    const device = response.json()

    t.equal(response.statusCode, 201, 'returns a 201 status code')
    t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'returns a JSON content type')
    t.equal(device.name, 'test-device', 'returns the device name')
    t.equal(device.address, '10.10.10.1', 'returns the device address')
    t.equal(device.isActive, false, 'returns the device activation status')
})
