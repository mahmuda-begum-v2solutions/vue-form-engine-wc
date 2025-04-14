### vue-form-engine-wc

## 🛠️ Locally Using This Web Component

If you'd like to test or develop this Web Component locally using a separate Vue project (e.g., `vue-form-engine-demo`), follow these steps:

---

### 📁 Folder Structure

├── vue-form-engine-wc/

# Web Component project (this repo)

└── vue-form-engine-demo/

# Vue app to consume the component locally

---

### 🚀 Build the Web Component

In the `vue-form-engine-wc` directory, run the following command to clean and build the Web Component:

```bash
npm run clean-build-wc
```

This script will:

Remove the previous build output from dist/

Build the Web Component in webcomponent mode

### 📦 Copy the Built Component into the Demo Project

To copy the built file into your local consumer app (vue-form-engine-demo), run:

```bash
npm run clean-create-copy-wc
```

This will:

Remove the old version from the demo project

Recreate the public/web-components/ folder in the demo

Copy the new component files from dist/ into it

### 🔗 Use the Web Component in Your Vue Demo App

In your vue-form-engine-demo, import and use the component like this:

public/index.html

```bash
<script type="module" src="/web-components/my-web-components.js"></script>
```

AnyComponent.vue

```bash
<template>
  <base-button label="Click Me from Web Component" />
</template>
```

✅ Make sure you're using the correct tag name (base-button, or whatever you registered) and that the JS file is copied to the correct path in public/.

---

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
