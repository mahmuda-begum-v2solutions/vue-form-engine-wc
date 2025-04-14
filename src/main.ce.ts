import { defineCustomElement } from 'vue'
import MyButton from '@/components/button/BaseButton.ce.vue'

// Register your custom element(s)
const MyButtonElement = defineCustomElement(MyButton)

customElements.define('base-button', MyButtonElement)

// Add more custom elements like this:
// const AnotherElement = defineCustomElement(AnotherComponent)
// customElements.define('another-element', AnotherElement)
