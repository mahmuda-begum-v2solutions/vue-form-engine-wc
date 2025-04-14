<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{
  schema: Array<{
    type: string
    label: string
    model: string
    options?: string[]
  }>
}>()

// Reactive form state
const formData = reactive<Record<string, any>>({})
</script>

<template>
  <form class="space-y-4 p-4 bg-white rounded shadow max-w-md mx-auto">
    <div v-for="field in schema" :key="field.model" class="flex flex-col gap-1">
      <label class="font-medium">{{ field.label }}</label>

      <input v-if="field.type === 'text'" type="text" v-model="formData[field.model]"
        class="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <select v-else-if="field.type === 'select'" v-model="formData[field.model]"
        class="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option v-for="option in field.options" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <div v-else class="text-red-500 text-sm">
        Unsupported field type: {{ field.type }}
      </div>
    </div>

    <pre class="bg-gray-100 p-2 rounded text-xs">{{ formData }}</pre>
  </form>
</template>
