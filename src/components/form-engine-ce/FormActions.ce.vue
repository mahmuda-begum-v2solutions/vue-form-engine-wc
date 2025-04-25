<script setup lang="ts">
import type { ButtonItem, ButtonLink } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

defineProps<{
  buttons: ButtonItem[]
  link?: ButtonLink
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'reset'): void
  (e: 'custom-action', actionId: string): void
}>()

// Method to handle custom actions (e.g., save draft, preview)
const handleAction = (actionId: string | undefined) => {
  if (actionId) {
    emit('custom-action', actionId)
  }
}

// Method to handle form submission
const handleSubmit = () => {
  emit('submit')
}

// Method to handle form reset
const handleReset = () => {
  emit('reset')
}
</script>

<template>
  <div class="form-actions">
    <!-- Loop through buttons and render them -->
    <div v-for="(button, index) in buttons" :key="index" class="form-action-button">
      <button v-if="button.type === 'submit'" :disabled="button.disabled || isSubmitting" @click.prevent="handleSubmit"
        :class="['btn', 'btn-submit', button.class]" :aria-label="button.text">
        <i v-if="button.icon" :class="button.icon"></i>
        {{ button.text }}
      </button>

      <button v-if="button.type === 'reset'" :disabled="button.disabled" @click.prevent="handleReset"
        :class="['btn', 'btn-reset', button.class]" :aria-label="button.text">
        <i v-if="button.icon" :class="button.icon"></i>
        {{ button.text }}
      </button>

      <button v-if="button.type === 'button'" :disabled="button.disabled || button.loading"
        @click.prevent="handleAction(button.actionId)" :class="['btn', 'btn-action', button.class]"
        :aria-label="button.text">
        <i v-if="button.icon" :class="button.icon"></i>
        {{ button.text }}
        <span v-if="button.loading" class="loading-spinner"></span>
      </button>
    </div>
  </div>

  <!-- Optional Link outside button div to appear below -->
  <div class="link-class">
    <a v-if="link" :href="link.href" :class="link.class" :aria-label="link.text"
      :target="link.external ? '_blank' : '_self'">
      <i v-if="link.icon" :class="link.icon"></i>
      {{ link.text }}
    </a>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

.form-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.form-action-button {
  display: flex;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 0.9rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-submit {
  background-color: #007bff;
  color: white;
}

.btn-submit:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-reset {
  background-color: #f8f9fa;
  color: #495057;
}

.btn-reset:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

.btn-action {
  background-color: #28a745;
  color: white;
}

.btn-action:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.loading-spinner {
  margin-left: 0.5rem;
  border: 2px solid transparent;
  border-top-color: white;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

.link-class {
  display: flex;
  color: #013164;
  justify-content: center;
  text-decoration: underline;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Link Style */
a.link-about {
  display: block;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

a.link-about:hover {
  text-decoration: none;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .btn-submit {
    background-color: #0069d9;
  }

  .btn-reset {
    background-color: #343a40;
    color: #ccc;
  }

  .btn-action {
    background-color: #218838;
  }

  .btn-submit:disabled,
  .btn-reset:disabled,
  .btn-action:disabled {
    background-color: #6c757d;
  }

  a.link-about {
    color: #66b3ff;
  }
}

/* Mobile Responsiveness */
@media (max-width: 320px) {
  .form-actions {
    flex-direction: column;
    align-items: center;
  }

  .btn {
    width: 100%;
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }

  .form-action-button {
    width: 100%;
  }
}

/* Small Screens (321px to 768px) */
@media (min-width: 321px) and (max-width: 768px) {
  .form-actions {
    justify-content: center;
  }

  .btn {
    padding: 0.6rem 1.1rem;
    font-size: 1.05rem;
  }
}

/* Medium to Large Screens (769px and above) */
@media (min-width: 769px) {
  .form-actions {
    justify-content: center;
  }

  .btn {
    padding: 0.65rem 1.25rem;
    font-size: 1.1rem;
  }
}
</style>
