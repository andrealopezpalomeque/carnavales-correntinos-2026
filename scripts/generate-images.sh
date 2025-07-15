#!/bin/bash

# Image generation script for carnaval gallery
# This script generates @1x, @1.5x versions and WebP formats for all carnaval images

echo "🖼️  Starting image generation process..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it first:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    echo "   Windows: Download from https://imagemagick.org/script/download.php"
    exit 1
fi

# Check if cwebp is installed for WebP conversion
if ! command -v cwebp &> /dev/null; then
    echo "❌ cwebp not found. Please install it first:"
    echo "   macOS: brew install webp"
    echo "   Ubuntu: sudo apt-get install webp"
    echo "   Windows: Download from https://developers.google.com/speed/webp/download"
    exit 1
fi

# Navigate to images directory
cd "$(dirname "$0")/../public/images" || exit 1

echo "📁 Working in: $(pwd)"

# Process each carnaval image
for i in {1..12}; do
    original="carnaval${i}@2x.png"
    
    if [ ! -f "$original" ]; then
        echo "⚠️  Skipping $original - file not found"
        continue
    fi
    
    echo "🔄 Processing $original..."
    
    # Get original dimensions
    dimensions=$(identify -ping -format '%wx%h' "$original")
    width=$(echo $dimensions | cut -d'x' -f1)
    height=$(echo $dimensions | cut -d'x' -f2)
    
    echo "   Original size: ${width}x${height}"
    
    # Calculate @1x dimensions (50% of @2x)
    width_1x=$((width / 2))
    height_1x=$((height / 2))
    
    # Calculate @1.5x dimensions (75% of @2x)
    width_15x=$((width * 3 / 4))
    height_15x=$((height * 3 / 4))
    
    # Generate @1x PNG
    echo "   Generating carnaval${i}@1x.png (${width_1x}x${height_1x})"
    convert "$original" -resize "${width_1x}x${height_1x}" -quality 95 "carnaval${i}@1x.png"
    
    # Generate @1.5x PNG  
    echo "   Generating carnaval${i}@1.5x.png (${width_15x}x${height_15x})"
    convert "$original" -resize "${width_15x}x${height_15x}" -quality 95 "carnaval${i}@1.5x.png"
    
    # Generate WebP versions with high quality
    echo "   Generating WebP versions..."
    
    # @1x WebP
    cwebp -q 85 "carnaval${i}@1x.png" -o "carnaval${i}@1x.webp"
    
    # @1.5x WebP
    cwebp -q 85 "carnaval${i}@1.5x.png" -o "carnaval${i}@1.5x.webp"
    
    # @2x WebP
    cwebp -q 85 "$original" -o "carnaval${i}@2x.webp"
    
    echo "   ✅ Completed carnaval${i}"
done

echo ""
echo "📊 Generation Summary:"
echo "   Generated files:"
ls -la carnaval*@1x.* | wc -l | xargs echo "   @1x files:"
ls -la carnaval*@1.5x.* | wc -l | xargs echo "   @1.5x files:"
ls -la carnaval*@2x.* | wc -l | xargs echo "   @2x files:"
ls -la carnaval*.webp | wc -l | xargs echo "   WebP files:"

echo ""
echo "🎉 Image generation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review generated images for quality"
echo "   2. Update Gallery.vue component to use responsive images"
echo "   3. Test performance improvements"