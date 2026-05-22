# 🚀 Creating a New React + Vite GitHub Pages Project (Branch-Based Setup)

This guide helps you quickly spin up a new React + Vite project inside a **new Git branch**, with GitHub Pages deployment using `gh-pages`.

---

# 1. Start with a new branch

Create and switch to your new branch:

```bash
git checkout branch-name
```

---

# 2. Clean the branch (only if needed)

If the branch contains leftover files, remove them:

```bash
rm -rf src public index.html package.json package-lock.json vite.config.ts
```

⚠️ Only run this if the branch is empty or you are sure you don’t need existing files.

---

# 3. Create a fresh Vite React app

Run:

```bash
npm create vite@latest .
```

Choose:

* React
* TypeScript

---

# 4. Install dependencies

```bash
npm install
```

---

# 5. Install GitHub Pages deploy tool

```bash
npm install gh-pages --save-dev
```

---

# 6. Configure `vite.config.ts`

Update your Vite config for GitHub Pages:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})
```

⚠️ If deploying under a repository (GitHub Pages project site), replace `/` with:

```
/your-repo-name/
```

---

# 7. Update `package.json`

Replace scripts with:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

---

# 8. Run development server

```bash
npm run dev
```

---

# 9. Commit your setup

```bash
git add .
git commit -m "Initial project setup"
git push origin branch-name
```

---

# 10. Deploy project

Still on your project branch:

```bash
npm run deploy
```

---

# What happens during deploy

* Builds the project (`vite build`)
* Creates production files in `/dist`
* Pushes `/dist` to the `gh-pages` branch
* GitHub Pages serves the live site from `gh-pages`

---

# ✅ Final structure

```
branch-name      → source code (React project)
gh-pages         → deployed static website
```

---

# ⚡ Notes

* You can repeat this process for multiple branches/projects
* Only one project can be live per repo on GitHub Pages (via `gh-pages` branch)
* Keeping the same setup across projects reduces confusion and setup time

<!--
To create a new page:

Start with an empty branch. 

Switch to your new branch
git checkout branch-name
2. Clean the branch (if needed)

If there are leftover files:

rm -rf src public index.html package.json package-lock.json vite.config.ts

(Only do this if it’s truly empty/unused.)

3. Create a fresh Vite React app inside this branch

Run:

npm create vite@latest .

Choose:

React
TypeScript

4. Install dependencies
npm install
5. Install GitHub Pages deploy tool
npm install gh-pages --save-dev
6. Configure vite.config.ts

This is required for GitHub Pages:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
})

7. Update package.json

Replace your scripts with:

"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "preview": "vite preview",
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

Run the dev server
npm run dev
10. Commit your setup
git add .
git commit -m "Initial portfolio setup"
git push origin branch-name
11. Deploy project

Still on project branch:

npm run deploy

This will:

build the project
push /dist to gh-pages
update your live site

-->
