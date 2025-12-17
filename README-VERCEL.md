Vercel deployment

Steps to deploy this Vite app to Vercel (recommended):

1) Push this repository to GitHub (or GitLab).

2) On Vercel (https://vercel.com) create a new project and import your repo.

3) In the Vercel project settings set the following (usually auto-detected):
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`

4) The included `vercel.json` config ensures a SPA fallback to `index.html`.

5) Or deploy from CLI:

```bash
# install Vercel CLI (optional)
npm i -g vercel
# login and deploy
vercel login
vercel --prod
```

Notes and tips
- The app uses Vite; the production bundle is emitted to `dist` by `npm run build`.
- If you use environment variables (e.g., for realtime keys), add them in Vercel project settings.
- For automatic real-time updates across clients I can add Supabase/Pusher/Ably integration. If you want a simple polling approach instead, I can add a `SYNC_URL` fetcher and a small serverless endpoint to bump a version on admin updates.

If you want, I can also add a GitHub Action to automatically deploy to Vercel on push.
