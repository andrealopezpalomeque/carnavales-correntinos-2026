# Project Overview

This project is a Nuxt.js application for the Correntinos Carnivals of 2026. It features a countdown to the event, a gallery of photos, and a section for fun facts with a voting system.

## Technical Stack

- Frontend: Nuxt 3 (Vue 3)
- Styling: Tailwind CSS
- Database & Hosting: Firebase
- State Management: Pinia (with Firestore integration)
- Package dependencies: yarn (not npm)

## Project Structure

```
/
├── app.vue # Main entry point
├── assets/ # CSS and other assets
│   └── css/
│       └── style.css
├── components/ # Reusable Vue components
│   ├── Countdown.vue # Displays a countdown to the event
│   ├── FunFacts.vue # Displays a list of fun facts with voting
│   ├── Gallery.vue # Image gallery
│   └── MenuBar.vue # Navigation bar
├── nuxt.config.ts # Nuxt.js configuration
├── package.json # Project dependencies and scripts
├── pages/ # Application pages
│   └── index.vue # Main page
├── plugins/ # Nuxt plugins
│   └── firebase.client.ts # Firebase initialization
├── public/ # Static assets
│   ├── favicon.ico
│   └── images/
├── server/ # Server-side code
├── services/ # Services for external APIs
│   └── index.ts # Firebase service
└── stores/ # Pinia stores
    └── facts.js # Store for fun facts
```

## Components

### `app.vue`

The main entry point of the application. It renders the Nuxt pages.

### `pages/index.vue`

The main page of the application. It includes the `MenuBar`, `Countdown`, `Gallery`, and `FunFacts` components.

### `components/MenuBar.vue`

A navigation bar that links to different sections of the page.

### `components/Countdown.vue`

Displays a real-time countdown to the start of the carnivals. It also includes links to social media and the official website.

### `components/Gallery.vue`

An image carousel/gallery that displays photos of the carnival. It includes navigation arrows, dot indicators, and a play/pause button.

### `components/FunFacts.vue`

Displays a list of fun facts about the carnival. Users can vote for their favorite facts. The data is fetched from Firebase.

### `stores/facts.js`

A Pinia store that manages the state for the fun facts. It fetches the facts from Firebase and handles the voting logic.

### `services/index.ts`

A service that interacts with Firebase to get and vote for fun facts.

### `plugins/firebase.client.ts`

A Nuxt plugin that initializes Firebase on the client-side.

#### Package JSON scripts and dependencies

##### Scripts

*   `build`: `nuxt build`
*   `dev`: `nuxt dev`
*   `generate`: `nuxt generate`
*   `preview`: `nuxt preview`
*   `postinstall`: `nuxt prepare`

##### Dependencies

*   `@iconify/vue`: `^5.0.0`
*   `@nuxtjs/google-fonts`: `^3.2.0`
*   `@nuxtjs/tailwindcss`: `7.0.0-beta.0`
*   `@pinia/nuxt`: `^0.11.1`
*   `@vueuse/core`: `^13.4.0`
*   `@vueuse/nuxt`: `^13.4.0`
*   `firebase`: `^11.9.1`
*   `lucide-vue-next`: `^0.525.0`
*   `nuxt`: `^3.17.5`
*   `pinia`: `^3.0.3`
*   `vue`: `^3.5.17`
*   `vue-router`: `^4.5.1`

##### Dev Dependencies

*   `tailwindcss`: `^4.1.10`