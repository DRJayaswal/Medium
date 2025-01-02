import { Request, Response } from 'express';
import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';
import idGenerator from './idGenerator.js';
import getFiles from './getFiles.js';
import uploadFile from '../aws/uploadFile.js';
import { pushToQueue, setStatus, disconnect } from './redisClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function cloneRepo(req: Request, res: Response) {
    const repoUrl: string = req.body.repoUrl;

    if (!repoUrl) {
        return res.status(400).json({ message: "GitHub repository is required" });
    }

    const id: string = idGenerator();
    let fileNames: string[] = [];
    
    try {
        const repoPath = path.join(__dirname.replace("/service", "/") + `projects/${id}`);
        
        console.log(`\nCloning project from GitHub...`);
        await simpleGit().clone(repoUrl, repoPath);
        console.log(`\nCloned project from GitHub.`);
    
        console.log("\nRetrieving files from Directory...");
        fileNames = getFiles(repoPath);
        console.log("\nTotal Files Retrieved : " + fileNames.length);
    
        console.log("\nUploading files to AWS...");
        // fileNames.forEach(async fileName => {
            //     await uploadFile(fileName.slice(__dirname.length + 1), fileName);
            // });
        console.log("\ntotal Files Uploaded : " + fileNames.length);
            
        console.log(`\nPushing ${id} to projectQ Redis...`);
        await pushToQueue("projectQ", id);
        console.log(`\nPushed ${id} to projectQ Redis.`);
    
        console.log(`\nUploading ${id} Status to Redis...`);
        await setStatus(id, "uploaded");
        console.log(`\nUploaded ${id} Status to Redis.`);

    } catch (error) {
        console.error("\nError While Cloning: \n", error);
        return res.status(500).json({ message: "Failed to Clone.", error: error });
    } finally {
        await disconnect();
    }
    
    res.json({
        id: id,
        RepoStatus: true,
        RepoFiles: fileNames.length,
        RepoUploaded: true
    });
};