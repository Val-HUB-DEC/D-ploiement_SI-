const ModbusRTU = require('modbus-serial');

async function lireValeurModbus(ip, address, port = 502) {
    const client = new ModbusRTU();
    try {
        await client.connectTCP(ip, { port });
        const data = await client.readCoils(address, 1);
        client.close();
        return { value : data.data[0] };
    } catch (err) {
        client.close();
        throw new Error('Erreur de lecture Modbus: ' + err.message);
    }
}

module.exports = { lireValeurModbus };
