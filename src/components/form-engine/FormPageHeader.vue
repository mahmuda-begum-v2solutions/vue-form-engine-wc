<script setup lang="ts">
import type {
  OuterHeadingBlock,
  HeadingBlockContent,
  HeadingContent,
  ParagraphContent,
  LinkContent,
  LinkInnerContent,
  ImageContent,
  TextContent
} from '@/types/formTypes'

defineProps<{
  block: OuterHeadingBlock
}>()

const isHeading = (item: HeadingBlockContent): item is HeadingContent => item.type === 'heading'
const isParagraph = (item: HeadingBlockContent): item is ParagraphContent => item.type === 'paragraph'
const isLink = (item: HeadingBlockContent): item is LinkContent => item.type === 'link'

const isTextContent = (c: LinkInnerContent): c is TextContent => c.type === 'text'
const isImageContent = (c: LinkInnerContent): c is ImageContent => c.type === 'image'
</script>

<template>
  <div class="page-header" :class="block.wrapperClass">
    <template v-for="(item, index) in block.content" :key="index">
      <component v-if="isHeading(item)" :is="item.tag || 'h1'" :class="['heading-text', item.class]">
        {{ item.text }}
      </component>

      <p v-else-if="isParagraph(item)" :class="['paragraph-text', item.class]">
        {{ item.text }}
      </p>

      <a v-else-if="isLink(item)" :href="item.href" :class="['link-block', item.class]" target="_blank"
        rel="noopener noreferrer">
        <template v-for="(c, i) in item.content || []" :key="i">
          <span v-if="isTextContent(c)" class="link-text">
            {{ c.text }}
          </span>
          <img v-else-if="isImageContent(c)" :src="c.src" :alt="c.alt || ''" :class="['link-image', c.class]" />
        </template>
      </a>
    </template>
  </div>
</template>

<style scoped>
a {
  text-decoration: none;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
}

/* .page-header {
  margin-bottom: 2rem;
  padding: 0 1rem;
} */

/* Headings */
.heading-text {
  font-size: 2rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

/* Paragraphs */
.paragraph-text {
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Links */
.link-block {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0066cc;
  text-decoration: underline;
}

.link-block:hover {
  color: #004999;
}

.link-text {
  font-size: 0.95rem;
}

.link-image {
  height: 1rem;
  width: 1rem;
  object-fit: contain;
}

/* Dark Mode Styles */
@media (prefers-color-scheme: dark) {
  .page-header {
    color: #eee;
  }

  .heading-text {
    color: #fff;
  }

  .paragraph-text {
    color: #ccc;
  }

  .link-block {
    color: #88ccff;
  }

  .link-block:hover {
    color: #aad8ff;
  }
}

/* Mobile Responsiveness */
@media (max-width: 320px) {
  .heading-text {
    font-size: 1.5rem;
  }

  .paragraph-text {
    font-size: 0.875rem;
  }

  .link-text {
    font-size: 0.875rem;
  }

  .link-image {
    height: 0.8rem;
    width: 0.8rem;
  }
}

@media (min-width: 321px) and (max-width: 768px) {
  .heading-text {
    font-size: 1.75rem;
  }

  .paragraph-text {
    font-size: 1rem;
  }

  .link-text {
    font-size: 0.95rem;
  }

  .link-image {
    height: 0.9rem;
    width: 0.9rem;
  }
}

@media (min-width: 769px) {
  .heading-text {
    font-size: 2rem;
  }

  .paragraph-text {
    font-size: 1rem;
  }

  .link-text {
    font-size: 1rem;
  }

  .link-image {
    height: 1rem;
    width: 1rem;
  }
}
</style>
