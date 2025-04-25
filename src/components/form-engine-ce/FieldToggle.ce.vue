<script setup lang="ts">
import { computed } from 'vue'
import type { BaseProps } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

const props = defineProps<{
  modelValue?: boolean
  error?: string | null
  field: {
    label?: string
    props?: BaseProps
    helpText?: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

const toggleId = computed(() =>
  props.field.props?.id || props.field.props?.name || `toggle-field-${Math.random().toString(36).slice(2)}`
)

const hasError = computed(() => !!props.error)

const toggleValue = computed({
  get: () => props.modelValue ?? false,
  set: (val: boolean) => emit('update:modelValue', val)
})

</script>

<template>
  <div class="field-wrapper">
    <div class="field-inline">
      <label :for="toggleId" class="field-label" v-if="field.label">
        {{ field.label }}
      </label>

      <div class="toggle-wrapper">
        <input type="checkbox" :id="toggleId" :name="toggleId" v-model="toggleValue" class="toggle-input" />
        <span class="toggle-slider"></span>
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
  gap: 0.25rem;
}

.field-inline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-wrapper {
  position: relative;
  width: 50px;
  height: 25px;
}

.toggle-input {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  cursor: pointer;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 25px;
  transition: background-color 0.3s ease;
  pointer-events: none;
}

.toggle-slider::before {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  left: 5px;
  bottom: 5px;
  background-color: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-input:checked+.toggle-slider {
  background-color: #4CAF50;
}

.toggle-input:checked+.toggle-slider::before {
  transform: translateX(25px);
}

.field-error {
  color: #f44336;
  font-size: 0.875rem;
}

.field-help {
  color: #888;
  font-size: 0.875rem;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .toggle-slider {
    background-color: #444;
  }

  .toggle-input:checked+.toggle-slider {
    background-color: #2196F3;
  }

  .toggle-slider::before {
    background-color: #fff;
  }

  .field-error {
    color: #f44336;
  }

  .field-help {
    color: #bbb;
  }
}
</style>
