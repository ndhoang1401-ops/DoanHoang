# WebP Image Conversion Guide

Your portfolio references the following WebP images that need to be created:
- `assets/anime.webp` (used in hero section)
- `assets/anime2.webp` (used in about section)
- `assets/anime3.webp` (used in skills section)
- `assets/anime4.webp` (used in testimonials section)
- `assets/blog1.webp` (blog post thumbnail)
- `assets/blog2.webp` (blog post thumbnail)
- `assets/blog3.webp` (blog post thumbnail)

## Quick Conversion Options

### Option 1: Using FFmpeg (Recommended)
```bash
ffmpeg -i assets/anime.gif -c:v libwebp -quality 80 assets/anime.webp
```

### Option 2: Using Online Tools
1. Visit [CloudConvert.com](https://cloudconvert.com/)
2. Upload your GIF files
3. Select WebP as output format
4. Download converted files

### Option 3: Using ImageMagick
```bash
convert assets/anime.gif -define webp:quality=80 assets/anime.webp
```

## Temporary Solution
If you don't have the original GIF files, the portfolio will use fallback images:
- Avatar spinner in hero section
- Existing color gradients as backgrounds

All images have `onerror` handlers that gracefully handle missing files.

## For Deployment
The blog images can be simple placeholders initially:
- `blog1.webp` - SKR-hub launch (code screenshot or gradient)
- `blog2.webp` - Calisthenics (fitness-themed image)
- `blog3.webp` - Chemistry (molecular structure or educational image)

You can add real images later. The portfolio works without them!
