import express from 'express';
import pkg from 'pg';
import { Connection } from './class/Connection';
import path from 'path';
import cors from 'cors';


const dirname = path.resolve();
const publicPath = path.join(dirname, 'public');


const APP = express();
// Configuration de CORS pour permettre les requêtes depuis n'importe quelle origine
APP.use(cors());
const PORT = 3000;
const { Pool } = pkg;
let CONNECTION: Connection | undefined = undefined;


APP.get('/api/connect/:host/:port/:database/:user/:password', async (req, res) => {
    const { host, port, database, user, password } = req.params;
    console.log("Requête en provenance de " + req.ip);


    try {
        CONNECTION = new Connection(host, port, database, user, password, Pool);
        await CONNECTION.connect()
        return res.status(200).json({ status: 'success', message: 'Successful connection', date: currentDate(), time: currentTime() });
    } catch (err: Error | any) {
        CONNECTION = undefined;
        return res.status(500).json({ status: 'error', message: err.message, date: currentDate(), time: currentTime() });
    }

});


APP.get('/api/entity/:schema/:table', async (req, res) => {
    const { schema, table } = req.params;
    try {
        const tasks = await CONNECTION?.getPool().query(`SELECT id, ST_AsGeoJSON(ST_Transform(geom, 3857)) FROM "${schema}"."${table}"`);
        res.json(tasks?.rows);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }

});

APP.get('/api/entity/:schema/:table/:id', async (req, res) => {
    const { schema, table, id } = req.params;
    try {
        const tasks = await CONNECTION?.getPool().query(`SELECT * FROM "${schema}"."${table}" WHERE id = ${id}`);
        res.json(tasks?.rows);
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }

});


APP.get('/api/schemas', async (req, res) => {
    try {
        const tasks = await CONNECTION?.getPool().query(`SELECT * FROM information_schema.schemata WHERE schema_name NOT IN 
        ('pg_toast_temp_6', 'pg_temp_6', 'information_schema', 'pg_catalog', 'pg_toast', 'public', 'pg_toast_temp_8', 
        'pg_temp_8', 'pg_toast_temp_7', 'pg_temp_7', 'pg_toast_temp_4', 'pg_temp_4', 'pg_toast_temp_5', 'pg_temp_5', 
        'historique', 'logging', 'rapport_erreur', 'test')`);
        res.json(tasks?.rows);
    } catch (err) {
        res.status(500).send(err);
    }

});

APP.get('/api/tables/:schema', async (req, res) => {
    const { schema } = req.params;
    try {
        const tasks = await CONNECTION?.getPool().query(`SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE' 
        AND table_schema = $1`, [schema]);
        res.json(tasks?.rows);
    } catch (err) {
        res.status(500).send(err);
    }

});

APP.on('close', async (req) => {
    console.log('La connexion a été coupée.');
});

APP.listen(PORT, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${PORT}`);
});

function currentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Mois de 0 à 11
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

function currentTime() {
    const currentDate = new Date();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
}