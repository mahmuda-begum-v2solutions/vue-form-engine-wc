<script setup lang="ts">
import { computed } from 'vue'
import type { BaseProps, FieldOption } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

const props = defineProps<{
  modelValue?: string | number | boolean | string[] // Allowing array for multiple values
  error?: string | null
  field: {
    label?: string
    props?: BaseProps
    options: FieldOption[] // Options can be an array of objects or strings
    helpText?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const selectId = computed(() => {
  return props.field.props?.id || props.field.props?.name || `select-field-${Math.random().toString(36).substring(2, 15)}`
})

const hasError = computed(() => !!props.error)

const selectValue = computed({
  get: () => props.modelValue ?? (props.field.props?.multiple ? [] : ''), // Defaulting to empty array for multiple selections
  set: (val: string | number | boolean | string[]) => {
    emit('update:modelValue', val)
  }
})

const isOptionObject = (option: FieldOption): option is { label: string; value: string | number | boolean } => {
  return typeof option === 'object' && option !== null && 'label' in option && 'value' in option
}

</script>

<template>
  <div class="field-wrapper">
    <label v-if="field.label" :for="selectId" class="field-label">
      {{ field.label }}
    </label>

    <div class="select-wrapper">
      <!-- Conditionally add 'multiple' if field.props?.multiple is true -->
      <select :id="selectId" :name="selectId" v-model="selectValue" :disabled="field.props?.disabled"
        :readonly="field.props?.readonly" :class="['field-select', { error: hasError }]"
        :multiple="field.props?.multiple">
        <!-- Disabled default option as placeholder -->
        <option value="" disabled selected>
          Select {{ field.label }}
        </option>

        <option v-for="(option, index) in field.options" :key="index"
          :value="isOptionObject(option) ? option.value : option">
          {{ isOptionObject(option) ? option.label : option }}
        </option>
      </select>
      <span class="custom-arrow">&#9660;</span>
    </div>

    <p v-if="hasError && error" class="field-error">
      {{ error }}
    </p>

    <p v-if="field.helpText && !hasError" class="field-help">
      {{ field.helpText }}
    </p>
  </div>
</template>

<style scoped>
.field-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 1rem;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.field-select {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  background-color: #fff;
  color: inherit;
  appearance: none;
  transition: all 0.3s ease;
}

.field-select::-ms-expand {
  display: none;
}

.field-select.error {
  border-color: #f44336;
}

.field-error {
  color: #f44336;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.field-help {
  color: #888;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.custom-arrow {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  color: #888;
  pointer-events: none;
  z-index: 1;
  transition: transform 0.2s ease-in-out;
}

.field-select:focus+.custom-arrow,
.field-select:active+.custom-arrow {
  transform: translateY(-50%) rotate(180deg);
}

@media (prefers-color-scheme: dark) {

  /* Ensure the select box appearance is fully customized */
  .field-select {
    background-color: #333 !important;
    /* Dark background */
    color: #fff !important;
    /* White text */
    border-color: #555 !important;
    /* Lighter border */
    appearance: none;
    /* Remove system appearance */
  }

  .field-select:focus {
    outline-color: #2196F3;
    /* Optional focus outline color */
  }

  .field-error {
    color: #f44336;
  }

  .field-help {
    color: #bbb;
  }

  .field-label {
    color: #fff;
  }

  .custom-arrow {
    color: #fff;
  }
}

@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
  }

  .field-select {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
  }

  .custom-arrow {
    font-size: 1.125rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
  }

  .field-select {
    font-size: 0.9375rem;
    padding: 0.625rem 0.875rem;
  }

  .custom-arrow {
    font-size: 1.25rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
  }

  .field-select {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }

  .custom-arrow {
    font-size: 1.25rem;
  }
}
</style>
