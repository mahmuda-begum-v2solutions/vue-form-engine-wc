### vue-form-engine-wc

A lightweight, customizable Vue Web Component for building dynamic forms. Easily integrates into any Vue-based application with minimal setup.

## Installation

To install the package, you can use npm or yarn:

```bash
npm install vue-form-engine-wc
```

or

```bash
yarn add vue-form-engine-wc
```

### Usage

1. Install and import the component
   After installing the package, change in vite config:

```bash
vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes('-'), // Treat all "kebab-case" tags as Web Components
        },
      },
    }),
```

2. Adding Form Fields
   You can dynamically create form by passing data via props

```bash
<script setup lang="ts">
import { ref } from 'vue'

import genericPageHeader from '@/jsons/test/genericPageHeader.json'
import genericFormSectionHeader from '@/jsons/test/genericFormSectionHeader.json'
import genericFormFields from '@/jsons/test/genericFormFields.json'
import genericActionButtons from '@/jsons/test/genericActionButtons.json'

const genericPageHeaderProp = ref(genericPageHeader)
const genericFormSectionHeaderProp = ref(genericFormSectionHeader)
const genericFormFieldsProp = ref(genericFormFields)
const genericActionButtonsProp = ref(genericActionButtons)


const handleFormSubmit = (event: any) => {
  const formData = event.detail[0];
  console.log('Received form data from FormEngine:', formData);
  console.log("name test", formData.fullName)
}
</script>
<template>
  <main class="min-h-screen w-full flex justify-center items-center p-4">
    <div
      class="max-w-7xl w-full h-[70vh] sm:h-screen overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-[#596373] scrollbar-track-transparent">
      <!-- Passing the props to FormEngine component -->
      <form-engine :genericPageHeader.prop="genericPageHeaderProp"
        :genericFormSectionHeader.prop="genericFormSectionHeaderProp" :genericFormFields.prop="genericFormFieldsProp"
        :genericActionButtons.prop="genericActionButtonsProp" @submit="handleFormSubmit" />
    </div>
  </main>
</template>
```

2. this data types format datas can be used

