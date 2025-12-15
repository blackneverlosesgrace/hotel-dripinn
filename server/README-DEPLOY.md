# Deploy Backend to Vercel

## Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Create a Vercel account at https://vercel.com

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Navigate to server directory
```bash
cd server
```

### 3. Deploy to Vercel
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **hotel-dripinn-api** (or your preferred name)
- In which directory is your code located? **./**
- Want to override settings? **N**

### 4. Add Environment Variables

After deployment, add your environment variables in Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project **hotel-dripinn-api**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `GOOGLE_MAPS_API_KEY` = your_google_maps_api_key
   - `ADMIN_SECRET_KEY` = your_admin_secret_key
   - `INSTAGRAM_ACCESS_TOKEN` = your_instagram_token (optional)
   - `INSTAGRAM_USER_ID` = your_instagram_user_id (optional)

5. Click **Save**

### 5. Redeploy after adding environment variables
```bash
vercel --prod
```

### 6. Update Frontend API URLs

After deployment, Vercel will give you a URL like:
`https://hotel-dripinn-api.vercel.app`

You'll need to update your frontend to use this URL instead of `http://localhost:3000`

## Alternative: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `blackneverlosesgrace/hotel-dripinn`
3. Set **Root Directory** to `server`
4. Add environment variables in the deployment settings
5. Click **Deploy**

## Testing Your Deployment

Once deployed, test your API:
```bash
curl https://your-project-name.vercel.app/api/auth/register -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```
