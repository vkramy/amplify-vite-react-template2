# Backend Deployment Guide

## Current Status
The frontend is fully functional with a temporary localStorage solution for profile data. The backend needs to be deployed to enable permanent cloud storage of user profiles.

## Required Steps to Deploy Backend

### 1. Install Amplify CLI (if not already installed)
```bash
npm install -g @aws-amplify/cli
```

### 2. Configure AWS Credentials
Make sure you have AWS credentials configured:
```bash
aws configure
```

### 3. Deploy the Backend
Try one of these commands to deploy the backend:

**Option A: Using Amplify Gen 2 CLI**
```bash
npx ampx sandbox
```

**Option B: Using traditional Amplify CLI**
```bash
amplify push
```

**Option C: Manual deployment via AWS Console**
- Go to AWS Amplify Console
- Connect your repository
- Deploy the backend resources

### 4. Update amplify_outputs.json
After successful deployment, the `amplify_outputs.json` file should be updated with the new custom attributes.

## Custom Attributes Being Deployed
The following custom attributes will be added to AWS Cognito:
- `custom:age` - User's age
- `custom:height` - User's height in cm
- `custom:weight` - User's weight in kg
- `custom:fitness_goal` - User's fitness goal
- `custom:activity_level` - User's activity level
- `custom:membership_type` - User's membership type (read-only, defaults to "FREE")
- `custom:member_since` - Date when user signed up (read-only, set automatically)

## Storage Configuration
The backend also includes S3 storage configuration for:
- **Posture Assessment Photos**: Secure storage for front, side, and back posture photos
- **Profile Photos**: User profile image storage
- **Access Control**: User-specific access with proper authentication and authorization

## After Deployment
Once the backend is deployed:
1. The profile page will automatically sync localStorage data to AWS Cognito
2. The temporary notice will be removed
3. User profiles will be permanently stored in the cloud
4. Data will persist across devices and sessions
5. **S3 Storage**: Users can upload posture assessment photos securely
6. **Photo Management**: Photos are stored with user-specific access controls

## Troubleshooting
If deployment fails:
1. Check AWS credentials and permissions
2. Ensure you have the latest Amplify CLI version
3. Try deleting `node_modules` and running `npm install` again
4. Check the AWS Amplify console for error logs

## Current Workaround
Until the backend is deployed, the profile system uses localStorage:
- Data is saved locally in the browser
- Profile information persists within the same browser/device
- No data loss occurs during the transition to cloud storage