import AWS from 'aws-sdk';
const {S3} = AWS;
import fs from 'fs';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
});
export default async function uploadFile (fileName: string,localFilePath: string){
    const fileBody = fs.readFileSync(localFilePath);
    const bucket = process.env.AWS_BUCKET_NAME || "medium";
    const response  = await s3.upload({
        Bucket: bucket,
        Key: fileName,
        Body: fileBody,
    }).promise();
};