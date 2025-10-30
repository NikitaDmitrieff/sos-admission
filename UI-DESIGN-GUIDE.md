# UI Design Guide

## Core Design Principles

### 1. Zero Border Radius
All UI elements use sharp corners for a brutalist, minimalist aesthetic.
```tsx
style={{ borderRadius: 0 }}
```

### 2. Minimal Color Palette
- `bg-background` / `text-foreground` - Primary
- `text-muted-foreground` - Secondary text
- `border` - Standard borders
- `bg-background/95` - Translucent backgrounds

### 3. Consistent Transitions
```tsx
className="transition-all duration-300"
```

## Component Patterns

### Card/Panel Containers
Standard card structure for content sections with header, content, and footer.
```tsx
<div 
  className="border bg-background shadow-lg transition-all duration-300"
  style={{ borderRadius: 0 }}
>
  {/* Header */}
  <div 
    className="border-b px-6 py-4 transition-all duration-300"
    style={{ borderRadius: 0 }}
  >
    <h2 className="text-base font-medium">Card Title</h2>
    <p className="text-xs text-muted-foreground mt-0.5">
      Card description
    </p>
  </div>

  {/* Content */}
  <div className="p-6 space-y-4">
    {/* Content here */}
  </div>

  {/* Footer */}
  <div 
    className="border-t px-6 py-3 transition-all duration-300"
    style={{ borderRadius: 0 }}
  >
    {/* Footer actions */}
  </div>
</div>
```

**Key Features:**
- Border with shadow: `border bg-background shadow-lg`
- Three-section structure: header, content, footer
- Consistent padding throughout
- Seamless borders between sections

### Modal/Dialog Containers
```tsx
<div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center">
  <div 
    className="w-full max-w-[380px] border bg-background shadow-lg transition-all duration-300"
    style={{ borderRadius: 0 }}
  >
    {/* Content */}
  </div>
</div>
```

**Key Features:**
- Full screen overlay with `fixed inset-0`
- Backdrop blur: `backdrop-blur-md`
- Centered with flexbox
- Max width for readability: `max-w-[380px]`
- Subtle shadow: `shadow-lg`

### Section Headers

#### Simple Header
```tsx
<div 
  className="border-b px-6 py-4 transition-all duration-300"
  style={{ borderRadius: 0 }}
>
  <h2 className="text-base font-medium transition-opacity duration-300">
    Header Text
  </h2>
</div>
```

**Specifications:**
- Padding: `px-6 py-4`
- Border: `border-b`
- Typography: `text-base font-medium`
- No uppercase or letter spacing

#### Header with Icon and Description
```tsx
<div 
  className="border-b px-6 py-4 transition-all duration-300"
  style={{ borderRadius: 0 }}
>
  <div className="flex items-center gap-4">
    <div 
      className="h-12 w-12 bg-foreground/5 flex items-center justify-center"
      style={{ borderRadius: 0 }}
    >
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-base font-medium">Header Text</h2>
      <p className="text-xs text-muted-foreground mt-0.5">
        Description text
      </p>
    </div>
  </div>
</div>
```

**Specifications:**
- Icon container: `h-12 w-12 bg-foreground/5` (subtle background, square)
- Icon size: `h-5 w-5`
- Gap between icon and text: `gap-4`
- Description below title with `mt-0.5` spacing

### Form Fields

#### Labels
```tsx
<label 
  htmlFor="fieldId" 
  className="text-xs font-medium"
>
  Field Name
</label>
```
- Typography: `text-xs font-medium`
- No all-caps

#### Inputs
```tsx
<input
  className="w-full h-9 px-3 text-sm bg-background border focus:outline-none focus:border-foreground disabled:opacity-50 transition-all"
  style={{ borderRadius: 0 }}
/>
```

**Key Properties:**
- Height: `h-9` (36px)
- Padding: `px-3`
- Typography: `text-sm`
- Focus state: `focus:border-foreground` (no outline)
- Disabled: `opacity-50`

#### Field Groups
```tsx
<div className="space-y-1.5">
  <label>{/* ... */}</label>
  <input>{/* ... */}</input>
</div>
```
- Spacing between label and input: `space-y-1.5`

### Buttons

#### Primary Button
```tsx
<button
  className="w-full h-9 text-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all border border-foreground"
  style={{ borderRadius: 0 }}
>
  Button Text
</button>
```

**Specifications:**
- Height: `h-9`
- Typography: `text-sm`
- Inverted colors: `bg-foreground text-background`
- Hover: `hover:bg-foreground/90`
- Disabled: `opacity-50`
- Border matching background for definition

#### Secondary Button
```tsx
<button
  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
>
  Secondary Action
</button>
```

**Specifications:**
- Typography: `text-xs`
- Muted by default: `text-muted-foreground`
- Hover reveals: `hover:text-foreground`
- No background

