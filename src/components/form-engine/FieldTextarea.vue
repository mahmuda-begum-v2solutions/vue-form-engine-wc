<script setup lang="ts">
import { computed } from 'vue'
import type { TextareaProps } from '@/types/formTypes'

const props = defineProps<{
  modelValue?: string | number | boolean
  field: {
    label?: string
    props?: TextareaProps
    helpText?: string
  },
  error?: string | null  // ✨ New: accept error message
}>()

const emit = defineEmits(['update:modelValue'])

const textareaId = computed(() => props.field.props?.id || props.field.props?.name || 'textarea-field')
const hasError = computed(() => !!props.error)  // ✨ Use external error prop
const rows = computed(() => props.field.props?.rows || 3)

// ✨ Always treat modelValue as string for textarea
const textareaValue = computed({
  get: () => {
    const val = props.modelValue
    return typeof val === 'string' || typeof val === 'number' ? val : ''
  },
  set: (val: string) => {
    emit('update:modelValue', val)
  }
})
</script>

<template>
  <div class="field-wrapper">
    <label v-if="field.label" :for="textareaId" class="field-label">
      {{ field.label }}
    </label>

    <textarea :id="textareaId" :name="field.props?.name" :placeholder="field.props?.placeholder" :rows="rows"
      :disabled="field.props?.disabled" :readonly="field.props?.readonly" :maxlength="field.props?.maxlength"
      :minlength="field.props?.minlength" :class="['field-textarea', { error: hasError }]"
      :aria-label="field.props?.ariaLabel" :aria-describedby="field.props?.ariaDescribedBy"
      v-model="textareaValue"></textarea>

    <!-- ✨ Error message from external prop -->
    <p v-if="error" class="field-error">
      {{ error }}
    </p>

    <p v-else-if="field.helpText" class="field-help">
      {{ field.helpText }}
    </p>
  </div>
</template>

<style scoped>
.field-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  /* Space between fields */
}

.field-label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 1rem;
  /* Default font size for label */
}

.field-textarea {
  font-size: 1rem;
  padding: 0.75rem 1rem;
  /* padding for text area */
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  width: 100%;
  background-color: #fff;
  color: #111;
  resize: vertical;
  /* Allow vertical resizing */
  transition: all 0.3s ease;
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
  .field-textarea {
    background-color: #333;
    color: #fff;
    border-color: #555;
  }

  .field-error {
    color: #f44336;
  }

  .field-help {
    color: #bbb;
  }

  .field-label {
    color: #fff;
    /* Label text in white */
  }
}

/* Mobile responsiveness */
@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
    /* Slightly smaller label font on small screens */
  }

  .field-textarea {
    font-size: 0.875rem;
    padding: 0.5rem 0.75rem;
    /* Adjust padding on small screens */
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
    /* Medium font size for labels */
  }

  .field-textarea {
    font-size: 0.9375rem;
    padding: 0.625rem 0.875rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
    /* Default label size */
  }

  .field-textarea {
    font-size: 1rem;
    padding: 0.75rem 1rem;
    /* Regular padding */
  }
}
</style>
