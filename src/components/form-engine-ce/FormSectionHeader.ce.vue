<script setup lang="ts">
import type { FormHeadingBlock, FormHeadingContent, HeadingContent, ParagraphContent } from '@/types/formTypes.ce.ts'

defineOptions({
  shadow: true
})

defineProps<{
  block: FormHeadingBlock
}>()

const isHeading = (item: FormHeadingContent): item is HeadingContent => item.type === 'heading'
const isParagraph = (item: FormHeadingContent): item is ParagraphContent => item.type === 'paragraph'
</script>

<template>
  <div class="section-header" :class="block.wrapperClass">
    <template v-for="(item, index) in block.content" :key="index">
      <component v-if="isHeading(item)" :is="item.tag || 'h2'" :class="['section-heading', item.class]">
        {{ item.text }}
      </component>

      <p v-else-if="isParagraph(item)" :class="['section-paragraph', item.class]">
        {{ item.text }}
      </p>
    </template>
  </div>
</template>

<style scoped>
.section-header {
  margin-bottom: 0.5rem;
  padding: 0 1rem;
}

/* Section Heading */
.section-heading {
  font-size: 1.5rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Section Paragraph */
.section-paragraph {
  font-size: 1rem;
  color: #555;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .section-heading {
    color: #fff;
  }

  .section-paragraph {
    color: #ccc;
  }
}

/* Mobile Responsiveness */
@media (max-width: 320px) {
  .section-heading {
    font-size: 1.25rem;
  }

  .section-paragraph {
    font-size: 0.875rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .section-heading {
    font-size: 1.375rem;
  }

  .section-paragraph {
    font-size: 0.9375rem;
  }
}

@media (min-width: 769px) {
  .section-heading {
    font-size: 1.5rem;
  }

  .section-paragraph {
    font-size: 1rem;
  }
}
</style>
