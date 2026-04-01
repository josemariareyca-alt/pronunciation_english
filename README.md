# Pronunciation Master - Deployment Guide

This app is built with React and Vite. To deploy it to Vercel or any other platform, follow these steps:

## 1. Environment Variables
The app uses the Gemini AI API for text-to-speech features. You must provide an API key.
- **Variable Name:** `GEMINI_API_KEY`
- **Where to get it:** [Google AI Studio](https://aistudio.google.com/app/apikey)

### On Vercel:
1. Go to your Project Settings.
2. Select **Environment Variables**.
3. Add `GEMINI_API_KEY` with your key.
4. Redeploy your project.

## 2. Build Settings
Vercel should automatically detect the settings, but if not:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

## 3. SPA Routing
A `vercel.json` file has been included to handle client-side routing. This ensures that refreshing the page doesn't result in a 404 error.
