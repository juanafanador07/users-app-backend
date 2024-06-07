require('dotenv').config()
const mongodb = require('mongodb');
const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const dbClient = require("./database");

(async () => {
    const app = express()
    app.use(cors()); 
    app.use(bodyParser.json());  

    try {
        await dbClient.connect();
        console.log('Connected successfully to server');
    } catch (err) {
        console.error('Could not connect to DB', err);
    }


    app.get('/api/usuarios', async (req, res) => {
        const users = await dbClient.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION).find().toArray();
        res.send(users)
    })

    app.post('/api/usuarios', async (req, res) => {
        await dbClient.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION).insertOne(req.body);
        res.send(req.body)
    })

    app.delete('/api/usuarios/:id', async (req, res) => {
        const user = await dbClient.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION).findOneAndDelete({
            _id: new mongodb.ObjectId(req.params.id)
        })
        res.send(user);
    })

    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
    })

})();