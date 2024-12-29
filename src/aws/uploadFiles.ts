import AWS ,{S3} from 'aws-sdk';
import fs from 'fs';

const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
export default async function uploadFiles (fileName: string,localFilePath: string){
    const fileBody = fs.readFileSync(localFilePath);
    const bucket = process.env.AWS_BUCKET_NAME || "medium";
    const response  = await s3.upload({
        Bucket: bucket,
        Key: fileName,
        Body: fileBody,
    }).promise();
};