```bash
// Base props shared across most components
export type BaseProps = {
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  autocomplete?: string
  maxlength?: number
  minlength?: number
  pattern?: string
  step?: number
  min?: number
  max?: number
  multiple?: boolean
  accept?: string
  class?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  error?: boolean
  errorMessage?: string
  helpText?: string
  value?: string | number | boolean | string[] // Moved here for shared use

  // Optional: add a condition for visibility
  condition?: {
    field: string
    value: string | number | boolean
    operator?: 'equals' | 'notEquals' | 'includes' | 'greaterThan' | 'lessThan'
  }

  // Optional: add validation rules for the field
  validation?: {
    required?: boolean
    pattern?: string
    customMessage?: string
    customValidator?: ValidatorFunction // Reference to the function
  }

  // Optional: support dynamic options fetch from URL or function
  optionsUrl?: string // REST endpoint or static JSON file
  fetchOptions?: FetchOptionsFunction // Function to fetch dynamic options

  // Custom props to support custom components
  componentName?: string // For custom components (e.g., MyMapPicker)
  componentProps?: Record<string, string | number | boolean> // Custom props for the custom component

  // Add 'condition' explicitly to avoid index signature issues
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | undefined
    | object
    | ValidatorFunction
    | FetchOptionsFunction
}

// Function type for custom validators
type ValidatorFunction = (value: string | number | boolean) => boolean | string

// Function type for fetching options dynamically
type FetchOptionsFunction = () => Promise<FieldOption[]>

// More specific props for certain components
export type InputProps = BaseProps & {
  type?: string
}

export type TextareaProps = BaseProps & {
  rows?: number
}

export type SelectProps = BaseProps & {
  multiple?: boolean // For selecting multiple options
  optionsUrl?: string // URL to fetch options dynamically (optional)
  fetchOptions?: FetchOptionsFunction // Function to fetch options dynamically (optional)
}

export type LinkProps = BaseProps & {
  href: string
  text: string
}

export type FieldComponent =
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'toggle'
  | 'link'
  | 'custom' // Custom component type

// Component-specific props union (for future refinement if needed)
type ComponentProps = InputProps | TextareaProps | LinkProps | BaseProps

// Extended options type to support complex options for select, checkbox, radio
export type FieldOption =
  | string
  | {
      label: string
      value: string | number | boolean
      link?: string
      disabled?: boolean
    }
  | {
      group: string // Grouping for select/radio/checkbox
      options: FieldOption[] // Array of options under the group
    }

// Field object for form controls
export type FieldBase = {
  name?: string
  label?: string
  component?: FieldComponent
  props?: ComponentProps
  options?: FieldOption[]
  gridSpan?: number
  grid?: false
  helpText?: string
  value?: string | number | boolean | string[]

  // Optional: add conditional visibility for fields
  condition?: {
    field: string
    value: string | number | boolean
    operator?: 'equals' | 'notEquals' | 'includes' | 'greaterThan' | 'lessThan'
  }

  // Optional: support validation for the field
  validation?: ValidationRule

  // Optional: Dynamic fetching of options from a URL or function
  optionsUrl?: string
  fetchOptions?: FetchOptionsFunction

  // Custom component support
  componentName?: string
  componentProps?: Record<string, string | number | boolean> // More specific than `any`
}

// Grid object for nested fields
export type FieldGrid = {
  grid: true
  children: Field[]
}

// Final recursive Field type
export type Field = FieldBase | FieldGrid

// Page Heading Block
export type OuterHeadingBlock = {
  type?: 'heading-block'
  wrapperClass?: string
  content?: HeadingBlockContent[]
}

export type HeadingBlockContent = HeadingContent | ParagraphContent | LinkContent

export type HeadingContent = {
  type?: 'heading'
  tag?: string // e.g., h1, h2
  text?: string
  class?: string
}

export type ParagraphContent = {
  type?: 'paragraph'
  text?: string
  class?: string
}

export type LinkContent = {
  type?: 'link'
  href?: string
  class?: string
  content?: LinkInnerContent[]
}

export type LinkInnerContent = ImageContent | TextContent

export type ImageContent = {
  type?: 'image'
  src?: string
  alt?: string
  class?: string
}

export type TextContent = {
  type?: 'text'
  text?: string
}

// Section Heading Block (for form sections)
export type FormHeadingBlock = {
  type?: 'heading-block'
  wrapperClass?: string
  content?: FormHeadingContent[]
}

export type FormHeadingContent = HeadingContent | ParagraphContent

//actionButtons

export type ButtonItem = {
  type?: 'submit' | 'reset' | 'button'
  text?: string
  icon?: string // Optional icon support (e.g., for left/right icons)
  class?: string
  disabled?: boolean
  loading?: boolean // Useful for async submit actions
  actionId?: string // For custom handlers like preview, saveDraft
}

export type ButtonLink = {
  text?: string
  href?: string
  class?: string
  icon?: string
  external?: boolean // Opens in new tab
}

// Enforce at least one button using tuple with rest
export type ButtonBlock = {
  buttons: [ButtonItem, ...ButtonItem[]] // At least one button required
  link?: ButtonLink
}

export type ValidationRule = {
  required?: boolean // Whether the field is required
  pattern?: string | RegExp // Pattern for regex validation
  minLength?: number // Minimum number of characters
  maxLength?: number // Maximum number of characters
  min?: number | string // Minimum value (e.g. for numbers, dates)
  max?: number | string // Maximum value (e.g. for numbers, dates)
  maxSize?: number // File size in MB
  customValidator?: ValidatorFunction // Optional function-based validator
  message?: string // Fallback message for generic validation failure
  customMessage?: string // Specific custom message per rule
}
```

genericPageHeader

```bash
{
  "type": "heading-block",
  "wrapperClass": "",
  "content": [
    {
      "type": "heading",
      "tag": "h1",
      "text": "Welcome to Test Form",
      "class": ""
    },
    {
      "type": "paragraph",
      "text": "We’re here to help you get started. Fill out the form below and let us know how we can assist.",
      "class": ""
    }
  ]
}
```

