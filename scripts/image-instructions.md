# 📸 Image Generation Instructions

This guide will help you generate the required responsive image variants for your carnaval gallery.

## 🎯 What You Need

For each `carnaval{N}@2x.png` image, you need to create:

### PNG Variants:
- `carnaval{N}@1x.png` (50% of @2x size)
- `carnaval{N}@1.5x.png` (75% of @2x size)
- `carnaval{N}@2x.png` (already exists)

### WebP Variants:
- `carnaval{N}@1x.webp`
- `carnaval{N}@1.5x.webp`
- `carnaval{N}@2x.webp`

## 🛠️ Method 1: Using the Automated Script

1. Install required tools:
   ```bash
   # macOS
   brew install imagemagick webp
   
   # Ubuntu/Debian
   sudo apt-get install imagemagick webp
   
   # Windows (use PowerShell as admin)
   # Download ImageMagick from: https://imagemagick.org/script/download.php
   # Download WebP tools from: https://developers.google.com/speed/webp/download
   ```

2. Run the generation script:
   ```bash
   ./scripts/generate-images.sh
   ```

## 🎨 Method 2: Using Online Tools

If you prefer using online tools:

### For PNG Resizing:
1. Go to [TinyPNG](https://tinypng.com/) or [ImageResizer](https://imageresizer.com/)
2. Upload each `@2x.png` file
3. Resize to create @1x (50% size) and @1.5x (75% size) versions

### For WebP Conversion:
1. Go to [CloudConvert](https://cloudconvert.com/png-to-webp)
2. Upload all PNG files (1x, 1.5x, 2x)
3. Convert to WebP format with 85% quality

## 🎨 Method 3: Using Photoshop/GIMP

### Adobe Photoshop:
1. Open each `@2x.png` file
2. Save copies with Image Size adjustments:
   - @1x: 50% of original size
   - @1.5x: 75% of original size
3. Export as WebP using "Export As" > WebP (85% quality)

### GIMP (Free):
1. Open each `@2x.png` file
2. Scale Image to create variants:
   - @1x: 50% of original size
   - @1.5x: 75% of original size
3. Export as WebP format

## 📁 Expected File Structure

After generation, your `/public/images/` folder should contain:

```
public/images/
├── carnaval1@1x.png
├── carnaval1@1x.webp
├── carnaval1@1.5x.png
├── carnaval1@1.5x.webp
├── carnaval1@2x.png
├── carnaval1@2x.webp
├── carnaval2@1x.png
├── carnaval2@1x.webp
├── carnaval2@1.5x.png
├── carnaval2@1.5x.webp
├── carnaval2@2x.png
├── carnaval2@2x.webp
└── ... (repeat for carnaval3 through carnaval12)
```

## ⚙️ Quality Settings

- **PNG**: Use original quality or 95% for resized versions
- **WebP**: Use 85% quality for good balance of size/quality

## 🔍 Testing

After generation, test the Gallery component:
1. Open your application in a browser
2. Check Developer Tools > Network tab
3. Verify that appropriate image sizes are being loaded based on screen size
4. Confirm WebP images are served to supporting browsers

## 📊 Expected Performance Gains

- **File Size Reduction**: 25-35% with WebP format
- **Loading Speed**: 40-60% faster on mobile devices
- **Bandwidth Savings**: Significant reduction for users on mobile networks