PLACEHOLDER IMAGES — REPLACE BEFORE LAUNCH

These files were meant to be downloaded from the current store (stashandstyle.store) as stand-ins.
In the build environment that download was blocked, so every image here is a GENERATED stand-in:
a rendered studio-style jewelry ILLUSTRATION (scripts/render-demo-images.mjs), not a photo.
No logo file is present; the header uses a text wordmark.

Before launch, replace them with photos you own or have the rights to use:
  1. Put your image in this folder using the same file name (or a new one).
  2. Run `npm run brand:fetch` to retry the store download, OR edit data/brand-images.json by hand:
     set "src", "width", "height", write a short "alt" describing the photo, and set "placeholder": false.
  3. Rebuild.

hero-lifestyle.jpg      Slideshow, slide 1 (2000×1250 or larger, landscape)
slide-stack.jpg         Slideshow, slide 2
slide-gifts.jpg         Slideshow, slide 3
bracelets-feature.jpg   Bracelets tile
rings-seasonal.jpg      Rings tile
elegance-set.jpg        Elegance Set tile
earrings-promo.jpg      Earrings tile
bracelets-promo.jpg     Spare bracelet image (not currently used on a page)
fresh-gems.jpg          Home "Layer it up" banner + About page image
logo.png                (missing) transparent logo; header/footer fall back to the wordmark
