import {
  CreateBucketCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

export const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${Bun.env.CLOUDFLARE_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Bun.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: Bun.env.CLOUDFLARE_ACCESS_KEY!
  }
})

export async function getBuckets() {
  return S3.send(new ListBucketsCommand({}))
}

export async function getBucket(bucketName: string) {
  return S3.send(new ListBucketsCommand({Prefix: bucketName}))
}

export async function createBucket(bucketName: string) {
  return S3.send(new CreateBucketCommand({
    Bucket: bucketName,
  }))
}

// // Generate a pre-signed URL for uploading a file to a specific path
// export async function generatePreSignedUploadLink(bucketName: string, folderName: string, fileName: string, fileSize: number) {
//   const uploadCommand = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: `${folderName}/${fileName}`,
//     ACL: "private", // No public access by default, users can only upload to this file
//     ContentLength: fileSize,
//     ContentType: "application/zip"
//   });

//   // Generate pre-signed URL for uploading (expires in 1 hour)
//   return await getSignedUrl(S3, uploadCommand, {expiresIn: 3600});
// }

// // Generate a pre-signed URL for reading the file after it's uploaded
// export async function generatePreSignedReadLink() {
//   const getObjectCommand = new GetObjectCommand({
//     Bucket: snapshot.bucketName,
//     Key: `${snapshot.snapshotFolderName}/${snapshot.snapshotName}`,
//   });

//   // Generate pre-signed URL for reading (expires in 1 hour)
//   return await getSignedUrl(S3, getObjectCommand, {expiresIn: 3600});
// }