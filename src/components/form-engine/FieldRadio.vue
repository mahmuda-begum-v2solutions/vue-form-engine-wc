<script setup lang="ts">
import { computed } from 'vue'
import type { BaseProps } from '@/types/formTypes'

const props = defineProps<{
  modelValue?: string | number | boolean
  field: {
    label?: string
    props?: BaseProps
    helpText?: string
    options: { label: string; value: string | number | boolean }[]
  }
  error?: string | null
}>()

const emit = defineEmits(['update:modelValue'])

const radioId = computed(() => props.field.props?.id || props.field.props?.name || props.field.label?.toLowerCase().replace(/\s+/g, '-') || 'radio-field')

const hasError = computed(() => !!props.error)

const radioValue = computed({
  get: () => props.modelValue ?? '',
  set: (val: string | number | boolean) => {
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <div class="field-wrapper">
    <label v-if="field.label" :for="radioId" class="field-label">
      {{ field.label }}
    </label>

    <div class="radio-group">
      <div v-for="option in field.options" :key="String(option.value)" class="radio-option">
        <input type="radio" :id="`${radioId}-${option.value}`" :name="field.props?.name || field.label || radioId"
          :value="option.value" v-model="radioValue" :disabled="field.props?.disabled" :readonly="field.props?.readonly"
          :aria-label="field.props?.ariaLabel" :aria-describedby="field.props?.ariaDescribedBy" class="radio-input" />
        <label :for="`${radioId}-${option.value}`" class="radio-label">
          {{ option.label }}
        </label>
      </div>
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
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.radio-option {
  display: flex;
  align-items: center;
}

.radio-input {
  margin-right: 0.5rem;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  background-color: #fff;
  position: relative;
}

/* Inner circle when checked */
.radio-input::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

/* Checked state */
.radio-input:checked::before {
  background-color: #2196F3;
  /* Blue inner circle when checked */
}

/* Disabled state */
.radio-input:disabled {
  background-color: #444;
  border-color: #555;
}

.radio-input:checked:disabled::before {
  background-color: #fff;
  /* White center for disabled checked state */
  border-color: #2196F3;
  /* Blue outer border when checked and disabled */
}

.radio-label {
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

/* Error message styles */
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

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .radio-input {
    background-color: #444;
    border-color: #999595;
  }

  .radio-input:checked {
    background-color: #2196F3;
    border-color: #2196F3;
  }

  .radio-input:checked::before {
    background-color: #fff;
    /* White inner circle in dark mode */
  }

  .field-label {
    color: #fff;
  }

  .radio-label {
    color: #fff;
  }

  .field-error {
    color: #f44336;
  }

  .field-help {
    color: #bbb;
  }
}

/* Mobile responsiveness */
@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
  }

  .radio-input {
    transform: scale(1.2);
  }

  .radio-label {
    font-size: 0.875rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
  }

  .radio-input {
    transform: scale(1.1);
  }

  .radio-label {
    font-size: 1rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
  }

  .radio-input {
    transform: scale(1);
  }

  .radio-label {
    font-size: 1rem;
  }
}
</style>
