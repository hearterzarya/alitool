# Extension Icons

## Required Icons

The extension requires 3 icon sizes:
- **icon16.png** - 16x16 pixels (toolbar icon)
- **icon48.png** - 48x48 pixels (extensions page)
- **icon128.png** - 128x128 pixels (Chrome Web Store)

## Creating Icons

### Option 1: Use Online Tools
1. Go to [Canva](https://www.canva.com)
2. Create a square design (512x512)
3. Add GrowTools logo or rocket emoji 🚀
4. Use gradient colors: #667eea to #764ba2
5. Export as PNG
6. Resize to 16x16, 48x48, and 128x128

### Option 2: Use Figma
1. Create new frame (512x512)
2. Add background gradient
3. Add logo/icon
4. Export as PNG at different sizes

### Option 3: Use ImageMagick (Command Line)
```bash
# Install ImageMagick
brew install imagemagick

# Create base icon (using emoji as placeholder)
convert -size 512x512 xc:'#667eea' \
  -font Arial -pointsize 400 -fill white \
  -gravity center -annotate +0+0 '🚀' \
  base-icon.png

# Resize to required sizes
convert base-icon.png -resize 16x16 icon16.png
convert base-icon.png -resize 48x48 icon48.png
convert base-icon.png -resize 128x128 icon128.png
```

### Option 4: Use SVG Template (Provided)
See `icon-template.svg` in this directory.

## Temporary Placeholder

For development, you can use emoji as placeholders:
1. Open any emoji-to-image tool
2. Convert 🚀 emoji to image
3. Resize to required dimensions

## Design Guidelines

- **Colors**: Use purple gradient (#667eea to #764ba2)
- **Style**: Modern, clean, minimal
- **Symbol**: Rocket 🚀 or "GT" letters
- **Background**: Solid or gradient, no transparency
- **Format**: PNG with transparent edges if needed

## Current Status

⚠️ **Icons not yet created** - Extension will work but show default Chrome icon.

To use the extension in development mode, you can skip icons temporarily.
For production release, proper icons are required.
