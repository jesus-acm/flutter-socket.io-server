const { io } = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Bon Jovi'));
bands.addBand(new Band('Heroes del silencio'));
bands.addBand(new Band('Metalica'));

// console.log(bands);

// Mensajes de socket
io.on('connection', client => {
    console.log('Cliente conectado.');

    client.emit('active-bands', bands.getBands());
    
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // client.on('emitir-mensaje', (payload) =>{
    //     // io.emit('nuevo-mensaje', payload);//Emite a todos
    //     // console.log(payload);
    //     client.broadcast.emit('nuevo-mensaje', payload);//Emite a todos menos al que lo emitio
    // });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id)
        io.emit('active-bands', bands.getBands());
    });

});