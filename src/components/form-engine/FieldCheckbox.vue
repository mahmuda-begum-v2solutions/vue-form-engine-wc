<script setup lang="ts">
import { computed } from 'vue'
import type { BaseProps } from '@/types/formTypes'

const props = defineProps<{
  modelValue?: any[] | boolean
  field: {
    label?: string
    props?: BaseProps
    helpText?: string
    options?: string[] // If undefined => single checkbox
  }
  error?: string | null // ✨ External error for validation
}>()

const emit = defineEmits(['update:modelValue'])

const checkboxId = computed(() => props.field.props?.id || props.field.props?.name || 'checkbox-field')
const hasError = computed(() => !!props.error)

// Checkbox group
const selectedValues = computed(() => Array.isArray(props.modelValue) ? props.modelValue : [])

const isChecked = (option: string) => selectedValues.value.includes(option)

const toggleOption = (option: string) => {
  const newValue = isChecked(option)
    ? selectedValues.value.filter((val) => val !== option)
    : [...selectedValues.value, option]
  emit('update:modelValue', newValue)
}

// Single checkbox logic (boolean)
const singleCheckboxValue = computed({
  get: () => !!props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

</script>

<template>
  <div :class="{ 'field-wrapper-inline': !field.options, 'field-wrapper': field.options }">
    <!-- Label -->
    <label v-if="field.label" :for="checkboxId" class="field-label">
      {{ field.label }}
    </label>

    <!-- ✅ Single checkbox -->
    <div v-if="!field.options">
      <input type="checkbox" :id="checkboxId" :name="field.props?.name" :disabled="field.props?.disabled"
        :readonly="field.props?.readonly" :aria-label="field.props?.ariaLabel"
        :aria-describedby="field.props?.ariaDescribedBy" v-model="singleCheckboxValue" class="checkbox-input" />
    </div>

    <!-- ✅ Multiple checkboxes -->
    <div v-else class="field-checkbox-wrapper">
      <div class="checkbox-container">
        <div v-for="(option, index) in field.options" :key="index" class="checkbox-option">
          <input type="checkbox" :id="`${checkboxId}-${option}`" :name="checkboxId" :value="option"
            :checked="isChecked(option)" :disabled="field.props?.disabled" :readonly="field.props?.readonly"
            :aria-label="field.props?.ariaLabel" :aria-describedby="field.props?.ariaDescribedBy"
            @change="toggleOption(option)" class="checkbox-input" />
          <label :for="`${checkboxId}-${option}`" class="checkbox-label">
            {{ option }}
          </label>
        </div>
      </div>
    </div>

    <!-- Error or help text -->
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

.field-wrapper-inline {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}

.field-checkbox-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* Space between checkboxes and label */
}

.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  /* Allow checkboxes to wrap if they overflow */
  gap: 1rem;
  /* Space between checkboxes */
}

.checkbox-option {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  /* Space between checkboxes */
}

.checkbox-label {
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  /* Space between checkbox and label */
}

.checkbox-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #2563eb;
  /* Blue accent for checked state */
  background-color: transparent;
  /* fallback */
  border: 2px solid #999;
  /* fallback if border is hidden on some browsers */
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

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .field-label {
    color: #fff;
  }

  .checkbox-label {
    color: #fff;
  }

  .field-error {
    color: #f44336;
  }

  .field-help {
    color: #bbb;
  }

  .checkbox-input {
    background-color: #444;
    /* This usually gets ignored unless styled manually */
    box-shadow: inset 0 0 0 20px #444;
    /* overlays the background */
    border-color: #999595;
  }

  /* When checked, make sure the accent is visible */
  .checkbox-input:checked {
    box-shadow: none;
    /* Remove overlay so accent-color shows */
  }
}

/* Mobile responsiveness */
@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
  }

  .checkbox-label {
    font-size: 0.875rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
  }

  .checkbox-label {
    font-size: 1rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
  }

  .checkbox-label {
    font-size: 1rem;
  }
}
</style>
