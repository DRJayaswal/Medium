import express, { Request, Response } from 'express';
import cloneRepo from './service/cloneRepo.js';

const app = express();

app.use(express.json());

//  Server Configuration
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Server Handling Endpoint
app.post('/api/deploy', (req,res)=>{
    cloneRepo(req,res);
});
