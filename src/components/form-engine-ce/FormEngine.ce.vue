<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import FieldInput from '@/components/form-engine-ce/FieldInput.ce.vue'
import FieldTextarea from '@/components/form-engine-ce/FieldTextarea.ce.vue'
import FieldSelect from '@/components/form-engine-ce/FieldSelect.ce.vue'
import FieldCheckbox from '@/components/form-engine-ce/FieldCheckbox.ce.vue'
import FieldToggle from '@/components/form-engine-ce/FieldToggle.ce.vue'
import FieldFile from '@/components/form-engine-ce/FieldFile.ce.vue'
import FieldLink from '@/components/form-engine-ce/FieldLink.ce.vue'
import FieldRadio from '@/components/form-engine-ce/FieldRadio.ce.vue'
import FieldAsyncSelect from '@/components/form-engine-ce/FieldAsyncSelect.ce.vue'
import FieldCustom from '@/components/form-engine-ce/FieldCustom.ce.vue'

import FormPageHeader from '@/components/form-engine-ce/FormPageHeader.ce.vue'
import FormSectionHeader from '@/components/form-engine-ce/FormSectionHeader.ce.vue'
import FormActions from '@/components/form-engine-ce/FormActions.ce.vue'

import type { OuterHeadingBlock, Field, FormHeadingBlock, ButtonBlock, FieldComponent, FieldGrid, FieldBase, ValidationRule } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

// Props
const props = defineProps<{
  genericPageHeader?: OuterHeadingBlock
  genericFormSectionHeader?: FormHeadingBlock
  genericFormFields: Field[]
  genericActionButtons?: ButtonBlock
}>()

//Emits
const emit = defineEmits<{
  (e: 'submit', payload: Record<string, any>): void
}>()

// Local form state (you can enhance this later with validation, etc.)
const formState = reactive<Record<string, any>>({})
const formErrors = reactive<Record<string, string | null>>({})

// Components map
const getComponent = (type?: FieldComponent) => ({
  input: FieldInput,
  textarea: FieldTextarea,
  select: FieldSelect,
  checkbox: FieldCheckbox,
  radio: FieldRadio,
  toggle: FieldToggle,
  file: FieldFile,
  link: FieldLink,
  custom: FieldCustom,
  asyncSelect: FieldAsyncSelect,
})[type ?? 'input']

// Conditional visibility check
const isVisible = (field: FieldBase): boolean => {
  if (!field.condition) return true
  const { field: dependency, value, operator = 'equals' } = field.condition
  const target = formState[dependency]

  switch (operator) {
    case 'equals': return target === value
    case 'notEquals': return target !== value
    case 'includes': return Array.isArray(target) && target.includes(value)
    case 'greaterThan': return target > value
    case 'lessThan': return target < value
    default: return true
  }
}

// function isFieldBase(field: Field): field is FieldBase {
//   return 'component' in field
// }


const isPreviewVisible = ref(false)

function togglePreview() {
  isPreviewVisible.value = !isPreviewVisible.value
  console.log("isPreviewVisible.value", isPreviewVisible.value)
}

const previewData = computed(() => {
  // Clone formState and handle File objects (if any)
  const clone: Record<string, any> = {}
  for (const key in formState) {
    const val = formState[key]
    clone[key] = val instanceof File ? `[File: ${val.name}]` : val
  }
  return clone
})


function isValidValidatorInput(val: unknown): val is string | number | boolean {
  return ['string', 'number', 'boolean'].includes(typeof val)
}

// A utility function to validate a single field
function validateField(name: string, value: unknown, rules?: ValidationRule): string | null {
  if (!rules) return null

  // Required check
  if (rules.required && (value === undefined || value === null || value === '')) {
    return rules.customMessage || 'This field is required.'
  }

  // Pattern match
  if (rules.pattern && typeof value === 'string') {
    const regex = typeof rules.pattern === 'string' ? new RegExp(rules.pattern) : rules.pattern
    if (!regex.test(value)) {
      return rules.customMessage || 'Invalid format.'
    }
  }

  // Min length
  if (typeof rules.minLength === 'number' && typeof value === 'string') {
    if (value.length < rules.minLength) {
      return rules.customMessage || `Minimum length is ${rules.minLength}.`
    }
  }

  // Max length
  if (typeof rules.maxLength === 'number' && typeof value === 'string') {
    if (value.length > rules.maxLength) {
      return rules.customMessage || `Maximum length is ${rules.maxLength}.`
    }
  }

  // Min/max numeric or date
  if ((typeof rules.min === 'number' || typeof rules.min === 'string') && value !== '') {
    if (typeof value === 'number' || typeof value === 'string') {
      if (value < rules.min) {
        return rules.customMessage || `Minimum value is ${rules.min}.`
      }
    }
  }

  if ((typeof rules.max === 'number' || typeof rules.max === 'string') && value !== '') {
    if (typeof value === 'number' || typeof value === 'string') {
      if (value > rules.max) {
        return rules.customMessage || `Maximum value is ${rules.max}.`
      }
    }
  }

  // File maxSize in MB
  if (rules.maxSize && value instanceof File) {
    const sizeMB = value.size / (1024 * 1024)
    if (sizeMB > rules.maxSize) {
      return rules.customMessage || `File size must be under ${rules.maxSize} MB.`
    }
  }

  // Custom validator
  if (isValidValidatorInput(value) && typeof rules.customValidator === 'function') {
    const result = rules.customValidator(value)
    if (result !== true) {
      return typeof result === 'string' ? result : rules.customMessage || 'Invalid.'
    }
  }


  return null
}