#### Toggle/Selection Button
For toggleable options like tags or filters.
```tsx
<button
  onClick={() => toggleSelection(item)}
  className={`
    h-7 px-3 text-xs border transition-all
    ${isSelected
      ? 'bg-foreground text-background border-foreground'
      : 'bg-background text-foreground border hover:border-foreground'
    }
  `}
  style={{ borderRadius: 0 }}
>
  Option Text
</button>
```

**Specifications:**
- Height: `h-7` (28px, smaller than standard buttons)
- Typography: `text-xs`
- Selected state: Inverted colors (like primary button)
- Unselected state: Transparent with hover effect
- Use for: Interest tags, filters, multi-select options

### Footers/Secondary Sections
```tsx
<div 
  className="border-t px-6 py-3 transition-all duration-300"
  style={{ borderRadius: 0 }}
>
  {/* Content */}
</div>
```

**Specifications:**
- Border: `border-t`
- Padding: `px-6 py-3` (less vertical than headers)

### Content Sections
```tsx
<div className="p-6 space-y-4">
  {/* Content with consistent vertical spacing */}
</div>
```

**Specifications:**
- Padding: `p-6`
- Vertical spacing: `space-y-4`

## Typography Scale

| Use Case | Class | Size |
|----------|-------|------|
| Headers | `text-base font-medium` | 16px |
| Body | `text-sm` | 14px |
| Labels | `text-xs font-medium` | 12px |
| Secondary | `text-xs text-muted-foreground` | 12px |

## Spacing System

| Context | Padding | Margin/Gap |
|---------|---------|------------|
| Container | `p-6` | - |
| Header | `px-6 py-4` | - |
| Footer | `px-6 py-3` | - |
| Form fields | `space-y-4` | - |
| Label → Input | `space-y-1.5` | - |
| Input internal | `px-3` | - |

## Interactive States

### Focus
- Remove default outline: `focus:outline-none`
- Border change: `focus:border-foreground`
- No rings or glows

### Hover
- Buttons: Reduce opacity to 90%
- Text links: Change from muted to foreground
- Use `transition-colors` or `transition-all`

### Disabled
- Opacity: `disabled:opacity-50`
- Cursor automatically handled

### Loading
- Show text: "Loading..."
- Disable interaction
- Maintain layout (no spinners unless necessary)

## Command Palette Specifics

Already using `@/components/ui/command` from shadcn/ui which follows the design system:
- Zero border radius
- Consistent typography
- Proper focus states
- Icon + text layout with `mr-2 h-4 w-4`

## Common Patterns

### Icon Containers
Square containers with subtle background for icons.
```tsx
<div 
  className="h-12 w-12 bg-foreground/5 flex items-center justify-center"
  style={{ borderRadius: 0 }}
>
  <Icon className="h-5 w-5" />
</div>
```

**Specifications:**
- Size: `h-12 w-12` (can vary based on context)
- Background: `bg-foreground/5` (very subtle)
- Icon size: `h-5 w-5` (typically, but can be h-4 w-4)
- Always square, never rounded

### Icon + Text Layout
```tsx
<div className="flex items-center">
  <Icon className="mr-2 h-4 w-4" />
  <span>Text</span>
</div>
```

### Stacked Info
```tsx
<div className="flex flex-col">
  <span>Primary Text</span>
  <span className="text-xs text-muted-foreground">
    Secondary Info
  </span>
</div>
```

### Multi-Item Selection Grid
For displaying toggleable options in a grid.
```tsx
<div className="space-y-1.5">
  <label className="text-xs font-medium">
    Section Label
  </label>
  <p className="text-xs text-muted-foreground">
    Optional description
  </p>
  <div className="flex flex-wrap gap-2 pt-1">
    {items.map((item) => (
      <button key={item} /* Toggle button styles */>
        {item}
      </button>
    ))}
  </div>
</div>
```

**Specifications:**
- Wrap with `flex-wrap gap-2`
- Small top padding: `pt-1`
- Use toggle button pattern for items

### Backdrop Overlays
```tsx
className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md"
```

## Anti-Patterns (Avoid)

❌ Rounded corners (except where accessibility requires)  
❌ Drop shadows on buttons  
❌ Gradients  
❌ Multiple font weights (stick to regular and medium)  
❌ Uppercase text  
❌ Letter spacing adjustments  
❌ Colored focus rings  
❌ Complex animations (keep it simple)  
❌ Custom scrollbars (let OS handle it)  

## Implementation Checklist

When creating a new UI component:

- [ ] All containers have `style={{ borderRadius: 0 }}`
- [ ] Typography follows scale (base/sm/xs)
- [ ] Transitions use `transition-all duration-300` or `transition-colors`
- [ ] Focus states remove outline and use border change
- [ ] Disabled states use `opacity-50`
- [ ] Padding follows system (p-6, px-6 py-4, etc.)
- [ ] Spacing between elements uses `space-y-*`
- [ ] Icons are `h-4 w-4` or `h-5 w-5`
- [ ] Secondary text uses `text-muted-foreground`
- [ ] Buttons are `h-9` with `text-sm`
- [ ] No custom colors beyond theme variables

