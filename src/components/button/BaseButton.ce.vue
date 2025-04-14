<script setup lang="ts">

defineOptions({ shadow: true })

defineProps<{ label: string; type?: 'button' | 'submit' | 'reset' }>()

</script>

<template>
  <button :type="type || 'button'">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  /* px-4 py-2 = 16px x 8px */
  background-color: #2563eb;
  /* bg-blue-600 */
  color: white;
  /* text-white */
  border-radius: 0.25rem;
  /* rounded = 4px */
  transition: background-color 0.2s ease;
  /* transition */
  border: none;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1.5;
}

button:hover {
  background-color: #1d4ed8;
  /* hover:bg-blue-700 */
}
</style>
