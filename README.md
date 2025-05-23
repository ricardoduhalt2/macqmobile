# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## AI Agent Changelog

**2025-10-05:**
- **AI Chatbot Implemented:** Added an AI-powered chatbot to the marketplace.
  - **Features:**
    - Provides information about NFTs (descriptions, prices, how to buy) using local data.
    - Answers general questions and provides information about the "MUSEO DE ARTE CONTEMPORANEO DE QUINTANA ROO" using Google's Generative AI (Gemini 1.5 Flash model).
    - Features a pleasant conversational tone and a user-friendly interface.
    - Includes a visual typing indicator while fetching AI responses.
  - **Technical Details:**
    - Integrated the `@google/generative-ai` SDK.
    - Requires a `VITE_GOOGLE_AI_API_KEY` in the `.env` file to function with Google AI.
    - Chatbot UI styled to match the application's dark theme.
  - **Status:** Chatbot is functional and integrated into the application.

**2025-09-05:**
- **NFT Descriptions Fixed:** Successfully implemented dynamic fetching and display of NFT descriptions in the `DropCard` component. Descriptions are now visible on the marketplace cards. This is a good checkpoint; the application is rendering correctly with this feature.
- **Card Layout & Favicon:** Adjusted card layout for better desktop presentation (fixed 3-column grid). Full responsiveness for mobile/tablet column counts deferred. Favicon updated to use the primary "Unlockable Content Agency" logo.
