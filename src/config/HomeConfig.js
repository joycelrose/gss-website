// HomeConfig.js
// Central config for homepage hero images (auto-imported with Vite)

// This will work if you move your images to src/assets/images/HomePage
// and use Vite's import.meta.glob to auto-import all images.

const heroImages = Object.entries(
  import.meta.glob('../assets/images/HomePage/*', { eager: true, as: 'url' })
).map(([path, src]) => {
  // Extract filename for caption
  const filename = path.split('/').pop();
  return {
    src,
    caption: filename.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, ''),
  };
});

export default heroImages;