// Type guards
function isFieldGrid(field: Field): field is FieldGrid {
  return (field as FieldGrid).grid === true;
}

function isFieldBase(field: Field): field is FieldBase {
  return (field as FieldBase).grid === false || (field as FieldBase).grid === undefined;
}



function validateForm(fields: Field[]): boolean {
  let isValid = true;

  // Clear all errors: This ensures it's a fresh start
  for (const key in formErrors) {
    formErrors[key] = null;  // Reset each error to null
  }

  const allFields: FieldBase[] = [];

  fields.forEach((field) => {
    if (isFieldGrid(field)) {
      allFields.push(...field.children.filter(isFieldBase));
    } else if (isFieldBase(field)) {
      allFields.push(field);
    }
  });

  for (const field of allFields) {
    if (!isVisible(field)) continue;

    const value = formState[field.name!];
    const error = validateField(field.name!, value, field.validation);
    if (error) {
      formErrors[field.name!] = error;  // Set error message
      isValid = false;
    } else {
      formErrors[field.name!] = null;  // Clear error message if valid
    }
  }

  return isValid;
}


const handleSubmit = () => {
  const valid = validateForm(props.genericFormFields)
  if (!valid) {
    console.warn('Validation failed:', formErrors)
    return
  }

  console.log('Submitting form from webcomponent', formState)
  emit('submit', formState)
}

const handleReset = () => {
  // Reset all field values that were used
  for (const key in formState) {
    formState[key] = null // Or set to default value if needed
  }

  // Clear all validation errors
  for (const key in formErrors) {
    formErrors[key] = null
  }

  // Optionally, reset any other states or variables related to the form
  isPreviewVisible.value = false // Hide preview on reset
  //previewData.value = {} // Explicitly clear preview data (if needed)

  console.log('Form has been reset.')
}



const handleCustomAction = (actionId: string) => {
  if (actionId === 'previewForm') {
    togglePreview()
  } else {
    console.log(`Custom action triggered: ${actionId}`)
  }
}

function clearError(fieldName: string) {
  // Clear the error for the specific field
  formErrors[fieldName] = null
}

</script>

<template>
  <form class="form-engine">
    <!-- Page Header -->
    <FormPageHeader v-if="genericPageHeader" :block="genericPageHeader" />

    <!-- Section Header -->
    <FormSectionHeader v-if="genericFormSectionHeader" :block="genericFormSectionHeader" />

    <!-- Form Fields -->
    <div class="form-fields">
      <template v-for="(field, index) in genericFormFields" :key="index">
        <!-- Grid Field -->
        <div v-if="'grid' in field && (field as FieldGrid).grid" class="field-grid">
          <template v-for="(child, i) in (field as FieldGrid).children" :key="i">
            <component v-if="isFieldBase(child) && isVisible(child)" :is="getComponent(child.component)" :field="child"
              :modelValue="formState[child.name!]" :error="formErrors[child.name!]"
              @update:modelValue="formState[child.name!] = $event" @input="clearError(child.name!)" />
          </template>
        </div>

        <!-- Non-grid Field -->
        <component v-else-if="isFieldBase(field) && isVisible(field)" :is="getComponent(field.component)" :field="field"
          :modelValue="formState[field.name!]" :error="formErrors[field.name!]"
          @update:modelValue="formState[field.name!] = $event" @input="clearError(field.name!)" />
      </template>
    </div>

    <!-- Action Buttons -->
    <FormActions v-if="genericActionButtons" :buttons="genericActionButtons.buttons" :link="genericActionButtons.link"
      :isSubmitting="false" :onSubmit="handleSubmit" :onReset="handleReset" @custom-action="handleCustomAction" />
  </form>
  <div v-if="isPreviewVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>Preview Form Data</h3>
      <pre>{{ previewData }}</pre>
      <button @click="togglePreview()">Close</button>
    </div>
  </div>
</template>

<style scoped>
.form-engine {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
  background-color: #e5f1f1;
  border-radius: 0.5rem;
  box-shadow: 0 0.0625rem 0.375rem rgba(0, 0, 0, 0.1);
  border: 0.125rem solid teal;
  transition: background 0.3s ease, color 0.3s ease;
}

@media (prefers-color-scheme: dark) {
  .form-engine {
    background-color: #577171;
    border-color: #089393;
  }
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 1rem;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background-color: #e5f1f1;
  color: black;
  padding: 1.5rem;
  border-radius: 0.5rem;
  max-width: 36rem;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.modal-content pre {
  background: #d0e6e6;
  padding: 1rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-content button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: teal;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: 600;
}

.modal-content button:hover {
  background-color: #006666;
}

@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: #577171;
    color: #f1f1f1;
  }

  .modal-content pre {
    background: #475c5c;
  }
}

/* Responsive breakpoints */
@media (max-width: 320px) {
  html {
    font-size: 87.5%;
    /* 14px base */
  }

  body {
    padding: 0.5rem;
    /* Reduce padding on small screens */
  }

  .grid {
    display: block;
  }

  .grid>* {
    margin-bottom: 1rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .form-engine {
    padding: 0.75rem;
    gap: 1rem;
  }

  .field-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 1.25rem;
    font-size: 0.875rem;
  }

  .modal-content h3 {
    font-size: 1.125rem;
  }
}

@media (min-width: 769px) {
  .form-engine {
    padding: 1rem;
    gap: 1.5rem;
  }

  .field-grid {
    grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  }

  .modal-content {
    padding: 1.5rem;
    font-size: 1rem;
  }

  .modal-content h3 {
    font-size: 1.25rem;
  }
}
</style>
