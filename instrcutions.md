# Project Setup & Deployment Instructions

This guide provides the necessary steps to transition from a CDN-based setup to a professional local development environment and deploy to Netlify.

---

## 1. Local Tailwind CSS Installation (Removing CDN)

To remove the `<script src="https://cdn.tailwindcss.com"></script>` and use Tailwind properly for production:

### Step 1: Initialize Node Project
If you haven't already, run this in your project root:
```bash
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install -D tailwindcss postcss autoprefixer vite
```

### Step 3: Initialize Tailwind
```bash
npx tailwindcss init -p
```

### Step 4: Configure `tailwind.config.js`
Replace the content of the generated `tailwind.config.js` with this (extracted from your current site settings):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{ts,tsx}",
    "./constants.ts"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          yellow: '#FF6B00',
          gray: '#9CA3AF',
          light: '#E5E7EB',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      screens: {
        'xs': '480px',
        'laptop': '1366px',
      }
    },
  },
  plugins: [],
}
```

### Step 5: Create a Global CSS file
Create a file named `index.css` and add these directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-[#0D0D0D] text-[#E5E7EB] overflow-x-hidden;
    -webkit-tap-highlight-color: transparent;
  }
}

/* Add your custom scrollbar and animation styles here */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #0D0D0D; }
::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #FF6B00; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes highlightBlink {
  0% { border-color: #FF6B00; box-shadow: 0 0 0px #FF6B00; }
  50% { border-color: #FF6B00; box-shadow: 0 0 30px rgba(255, 107, 0, 0.4); }
  100% { border-color: #1F2937; box-shadow: 0 0 0px #FF6B00; }
}
.animate-highlight {
  animation: highlightBlink 1.5s ease-in-out 2;
}

.ambient-glow {
  background: radial-gradient(circle at center, rgba(255, 107, 0, 0.1) 0%, transparent 70%);
  pointer-events: none;
}
```

### Step 6: Import CSS in `index.tsx`
Add this line to the top of your `index.tsx`:
```typescript
import './index.css';
```

### Step 7: Clean up `index.html`
Remove the tailwind `<script>` tag and the `<style>` block. Your head should now simply include your fonts and a link to the script.

---

## 2. Netlify Configuration (`netlify.toml`)

Create a file named `netlify.toml` in your project root with the following content:

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Handling Single Page Application (SPA) routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Optional: Headers for security and caching
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "upgrade-insecure-requests"
```

---

## 3. Sitemap Setup (`sitemap.xml`)

Create a file named `sitemap.xml` and place it in your `public` folder (or root, depending on your build tool). Replace `https://dcnotes.com` with your actual domain.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dcnotes.com/</loc>
    <lastmod>2024-05-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```
