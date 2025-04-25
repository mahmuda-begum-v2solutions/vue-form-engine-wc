<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { FieldOption, SelectProps } from '@/types/formTypes'

const props = defineProps<{
  modelValue?: string | number | boolean,
  error?: string | null // error prop from parent
  field: {
    label?: string
    props?: SelectProps
    helpText?: string
    options?: FieldOption[]
  }
}>()

const emit = defineEmits(['update:modelValue'])

const selectId = computed(() =>
  props.field.props?.id || props.field.props?.name || `async-select-field-${Math.random().toString(36).substring(2, 15)}`
)

const errorApi = ref<string | null>(null)

const hasError = computed(() => {
  // Error exists if either props.error or errorApi exists
  return !!props.error || !!errorApi.value
})

const options = ref<FieldOption[]>([])
const loading = ref(true)

const selectValue = computed({
  get: () => props.modelValue ?? '',
  set: (val: string | number | boolean) => {
    emit('update:modelValue', val)
  }
})

const fetchOptions = async () => {
  try {
    loading.value = true
    const response = await fetch(props.field.props?.optionsUrl || '')
    if (!response.ok) throw new Error('Failed to fetch options')
    const data = await response.json()
    options.value = data || []
  } catch (e: unknown) {
    // Check if the error is an instance of Error
    if (e instanceof Error) {
      errorApi.value = 'Failed to load options: ' + e.message
      console.log(e.message)
    } else {
      // Handle non-error types if necessary
      errorApi.value = 'An unknown error occurred while loading options.'
      console.log('Unknown error', e)
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (props.field.props?.optionsUrl) {
    fetchOptions()
  } else {
    options.value = props.field.options || []
    loading.value = false
  }
})

const isOptionGroup = (option: FieldOption): option is { group: string; options: FieldOption[] } =>
  typeof option === 'object' && 'group' in option

const isOptionValue = (option: FieldOption): option is { label: string; value: string | number | boolean } =>
  typeof option === 'object' && 'label' in option && 'value' in option
</script>


<template>
  <div class="field-wrapper">
    <label v-if="field.label" :for="selectId" class="field-label">
      {{ field.label }}
    </label>

    <div class="select-wrapper">
      <select :id="selectId" :name="selectId" v-model="selectValue" :disabled="field.props?.disabled"
        :readonly="field.props?.readonly" :aria-label="field.props?.ariaLabel"
        :aria-describedby="field.props?.ariaDescribedBy" :aria-invalid="hasError"
        :class="['field-select', { error: hasError }]">
        <option v-if="!loading" value="" disabled selected>
          Select {{ field.label || 'an option' }}
        </option>

        <template v-for="(option, index) in options" :key="'option-' + index">
          <option v-if="typeof option === 'string'" :value="option">{{ option }}</option>
          <option v-else-if="isOptionValue(option)" :value="option.value">{{ option.label }}</option>
          <optgroup v-else-if="isOptionGroup(option)" :label="option.group">
            <option v-for="(opt, idx) in option.options" :key="'group-option-' + idx"
              :value="isOptionValue(opt) ? opt.value : opt">
              {{ isOptionValue(opt) ? opt.label : opt }}
            </option>
          </optgroup>
        </template>
      </select>
      <span class="custom-arrow">&#9660;</span>
    </div>

    <!-- Loading indicator -->
    <p v-if="loading" class="field-loading">Loading...</p>

    <!-- API error display -->
    <p v-if="errorApi" class="field-error">{{ errorApi }}</p>

    <!-- Props error display -->
    <p v-if="props.error" class="field-error">{{ props.error }}</p>

    <!-- Help text if no error -->
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

.field-select.error {
  border-color: #f44336;
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

.field-loading,
.field-help,
.field-error {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.field-loading {
  color: #999;
  font-style: italic;
}

.field-error {
  color: #f44336;
}

.field-help {
  color: #666;
}

@media (prefers-color-scheme: dark) {
  .field-label {
    color: #eee;
  }

  .field-select {
    background-color: #333 !important;
    color: #fff !important;
    border-color: #555 !important;
    appearance: none;
  }

  /* 👇 Force options inside the select to inherit dark styles */
  .field-select option {
    background-color: #333 !important;
    color: #fff !important;
  }

  .field-select:focus {
    border-color: #888;
  }

  .field-select:disabled {
    background-color: #333;
    color: #777;
  }

  .field-loading,
  .field-help {
    color: #aaa;
  }

  .field-error {
    color: #f44336;
  }
}
</style>
