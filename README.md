# 🌟 Creative Webflow & Frontend Developer Portfolio

> Inspired by the award-winning **Lissan Haider / FlowDesign** dark luxury aesthetic. Built with vanilla HTML5, modern CSS3, and high-performance Canvas motion effects.

---

## 🚀 Quick Start (Opening in VS Code)

1. **Extract the ZIP file** to any folder on your computer.
2. Open **VS Code**, then click **File → Open Folder...** and select `dark-motion-portfolio`.
3. To preview in your browser:
   * **Option A**: Double-click [`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html) in your file explorer.
   * **Option B (Recommended)**: Install the **Live Server** extension in VS Code, right-click `index.html`, and select **"Open with Live Server"**.

---

## 📋 What You Need To Customize (Step-by-Step)

Here is everything you can edit directly in VS Code to make this portfolio 100% your own:

### 1. Personal Branding & Bio ([`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html))
* **Logo Name**: Search for `FLOWCRAFT` in `index.html` (Lines 43 & 457) and replace it with your own brand name or initials.
* **Hero Headline**: Lines 85–88 (`Your Invisible Webflow Partner`).
* **Hero Subtitle**: Lines 90–93 (Edit your elevator pitch for clients or agency partners).
* **Announcement Bar**: Lines 24–38 (Customize top marquee highlights like `Available for Projects`, `Figma to Code`, etc.).

### 2. Your 4 Web Projects / Case Studies ([`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html) & [`app.js`](file:///d:/Newfiles/dark-motion-portfolio/app.js))
* In [`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html#L210), replace the 4 project cards with your own:
  1. Project 1: e.g. HR Consultant Portfolio / SaaS
  2. Project 2: e.g. E-Commerce / Boutique Store
  3. Project 3: e.g. Local Business / Restaurant or Gym
  4. Project 4: e.g. Creative Agency / Studio Site
* In [`app.js`](file:///d:/Newfiles/dark-motion-portfolio/app.js#L182), edit `caseStudyData` to customize the detailed modal popups with the exact problem, solution, and results (e.g., *"+42% conversions"*, *"99 Lighthouse speed"*).

### 3. Pricing Calculator Rates ([`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html#L350) & [`app.js`](file:///d:/Newfiles/dark-motion-portfolio/app.js#L55))
* By default, it uses standard industry rates ($50 standard section, $100 complex CMS section, $50 custom animation).
* You can adjust these base prices directly in `app.js` under the `updatePricing()` function.

### 4. Client Testimonials ([`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html#L425))
* Replace the 3 quotes with feedback from past clients, colleagues, or agency founders.

### 5. Contact Form / Inquiries ([`index.html`](file:///d:/Newfiles/dark-motion-portfolio/index.html#L520))
* Currently, form submissions are captured locally and saved in browser `localStorage`.
* To receive real emails straight to your inbox, connect a free service like [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com):
  ```html
  <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  ```

---

## 🎨 Motion & Visual Effects Breakdown

### 🌌 1. Interactive Fluid Canvas Motion (`background-motion.js`)
* **What it does**: Generates fluid multi-color celestial gradient orbs and glowing light motes that respond dynamically to mouse movement.
* **How to customize colors**:
  Open [`background-motion.js`](file:///d:/Newfiles/dark-motion-portfolio/background-motion.js#L35) and tweak the RGBA values in `orbs`:
  * Electric Royal Blue: `rgba(37, 72, 196, 0.42)`
  * Deep Indigo/Violet: `rgba(92, 45, 175, 0.38)`
  * Ethereal Cyan: `rgba(14, 116, 144, 0.32)`
* **Performance**: Runs smoothly on compositor thread at 60 FPS, throttles on inactive tabs, and respects `prefers-reduced-motion`. Includes a user toggle button in the navbar!

### ✨ 2. Glowing Spline Cursor Ribbon (`cursor-trail.js`)
* Velocity-weighted quadratic spline ribbon trail with luminous blue glow blur that tracks cursor speed. Automatically hides on mobile/touch screens.

### 🔄 3. Rotating Conic Glowing Borders (`style.css`)
* CSS `conic-gradient` animation running around the pill badge in the hero section for a luxury futuristic finish.

---

## 🌐 Free 1-Minute Deployment Options

Once you've customized your copy in VS Code, push your site live:
1. **Netlify**: Drag and drop the `dark-motion-portfolio` folder directly into [app.netlify.com/drop](https://app.netlify.com/drop).
2. **Vercel**: Run `npx vercel` inside the folder.
3. **GitHub Pages**: Push to a repository and enable Pages in repository settings.
