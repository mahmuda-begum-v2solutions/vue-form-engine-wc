<script setup lang="ts">
import { computed } from 'vue'
import type { BaseProps } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

const props = defineProps<{
  modelValue?: FileList | null
  error?: string | null
  field: {
    label?: string
    props?: BaseProps
    helpText?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const fileInputId = computed(() => props.field.props?.id || props.field.props?.name || 'file-field')

const hasError = computed(() => !!props.error || props.field.props?.error)
const errorMessage = computed(() => props.error || props.field.props?.errorMessage)

const files = computed({
  get: () => props.modelValue ?? null,
  set: (files: FileList | null) => emit('update:modelValue', files),
})

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input?.files) {
    files.value = input.files
  }
}

const clearFiles = () => {
  files.value = null
}
</script>

<template>
  <div class="field-wrapper">
    <label v-if="field.label" :for="fileInputId" class="field-label">
      {{ field.label }}
    </label>

    <div class="field-file-wrapper">
      <input type="file" :id="fileInputId" :name="field.props?.name" :accept="field.props?.accept"
        :multiple="field.props?.multiple" :disabled="field.props?.disabled" :readonly="field.props?.readonly"
        @change="handleFileChange" :aria-label="field.props?.ariaLabel" :aria-describedby="field.props?.ariaDescribedBy"
        :aria-invalid="hasError ? 'true' : undefined" class="field-file-input" />

      <div v-if="files && files.length" class="file-info">
        <p class="field-file-text">{{ files.length }} file(s) selected</p>
        <ul class="file-preview-list">
          <li v-for="(file, idx) in Array.from(files)" :key="idx" class="file-preview-item">
            {{ file.name }}
          </li>
        </ul>
        <button type="button" class="clear-files" @click="clearFiles">Clear files</button>
      </div>
    </div>

    <p v-if="hasError && errorMessage" class="field-error">
      {{ errorMessage }}
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
  gap: 0.25rem;
}

.field-label {
  font-weight: 600;
  font-size: 1rem;
  color: #222;
}

.field-file-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-file-input {
  font-size: 0.9375rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.field-file-input:hover {
  border-color: #888;
}

.field-file-text {
  font-size: 0.875rem;
  color: #444;
}

.file-preview-list {
  padding-left: 1rem;
  list-style-type: disc;
  color: #555;
  font-size: 0.875rem;
}

.file-preview-item {
  line-height: 1.4;
}

.clear-files {
  background: none;
  color: #f44336;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0;
  border: none;
  align-self: flex-start;
}

.clear-files:hover {
  text-decoration: underline;
}

.field-error {
  font-size: 0.875rem;
  color: #f44336;
}

.field-help {
  font-size: 0.875rem;
  color: #666;
}

/* Responsive */
@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
  }

  .field-file-input {
    font-size: 0.8125rem;
    padding: 0.375rem;
  }

  .field-file-text,
  .file-preview-list,
  .field-error,
  .field-help {
    font-size: 0.75rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
  }

  .field-file-input {
    font-size: 0.875rem;
    padding: 0.5rem;
  }

  .field-file-text,
  .file-preview-list,
  .field-error,
  .field-help {
    font-size: 0.8125rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
  }

  .field-file-input {
    font-size: 0.9375rem;
    padding: 0.5rem 0.75rem;
  }

  .field-file-text,
  .file-preview-list,
  .field-error,
  .field-help {
    font-size: 0.875rem;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .field-label {
    color: #eee;
  }

  .field-file-input {
    background-color: #1f1f1f;
    border-color: #444;
    color: #eee;
  }

  .field-file-input:hover {
    border-color: #888;
  }

  .field-file-text {
    color: #ccc;
  }

  .file-preview-list {
    color: #ccc;
  }

  .field-help {
    color: #aaa;
  }
}
</style>
