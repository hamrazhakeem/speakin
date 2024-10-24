import boto3
import os
from botocore.exceptions import ClientError

def test_s3_connection():
    if not all([AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_STORAGE_BUCKET_NAME, AWS_S3_REGION_NAME]):
        print("Error: One or more required environment variables are not set.")
        return

    try:
        # Create an S3 client
        s3 = boto3.client('s3',
                          aws_access_key_id=AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
                          region_name=AWS_S3_REGION_NAME)

        # List objects in the bucket
        print(f"Attempting to list objects in bucket: {AWS_STORAGE_BUCKET_NAME}")
        response = s3.list_objects_v2(Bucket=AWS_STORAGE_BUCKET_NAME, MaxKeys=5)
        
        
        if 'Contents' in response:
            print("Successfully listed objects:")   
            for obj in response['Contents']:
                print(f" - {obj['Key']}")
        else:
            print("Bucket is empty or you don't have permission to list objects.")

        # Upload a test file   
        print("\nAttempting to upload a test file...")
        test_file_name = 'test_upload.txt'
        s3.put_object(Bucket=AWS_STORAGE_BUCKET_NAME,
                      Key=test_file_name,
                      Body='This is a test file for S3 connectivity.')
        print(f"Successfully uploaded test file: {test_file_name}")

        # Delete the test file
        print("\nAttempting to delete the test file...")
        s3.delete_object(Bucket=AWS_STORAGE_BUCKET_NAME, Key=test_file_name)
        print(f"Successfully deleted test file: {test_file_name}")

        print("\nS3 connection test completed successfully!")

    except ClientError as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_s3_connection()