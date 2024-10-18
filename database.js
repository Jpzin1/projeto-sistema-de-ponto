const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://JoaoPedro:sbnwJE3f7q3OvJPh@cluster10.v2wmu.mongodb.net/';

const client = new MongoClient(uri);

async function connect() {
    try {
        await client.connect();
        console.log('Conectando ao banco de dados MongoDB');
    } catch (error) {
        console.error('Erro ao conectar com ao MongoDB', error)
    }
}

module.exports = {
    connect,
    db: client.db('MongoDB')
};