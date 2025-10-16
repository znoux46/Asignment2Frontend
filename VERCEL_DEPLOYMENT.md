# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Environment Variables Setup
Your Vercel project already has these environment variables configured:
- `NEXT_PUBLIC_API_BASE_URL` - Your backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe test key
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_API_KEY` - Cloudinary API key

### 2. Local Development Setup
1. Copy environment variables to local development:
   ```bash
   # The .env.local file has been created with the correct values
   # No additional setup needed for local development
   ```

### 3. Deployment Process
1. **Push to GitHub**: Your code is automatically deployed when you push to the main branch
2. **Vercel Dashboard**: Monitor deployments at https://vercel.com/znoux46s-projects/asignment2-frontend
3. **Live URL**: https://asignment2-frontend.vercel.app/

## 🔧 Configuration Files Added/Updated

### `next.config.ts`
- ✅ Optimized for Vercel deployment
- ✅ Image optimization configured
- ✅ Compression enabled
- ✅ Security headers configured

### `package.json`
- ✅ Vercel-compatible build scripts
- ✅ Added linting and type-checking scripts
- ✅ Removed turbopack from production build (Vercel handles this)

### `vercel.json`
- ✅ Vercel-specific configuration
- ✅ Security headers
- ✅ Function timeout settings
- ✅ Environment variable mapping

## 🛠️ Development Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## 🔍 Troubleshooting

### Common Issues:
1. **Build Failures**: Check that all environment variables are set in Vercel dashboard
2. **API Connection Issues**: Verify `NEXT_PUBLIC_API_BASE_URL` points to your live backend
3. **Stripe Issues**: Ensure you're using the correct publishable key for your environment

### Environment Variable Priority:
1. Vercel Environment Variables (Production)
2. `.env.local` (Local Development)
3. Hardcoded fallbacks in code

## 📝 Next Steps

1. **Test the deployment**: Visit https://asignment2-frontend.vercel.app/
2. **Monitor performance**: Use Vercel Analytics
3. **Set up custom domain**: If needed, configure in Vercel dashboard
4. **Enable preview deployments**: For testing before production

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/znoux46s-projects/asignment2-frontend)
- [GitHub Repository](https://github.com/znoux46/Asignment2Frontend)
- [Live Application](https://asignment2-frontend.vercel.app/)
