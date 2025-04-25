import { defineCustomElement } from 'vue'
import FormEngine from '@/components/form-engine-ce/FormEngine.ce.vue'

// Register your custom element(s)
const FormEngineElement = defineCustomElement(FormEngine)

customElements.define('form-engine', FormEngineElement)

// Add more custom elements like this:
// const AnotherElement = defineCustomElement(AnotherComponent)
// customElements.define('another-element', AnotherElement)
