<script setup lang="ts">
import { computed } from 'vue'
import type { InputProps } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

const props = defineProps<{
  modelValue?: string | number | boolean
  field: {
    label?: string
    props?: InputProps
    helpText?: string
  },
  error?: string | null  // Accept the error message as a prop
}>()

defineEmits(['update:modelValue'])

const inputId = computed(() => props.field.props?.id || props.field.props?.name || `input-field-${Math.random().toString(36).substring(2, 15)}`)
const hasError = computed(() => !!props.error)  // Determine if there is an error based on the passed prop

</script>

<template>
  <div class="field-input">
    <label v-if="field.label" :for="inputId" class="input-label">
      {{ field.label }}
    </label>

    <!-- Color Input Special Handling -->
    <input v-if="field.props?.type === 'color'" :id="inputId" v-bind="field.props" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" class="input-base input-color"
      :class="{ 'input-error': hasError }" />

    <!-- Regular Input Handling -->
    <input v-else :id="inputId" v-bind="field.props" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" class="input-base"
      :class="{ 'input-error': hasError }" />

    <!-- Error Message Display -->
    <p v-if="error" class="input-error-message">
      {{ error }} <!-- Display the passed error message -->
    </p>

    <p v-else-if="field.helpText" class="input-help">
      {{ field.helpText }}
    </p>
  </div>
</template>

<style scoped>
.input-base {
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: -webkit-fill-available;
  background-color: #fff;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 1rem;
}

.input-color {
  appearance: none;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 0.375rem;
  display: block;
  margin-bottom: 1rem;
}

.input-error {
  border-color: #f44336;
  /* Error color */
}

.input-error-message {
  color: #f44336;
  /* Error message color */
}

.input-help {
  color: #888;
  /* Help text color */
}

.input-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .input-base {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }

  .input-color {
    background-color: #333;
    color: #fff;
  }

  .input-error {
    border-color: #9d190f;
  }

  .input-error-message {
    color: #9d190f;
    ;
  }

  .input-help {
    color: #bbb;
  }
}

/* Mobile responsiveness */
@media (max-width: 320px) {
  .input-base {
    font-size: 0.75rem;
    padding: 0.625rem 0.75rem;
  }

  .input-color {
    width: 2.5rem;
    height: 2.5rem;
  }

  .input-label {
    font-size: 0.75rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .input-base {
    font-size: 0.875rem;
  }

  .input-color {
    width: 2.75rem;
    height: 2.75rem;
  }
}

@media (min-width: 769px) {
  .input-base {
    font-size: 1rem;
  }

  .input-color {
    width: 3rem;
    height: 3rem;
  }
}
</style>
