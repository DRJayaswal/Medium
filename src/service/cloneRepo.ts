import { Request, Response } from 'express';
import simpleGit from 'simple-git';
import {createClient} from 'redis';
const publisher = createClient();
publisher.connect();

import path from 'path';
import { fileURLToPath } from 'url';
import idGenerator from './idGenerator.js';
import getFiles from './getFiles.js';
import uploadFile from '../aws/uploadFile.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Function to clone a GitHub repository and upload its files to AWS S3
export default async function cloneRepo(req: Request, res: Response) {
    // Extract the repository URL from the request body
    const repoUrl: string = req.body.repoUrl;
    
    // Check if the repository URL is provided
    if (!repoUrl) {
        return res.status(400).json({ message: "GitHub repository is required" });
    }
    
    // Generate a unique ID for the repository
    const id: string = idGenerator();
    
    // Initialize repository status and file names array
    let cloneStatus: string = "Pending";
    let fileNames: string[] = [];
    let uploadStatus = "Pending";

    
    try {
        // Define the path where the repository will be cloned
        const repoPath = path.join(__dirname, `projects/${id}`);


        // Clone the repository
        console.log(`Cloning...`);
        await simpleGit().clone(repoUrl, repoPath);
        // Update the repository status
        cloneStatus = "Cloned";
        console.log(cloneStatus);


        // Get the list of files in the cloned repository
        fileNames = getFiles(repoPath);


        // Upload each file to AWS S3
        console.log(`Uploading...`);
        fileNames.forEach(async fileName => {
            await uploadFile(fileName.slice(__dirname.length+1), fileName);
        });
        // Update the upload status
        uploadStatus = "Uploaded";
        console.log(uploadStatus);
    

        publisher.lPush("projects-queue", id);


    } catch (error) {
        // Handle errors during the cloning process
        console.error("Error cloning repository:", error);
        return res.status(500).json({ message: "Failed to clone repository", error: error });      
    }

    // Send the response with repository details
    res.json({
        RepoId: id,
        RepoStatus: cloneStatus,
        RepoFiles: fileNames.length,
        RepoUploaded: uploadStatus
    });
};