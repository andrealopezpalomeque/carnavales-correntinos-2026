# Firebase Deployment Instructions

## Prerequisites
Your project is now ready for Firebase deployment! Here's what has been set up:

### ✅ Configuration Files Created:
- `firebase.json` - Firebase hosting configuration
- `.firebaserc` - Firebase project configuration
- `nuxt.config.ts` - Updated for static generation

### ✅ Build Process:
- Static files generated in `.output/public/`
- Ready for Firebase Hosting

## Manual Steps Required:

### 1. Login to Firebase CLI
```bash
firebase login
```
This will open a browser window for you to authenticate with Google.

### 2. Verify Project Access
```bash
firebase projects:list
```
This will show you all Firebase projects you have access to.

### 3. Set the Correct Project
```bash
firebase use carnavales-correntinos-2026
```
Or if the project name is different, use:
```bash
firebase use your-actual-project-id
```

### 4. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### 5. Future Deployments (One Command)
After the initial setup, you can deploy with:
```bash
yarn generate && firebase deploy --only hosting
```

## Firebase Hosting Configuration Details:

### `firebase.json` Content:
```json
{
  "hosting": {
    "public": ".output/public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### Key Points:
- **Public Directory**: `.output/public` (where Nuxt generates static files)
- **SPA Configuration**: All routes redirect to `/index.html` for client-side routing
- **Static Generation**: Uses `ssr: false` and `preset: 'static'` for Firebase Hosting compatibility

## Environment Variables for Production:
Make sure your Firebase project has the same environment variables configured:
- `NUXT_PUBLIC_FIREBASE_API_KEY`
- `NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NUXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NUXT_PUBLIC_FIREBASE_APP_ID`

## Troubleshooting:
1. If login fails, make sure you're using the correct Google account
2. If project access is denied, verify the project ID in Firebase Console
3. If deployment fails, check that the build completed successfully with `yarn generate`

## Next Steps After Deployment:
1. Your app will be available at: `https://carnavales-correntinos-2026.web.app/`
2. Test the Google Sign-in functionality on the live site
3. Verify all routes work correctly
4. Set up custom domain if needed in Firebase Console

Run the commands above in order, and your app will be live on Firebase Hosting!