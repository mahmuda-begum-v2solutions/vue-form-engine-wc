<script setup lang="ts">
import FormEngine from '@/components/form-engine/FormEngine.vue'

// Importing the dummy JSONs
import genericPageHeader from '@/jsons/test/genericPageHeader.json'
import genericFormSectionHeader from '@/jsons/test/genericFormSectionHeader.json'
import genericFormFields from '@/jsons/test/genericFormFields.json'
import genericActionButtons from '@/jsons/test/genericActionButtons.json'

// Importing types
import type { OuterHeadingBlock, Field, FormHeadingBlock, ButtonBlock } from '@/types/formTypes.ts'

// Typecasting the imported JSON to the respective types
const genericPageHeaderProp: OuterHeadingBlock = genericPageHeader as OuterHeadingBlock;
const genericFormSectionHeaderProp: FormHeadingBlock = genericFormSectionHeader as FormHeadingBlock;
const genericFormFieldsProp: Field[] = genericFormFields as Field[];
const genericActionButtonsProp: ButtonBlock = genericActionButtons as ButtonBlock;

const handleFormSubmit = (data: Record<string, any>) => {
  console.log('Received form data from FormEngine:', data)
}

</script>

<template>
  <div class="container">
    <div class="form-wrapper">
      <!-- Passing the props to FormEngine component -->
      <FormEngine :genericPageHeader="genericPageHeaderProp" :genericFormSectionHeader="genericFormSectionHeaderProp"
        :genericFormFields="genericFormFieldsProp" :genericActionButtons="genericActionButtonsProp"
        @submit="handleFormSubmit" />
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 64rem;
  /* 1024px */
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  padding: 1rem;
  /* Default padding */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-wrapper {
  height: 70vh;
  /* 500px */
  overflow-x: auto;
  scroll-behavior: smooth;

  /* Firefox */
  scrollbar-color: #596373 transparent;
  scrollbar-width: thin;
}

/* WebKit Browsers */
.form-wrapper::-webkit-scrollbar {
  height: 0.375rem;
  /* 6px */
  width: 0.375rem;
}

.form-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.form-wrapper::-webkit-scrollbar-thumb {
  background-color: #596373;
  border-radius: 0.25rem;
  /* 4px */
}

.form-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #596373;
}

/* Responsive padding adjustments */
@media (max-width: 320px) {
  .container {
    padding: 0.5rem;
    /* Smaller padding on tiny screens */
    align-items: start;
  }

  .form-wrapper {
    height: 100vh;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .container {
    padding: 0.5rem;
    /* Medium padding for tablets */
    align-items: start;
  }

  .form-wrapper {
    height: 100vh;
  }
}
</style>
