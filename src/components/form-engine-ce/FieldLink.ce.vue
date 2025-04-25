<script setup lang="ts">
import type { LinkProps } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

defineProps<{
  field: {
    label?: string
    props?: LinkProps
    helpText?: string
  }
}>()
</script>

<template>
  <div class="field-wrapper">
    <div class="field-inline">
      <label v-if="field.label" class="field-label">
        {{ field.label }}
      </label>

      <a :href="field.props?.href" :target="field.props?.external ? '_blank' : '_self'"
        :rel="field.props?.external ? 'noopener noreferrer' : ''" class="field-link">
        {{ field.props?.text }}
      </a>
    </div>

    <p v-if="field.helpText" class="field-help">
      {{ field.helpText }}
    </p>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.field-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-inline {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.field-label {
  font-weight: 600;
  font-size: 1rem;
  color: #222;
}

.field-link {
  font-size: 0.9375rem;
  font-style: italic;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.field-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.field-help {
  font-size: 0.875rem;
  color: #666;
}

/* Mobile responsiveness */
@media (max-width: 320px) {
  .field-label {
    font-size: 0.875rem;
  }

  .field-link {
    font-size: 0.8125rem;
  }

  .field-help {
    font-size: 0.75rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .field-label {
    font-size: 0.9375rem;
  }

  .field-link {
    font-size: 0.875rem;
  }

  .field-help {
    font-size: 0.8125rem;
  }
}

@media (min-width: 769px) {
  .field-label {
    font-size: 1rem;
  }

  .field-link {
    font-size: 0.9375rem;
  }

  .field-help {
    font-size: 0.875rem;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .field-label {
    color: #eee;
  }

  .field-link {
    color: #66b2ff;
  }

  .field-link:hover {
    color: #aad4ff;
  }

  .field-help {
    color: #aaa;
  }
}
</style>
