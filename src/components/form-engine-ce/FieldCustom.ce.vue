<script setup lang="ts">
import { computed } from 'vue'
import type { FieldOption } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

const props = defineProps<{
  modelValue?: string | number | boolean,
  error?: string | null, // error prop from parent
  field: {
    label?: string
    type: string
    helpText?: string
    options?: FieldOption[]
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    errorMessage?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const fieldId = computed(() =>
  props.field.label
    ? props.field.label.toLowerCase().replace(/\s+/g, '-') + '-field'
    : 'custom-field'
)

const hasError = computed(() => !!props.error || !!props.field.errorMessage)

const isOptionValue = (option: FieldOption): option is { label: string; value: string | number | boolean } =>
  typeof option !== 'string' && 'label' in option && 'value' in option

const inputValue = computed({
  get: () =>
    props.modelValue === true || props.modelValue === false
      ? String(props.modelValue)
      : props.modelValue ?? '',
  set: (val: string | number | boolean) => {
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <div class="field-wrapper">
    <div class="field-label-help">
      <label v-if="field.label" :for="fieldId" class="field-label">
        {{ field.label }}
      </label>
      <span v-if="field.helpText && !hasError" class="field-help inline">{{ field.helpText }}</span>
    </div>

    <!-- Text input -->
    <template v-if="field.type === 'text'">
      <input :id="fieldId" :name="fieldId" v-model="inputValue" type="text" :placeholder="field.placeholder"
        :disabled="field.disabled" :readonly="field.readonly" class="field-input" />
    </template>

    <!-- Select input -->
    <template v-if="field.type === 'select'">
      <select :id="fieldId" :name="fieldId" v-model="inputValue" :disabled="field.disabled" :readonly="field.readonly"
        class="field-select">
        <option value="">Select an option</option>
        <option v-for="(option, index) in field.options" :key="index"
          :value="isOptionValue(option) ? option.value : option">
          {{ isOptionValue(option) ? option.label : option }}
        </option>
      </select>
    </template>

    <!-- Textarea input -->
    <template v-if="field.type === 'textarea'">
      <textarea :id="fieldId" :name="fieldId" v-model="inputValue" :placeholder="field.placeholder"
        :disabled="field.disabled" :readonly="field.readonly" class="field-textarea" />
    </template>

    <!-- Error message -->
    <p v-if="hasError" class="field-error">{{ error || field.errorMessage }}</p>
  </div>
</template>

<style scoped>
/* General Styling */
.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.field-label-help {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.field-help.inline {
  font-style: italic;
  font-size: 0.85rem;
  color: #666;
}

.field-label {
  font-weight: bold;
  font-size: 1rem;
}

.field-input,
.field-select,
.field-textarea {
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  background-color: #fff;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 1rem;
}

.field-error {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.field-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.field-textarea {
  height: 6rem;
}

/* Dark Mode Styling */
@media (prefers-color-scheme: dark) {

  .field-input,
  .field-select,
  .field-textarea {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }

  .field-error {
    color: #f44336;
  }

  .field-help.inline {
    color: #bbb;
  }

  .field-label {
    color: #fff;
  }
}

/* Mobile Responsiveness */
@media (max-width: 320px) {

  .field-input,
  .field-select,
  .field-textarea {
    font-size: 0.75rem;
    padding: 0.625rem 0.75rem;
  }

  .field-label {
    font-size: 0.75rem;
  }
}

/* Tablet Responsiveness */
@media (min-width: 321px) and (max-width: 768px) {

  .field-input,
  .field-select,
  .field-textarea {
    font-size: 0.875rem;
  }
}

/* Desktop Responsiveness */
@media (min-width: 769px) {

  .field-input,
  .field-select,
  .field-textarea {
    font-size: 1rem;
  }
}
</style>