genericFormSectionHeader

```bash
{
  "type": "heading-block",
  "wrapperClass": "",
  "content": [
    {
      "type": "heading",
      "tag": "h2",
      "text": "Personal Information",
      "class": ""
    },
    {
      "type": "paragraph",
      "text": "Please enter your name and contact details accurately.",
      "class": ""
    }
  ]
}
```

genericActionButtons

```bash
{
  "buttons": [
    {
      "type": "submit",
      "text": "Submit",
      "icon": "fas fa-check-circle",
      "class": "",
      "disabled": false,
      "loading": false,
      "actionId": "submitForm"
    },
    {
      "type": "reset",
      "text": "Reset",
      "icon": "fas fa-undo",
      "class": "",
      "disabled": false,
      "loading": false,
      "actionId": "resetForm"
    },
    {
      "type": "button",
      "text": "Preview",
      "icon": "fas fa-eye",
      "class": "",
      "disabled": false,
      "loading": false,
      "actionId": "previewForm"
    }
  ],
  "link": {
    "text": "Learn more",
    "href": "https://example.com/about",
    "class": "",
    "icon": "fas fa-info-circle",
    "external": true
  }
}

```

genericFormFields

```bash
[
  {
    "grid": true,
    "children": [
      {
        "name": "firstName",
        "label": "First Name",
        "component": "input",
        "props": {
          "type": "text",
          "required": true,
          "placeholder": "John",
          "maxlength": 50
        },
        "validation": {
          "required": true,
          "pattern": "^[a-zA-Z]+$",
          "customMessage": "Please enter a valid first name (letters only)."
        }
      },
      {
        "name": "lastName",
        "label": "Last Name",
        "component": "input",
        "props": {
          "type": "text",
          "required": true,
          "placeholder": "Doe",
          "maxlength": 50
        },
        "validation": {
          "required": true,
          "pattern": "^[a-zA-Z]+$",
          "customMessage": "Please enter a valid last name (letters only)."
        }
      }
    ]
  },
  {
    "name": "email",
    "label": "Email Address",
    "component": "input",
    "props": {
      "type": "email",
      "required": true,
      "placeholder": "example@abc.com",
      "maxlength": 255,
      "autocomplete": "email",
      "ariaLabel": "Email address"
    },
    "validation": {
      "required": true,
      "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      "customMessage": "Please enter a valid email address."
    }
  },
  {
    "name": "phoneNumber",
    "label": "Phone Number",
    "component": "input",
    "props": {
      "type": "tel",
      "required": true,
      "placeholder": "(+91)XXXXXXXXXX",
      "maxlength": 15
    },
    "validation": {
      "required": true,
      "pattern": "^\\+91[0-9]{10}$|^[0-9]{10}$",
      "customMessage": "Please enter a valid Indian phone number."
    }
  },
  {
    "name": "birthdate",
    "label": "Date of Birth",
    "component": "input",
    "props": {
      "type": "date",
      "required": true
    },
    "validation": {
      "required": true,
      "min": "1900-01-01",
      "max": "2005-01-01",
      "customMessage": "Please enter your birthdate (you must be at least 18 years old)."
    }
  },
  {
    "name": "favoriteColor",
    "label": "Favorite Color",
    "component": "input",
    "props": {
      "type": "color",
      "value": "#ff0000",
      "required": true
    }
  },
  {
    "name": "profilePicture",
    "label": "Profile Picture",
    "component": "input",
    "props": {
      "type": "file",
      "accept": "image/*",
      "required": true
    },
    "validation": {
      "maxSize": 5,
      "customMessage": "Please upload a profile picture smaller than 5MB."
    }
  },
  {
    "name": "resumeUpload",
    "label": "Resume Upload",
    "component": "input",
    "props": {
      "type": "file",
      "accept": ".pdf,.doc,.docx",
      "required": true
    },
    "validation": {
      "maxSize": 10,
      "customMessage": "Please upload a resume smaller than 10MB."
    }
  },
  {
    "name": "country",
    "label": "Country",
    "component": "select",
    "props": {
      "required": true
    },
    "options": ["United States", "Canada", "Germany", "France", "United Kingdom", "India"]
  },
  {
    "name": "languagesKnown",
    "label": "Languages Known",
    "component": "select",
    "props": {
      "required": true,
      "multiple": true
    },
    "options": [
      { "value": "en", "label": "English" },
      { "value": "fr", "label": "French" },
      { "value": "de", "label": "German" },
      { "value": "es", "label": "Spanish" },
      { "value": "hi", "label": "Hindi" }
    ]
  },
  {
    "name": "gender",
    "label": "Gender",
    "component": "radio",
    "props": {
      "required": true
    },
    "options": [
      { "label": "Male", "value": "male" },
      { "label": "Female", "value": "female" },
      { "label": "Other", "value": "other" }
    ]
  },
  {
    "name": "interests",
    "label": "Interests",
    "component": "checkbox",
    "props": {
      "required": false
    },
    "options": ["Sports", "Music", "Movies", "Traveling"]
  },
  {
    "name": "newsletterSubscription",
    "label": "Newsletter Subscription",
    "component": "radio",
    "props": {
      "required": true
    },
    "options": [
      { "label": "Subscribe", "value": "subscribe" },
      { "label": "Unsubscribe", "value": "unsubscribe" }
    ]
  },
  {
    "name": "satisfactionLevel",
    "label": "Satisfaction Level",
    "component": "range",
    "props": {
      "min": 1,
      "max": 10,
      "required": true
    }
  },
  {
    "name": "termsConditions",
    "label": "Accept Terms and Conditions",
    "component": "checkbox",
    "props": {
      "required": true
    }
  },
  {
    "name": "contactTime",
    "label": "Preferred Contact Time",
    "component": "time",
    "props": {
      "required": false
    }
  },
  {
    "name": "additionalInstructions",
    "label": "Additional Instructions",
    "component": "textarea",
    "props": {
      "placeholder": "Any additional information or instructions",
      "rows": 4
    },
    "validation": {
      "maxlength": 500,
      "customMessage": "Please limit your additional instructions to 500 characters."
    }
  },
  {
    "name": "matchInfo",
    "label": "Match Personal Information1",
    "component": "toggle",
    "props": {
      "required": true,
      "id": "matchInfoToggle",
      "name": "matchInfo",
      "error": false,
      "errorMessage": "You must confirm matching info",
      "helpText": "Enable this if your information matches your government ID"
    }
  },
  {
    "name": "linkHelp",
    "label": "Help Link",
    "component": "link",
    "props": {
      "href": "https://help.example.com",
      "text": "Click here for help",
      "external": true
    }
  },
  {
    "name": "companySelect",
    "label": "Select Companies",
    "component": "asyncSelect",
    "props": {
      "name": "company",
      "id": "company-select",
      "optionsUrl": "https://jsonplaceholder.typicode.com/users",
      "disabled": false,
      "readonly": false,
      "error": false,
      "errorMessage": "Please select a valid company",
      "ariaLabel": "Company selection dropdown",
      "ariaDescribedBy": "company-help"
    },
    "helpText": "Choose your company from the list."
  },
  {
    "name": "fullName",
    "label": "Full Name",
    "component": "custom",
    "type": "text",
    "placeholder": "Enter your full name",
    "helpText": "As it appears on official documents"
  },
  {
    "name": "feedbackType",
    "label": "Feedback Type",
    "component": "custom",
    "type": "select",
    "options": [
      { "label": "Bug Report", "value": "bug" },
      { "label": "Feature Request", "value": "feature" },
      { "label": "General Feedback", "value": "general" }
    ],
    "helpText": "Tell us what kind of feedback you're submitting"
  },
  {
    "name": "feedbackMessage",
    "label": "Message",
    "component": "custom",
    "type": "textarea",
    "placeholder": "Write your feedback here...",
    "helpText": "Max 500 characters",
    "validation": {
      "maxlength": 500,
      "customMessage": "Please limit your feedback to 500 characters."
    }
  }
]
```
