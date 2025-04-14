### vue-form-engine-wc

A lightweight, customizable Vue Web Component for building dynamic forms. Easily integrates into any Vue-based application with minimal setup.

## Installation

To install the package, you can use npm or yarn:

```bash
npm install vue-form-engine-wc
```

or

```bash
yarn add vue-form-engine-wc
```

### Usage

1. Install and import the component
   After installing the package, import the web component in your Vue project:

```bash
<script setup lang="ts">
import 'vue-form-engine-wc';
</script>

<template>
  <div>
    <form-engine label="Basic Form" />
  </div>
</template>
```

2. Customization
   You can pass props to customize the form engine, such as the label for the form, type, and more.

```bash
<template>
  <form-engine label="Custom Form" type="text" />
</template>
```

3. Styling
   The form engine component uses the Shadow DOM, so styles inside the component are scoped and independent of the parent app styles. If you want to style the form further, use custom styles inside the Shadow DOM.

4. Adding Form Fields
   You can dynamically create form fields by passing data via props or customize your form via slots.

```bash
<template>
  <form-engine>
    <template #fields>
      <input type="text" placeholder="Enter name" />
      <input type="email" placeholder="Enter email" />
    </template>
  </form-engine>
</template>
```
