# Firebase Google Sign-in Setup Guide

This guide will help you set up Google Sign-in authentication using Firebase in your Nuxt 3 project.

## 📋 Prerequisites

- A Google account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js 18+ and npm

## 🔥 Firebase Console Setup

### 1. Create/Access Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project: `carnavales-correntinos-2026`
3. Follow the setup wizard:
   - Enable Google Analytics (optional)
   - Choose your Analytics account

### 2. Add Web App to Firebase Project

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. Register app:
   - App nickname: `Carnavales Correntinos Web`
   - Check "Set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy your Firebase config** - you'll need these values:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "carnavales-correntinos-2026.firebaseapp.com",
     projectId: "carnavales-correntinos-2026",
     storageBucket: "carnavales-correntinos-2026.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

### 3. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Get started**
2. Go to **Sign-in method** tab
3. Enable **Google** provider:
   - Click on Google
   - Toggle "Enable"
   - Set **Project support email**
   - Click "Save"

### 4. Configure Authorized Domains

1. In **Authentication** → **Settings** → **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - `carnavales-correntinos-2026.web.app` (if using Firebase Hosting)
   - Your custom domain if applicable

### 5. Google Cloud Console Setup (Optional)

For production apps, configure OAuth consent screen:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** → **OAuth consent screen**
4. Configure your app information:
   - App name: "Carnavales Correntinos"
   - User support email
   - App logo (optional)
   - Authorized domains

## 🛠️ Local Development Setup

### 1. Environment Variables

Create a `.env` file in your project root:

```bash
# Copy from .env.example and fill with your Firebase config
cp .env.example .env
```

Fill in your Firebase configuration values:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=carnavales-correntinos-2026.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=carnavales-correntinos-2026
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=carnavales-correntinos-2026.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 2. Install Dependencies

Dependencies are already installed, but if you need to reinstall:

```bash
npm install firebase @vueuse/firebase
```

### 3. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the demo page:
   ```
   http://localhost:3000/auth-demo
   ```

3. Click "Iniciar sesión con Google" and test the authentication flow

## 📁 Project Structure

The Firebase integration includes these files:

```
├── plugins/
│   └── firebase.client.ts          # Firebase initialization
├── composables/
│   └── useAuth.ts                  # Authentication composable
├── components/
│   └── GoogleSignIn.vue            # Reusable sign-in component
├── types/
│   └── auth.ts                     # TypeScript definitions
├── pages/
│   └── auth-demo.vue               # Demo page (can be removed)
├── .env.example                    # Environment variables template
└── FIREBASE_SETUP.md              # This guide
```

## 🧩 Usage Examples

### Basic Usage in a Component

```vue
<template>
  <div>
    <GoogleSignIn 
      @sign-in-success="handleSignIn"
      @sign-in-error="handleError"
    />
  </div>
</template>

<script setup>
const handleSignIn = (user) => {
  console.log('User signed in:', user)
  // Redirect or update UI
}

const handleError = (error) => {
  console.error('Sign-in error:', error)
}
</script>
```

### Using the Auth Composable

```vue
<script setup>
const { 
  user, 
  isAuthenticated, 
  isLoading, 
  signInWithGoogle, 
  signOutUser 
} = useAuth()

// Watch for auth state changes
watch(isAuthenticated, (isAuth) => {
  if (isAuth) {
    // User signed in
    navigateTo('/dashboard')
  }
})
</script>
```

### Protecting Routes

Create a middleware file `middleware/auth.ts`:

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (!isAuthenticated.value && !isLoading.value) {
    return navigateTo('/login')
  }
})
```

Use in pages:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

## 🎨 Customizing the Sign-in Component

The `GoogleSignIn` component accepts several props:

```vue
<GoogleSignIn
  button-text="Sign in with Google"
  size="lg"
  variant="outline"
  :show-user-info="true"
  @sign-in-success="handleSuccess"
  @sign-in-error="handleError"
  @sign-out-success="handleSignOut"
/>
```

Available props:
- `buttonText`: Custom button text
- `size`: 'sm', 'md', 'lg'
- `variant`: 'default', 'outline', 'minimal'
- `showUserInfo`: Show user details when authenticated

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit Firebase config to git
2. **Domain Restrictions**: Only add necessary domains to authorized domains
3. **User Validation**: Always validate user data on your backend
4. **Token Verification**: Verify Firebase tokens on your server
5. **HTTPS**: Always use HTTPS in production

## 🚀 Deployment

### Vercel/Netlify
Add environment variables in your hosting platform's dashboard.

### Firebase Hosting
```bash
# Build and deploy
npm run build
firebase deploy
```

## 🐛 Troubleshooting

### Common Issues

**1. "Firebase not initialized" error**
- Check that your `.env` file exists and has all required variables
- Ensure the Firebase plugin is loading correctly

**2. "Popup blocked" error**
- Make sure popups are allowed in your browser
- Test in incognito mode to rule out extensions

**3. "Unauthorized domain" error**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**4. TypeScript errors**
- Ensure all type definitions are imported correctly
- Check that `@types/node` is installed

### Debug Mode

Visit `/auth-demo` page to see detailed debugging information during development.

## 📚 Additional Resources

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [VueUse Firebase](https://vueuse.org/firebase/readme.html)

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify your Firebase configuration
3. Test with the `/auth-demo` page
4. Review Firebase Console logs

---

**Project**: Carnavales Correntinos 2026  
**Last Updated**: January 2025