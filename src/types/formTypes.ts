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
