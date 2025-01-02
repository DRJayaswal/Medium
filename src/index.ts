import cloneRepo from './service/cloneRepo.js';

import express, { Request, Response } from 'express';
import {createClient} from 'redis';

const subscriber = createClient();
subscriber.connect();

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.post('/api/deploy', (req,res)=>{
    cloneRepo(req,res);
});

app.get("/api/status", async (req, res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);
    res.json({
        status: response
    })
})
