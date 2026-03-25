# Deployment Guide

Your portfolio is ready for production! Choose one of these three options:

---

## Option 1: GitHub Pages (Recommended - Free & Simple)

### Prerequisites
- GitHub account
- Git installed locally

### Steps

1. **Create a GitHub repository**
   - Go to github.com/new
   - Name it: `ndhoang1401-ops.github.io` (replace with your username)
   - Make it PUBLIC
   - Click "Create repository"

2. **Push your code to GitHub**
   ```bash
   cd "c:\Users\DoanHoang\newbie code\DoanHoang"
   git init
   git add .
   git commit -m "Initial portfolio commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Set Source to "Deploy from a branch"
   - Branch: `main`, folder: `/ (root)`
   - Save

4. **Done!**
   - Your site is live at: `https://YOUR_USERNAME.github.io`
   - Updates push automatically with each commit
   - Free, fast, and perfect for portfolios

**Pros:** Free, automatic deploys, GitHub integration  
**Cons:** No server-side logic possible

---

## Option 2: Vercel (Recommended - Advanced Features)

### Steps

1. **Sign up**
   - Go to vercel.com
   - Click "Sign up"
   - Choose "GitHub" to connect your repository

2. **Import your project**
   - Click "Import Project"
   - Select "GitHub"
   - Find `ndhoang1401-ops.github.io` repository
   - Click "Import"

3. **Deploy**
   - Vercel auto-detects your project type
   - Click "Deploy"
   - Your site is live in ~1 minute!

4. **Custom domain (Optional)**
   - Go to project Settings → Domains
   - Add your custom domain
   - Update DNS records (Vercel shows instructions)

**Pros:** Fast, great performance, auto-deploy from Git, free tier generous  
**Cons:** Requires Git + GitHub account

---

## Option 3: Netlify (Great Alternative)

### Steps

1. **Sign up**
   - Go to netlify.com
   - Click "Sign up with GitHub"
   - Authorize Netlify to access your repos

2. **Deploy**
   - Netlify shows your repositories
   - Click "Deploy" on your portfolio repo
   - Select branch: `main`
   - Click "Deploy site"
   - Done! 🚀

3. **Custom domain**
   - Settings → Domain management
   - Add custom domain
   - Update DNS (instructions provided)

**Pros:** Easy, good free tier, great UI  
**Cons:** Slightly slower than Vercel

---

## Post-Deployment Checklist

After deploying, verify everything works:

- [ ] Site loads at your domain
- [ ] All 8 sections render (Hero, About, Skills, Projects, Case Studies, Blog, Tools, Testimonials, Contact)
- [ ] Navigation links scroll smoothly
- [ ] Theme toggle cycles through Dark → Light → Anime
- [ ] Hover effects on buttons work
- [ ] Mobile menu opens/closes
- [ ] Contact form validates input
- [ ] Calculator works (Hours × Rate)
- [ ] GitHub API updates `Stars` count
- [ ] Music player loads YouTube integration
- [ ] Images load (or fallback gracefully)
- [ ] No console errors (Inspect → Console)

---

## Performance Check

Run Lighthouse audit:

1. Open your deployed site
2. Open DevTools (F12)
3. Click "Lighthouse"
4. Click "Analyze page load"

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

If scores are lower:
- Check image sizes (use WebP conversion)
- Verify all external scripts load
- Check for console errors

---

## Environment Variables (If Needed)

If you add backend functionality later, create `.env.local`:

```
REACT_APP_GITHUB_USER=ndhoang1401-ops
REACT_APP_CONTACT_EMAIL=doanhoang.4work@gmail.com
```

For Vercel/Netlify:
- Go to Settings → Environment Variables
- Add your variables
- Redeploy

---

## Custom Domain Setup

If you have a custom domain (e.g., doanhoang.com):

### For GitHub Pages:
1. Settings → Pages → Custom domain
2. Enter: `yourdomain.com`
3. Update your domain's DNS:
   - Add A record pointing to GitHub IPs
   - Or add CNAME: `YOUR_USERNAME.github.io`

### For Vercel/Netlify:
- Both platforms provide DNS setup in their dashboard
- Usually just add CNAME records they specify

---

## Next Steps

1. **Choose your platform** (GitHub Pages for simplicity, Vercel for advanced features)
2. **Push your code**
3. **Deploy** (usually one-click)
4. **Test everything**
5. **Share your portfolio!**

Need help? Check the platform's documentation:
- GitHub Pages: docs.github.com/en/pages
- Vercel: vercel.com/docs
- Netlify: docs.netlify.com

---

## Troubleshooting

**Site shows 404:**
- GitHub Pages: Ensure repository name is `USERNAME.github.io` and it's public
- Vercel/Netlify: Check deployment logs for build errors

**Images don't load:**
- Ensure WebP files exist in `/assets/` folder
- Check file names match exactly (case-sensitive)
- Use absolute paths: `/assets/image.webp`

**Styles look weird:**
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS file path is correct: `/css/style.css`
- Verify MIME type in Network tab

**JavaScript doesn't work:**
- Check Console (F12) for errors
- Ensure `/js/main.js` loads
- Verify all external libraries (GSAP, Three.js) load from CDN

---

Good luck! Your portfolio is amazing. You've got this! 🚀
