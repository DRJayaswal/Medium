import express, { Request, Response } from 'express';
import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';
import getRepoName from './getRepoName.js';
import idGenerator from './idGenerator.js';
import getFiles from './getFiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const cloneRepo = async (req: Request, res: Response) => {
    const repoUrl: string = req.body.repoUrl;
    if (!repoUrl) {
        return res.status(400).json({ message: "GitHub repository is required" });
    }
    const id: string = idGenerator();
    let repoStatus: string = "Pending";
    let fileNames: string[] = [];
    try {
        const repoPath = path.join(__dirname, `projects/${id}`);
        console.log(`Cloning...`);
        await simpleGit().clone(repoUrl, repoPath);
        fileNames = getFiles(repoPath);
        repoStatus = "Cloned";
        console.log(`Cloned.`);
    } catch (error) {
        console.error("Error cloning repository:", error);
        return res.status(500).json({ message: "Failed to clone repository", error: error });
    }

    res.json({
        RepoId: id,
        RepoStatus: repoStatus,
        RepoFiles: fileNames.length
    };
};

app.post('/api/deploy', (req,res)=>{
    cloneRepo(req,res);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});