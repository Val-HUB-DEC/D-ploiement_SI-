const ModbusRTU = require('modbus-serial');

async function lireValeurModbus(ip, address, port = 502, quantity = 1) {
    const client = new ModbusRTU();
    try {
        await client.connectTCP(ip, { port });
        const data = await client.readCoils(address, quantity);
        client.close();
        return { coils: data.data };
    } catch (err) {
        client.close();
        throw new Error('Erreur de lecture Modbus: ' + err.message);
    }
}

module.exports = { lireValeurModbus };
