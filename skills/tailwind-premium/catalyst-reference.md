# Catalyst Component Reference

Quick-reference for Catalyst UI Kit patterns from Tailwind Plus.

## Component Import Pattern

```jsx
// Buttons
import { Button } from '@/components/button'

// Form controls
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Checkbox, CheckboxField, CheckboxGroup } from '@/components/checkbox'
import { Radio, RadioField, RadioGroup } from '@/components/radio'
import { Switch, SwitchField, SwitchGroup } from '@/components/switch'
import { Listbox, ListboxOption } from '@/components/listbox'
import { Combobox, ComboboxOption } from '@/components/combobox'

// Form structure
import { Field, Label, Description, ErrorMessage, Fieldset, Legend } from '@/components/fieldset'

// Layout
import { Sidebar, SidebarBody, SidebarFooter, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import { StackedLayout } from '@/components/stacked-layout'

// Overlays
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog'
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from '@/components/dropdown'

// Data display
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { DescriptionDetails, DescriptionList, DescriptionTerm } from '@/components/description-list'

// Navigation
import { Navbar, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '@/components/navbar'
import { Pagination, PaginationGap, PaginationList, PaginationNext, PaginationPage, PaginationPrevious } from '@/components/pagination'

// Elements
import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'
import { Alert, AlertActions, AlertBody, AlertDescription, AlertTitle } from '@/components/alert'
import { Divider } from '@/components/divider'
import { Heading, Subheading } from '@/components/heading'
import { Text, TextLink, Strong, Code } from '@/components/text'
import { Link } from '@/components/link'
```

## Button Variants

```jsx
// Solid colors
<Button color="dark/zinc">Default</Button>
<Button color="indigo">Primary</Button>
<Button color="red">Destructive</Button>

// Outline style
<Button outline>Secondary</Button>

// Plain (no background)
<Button plain>Tertiary</Button>

// With icon
<Button>
  <PlusIcon />
  Add item
</Button>

// As link
<Button href="/settings">Settings</Button>

// Disabled
<Button disabled>Loading...</Button>
```

## Form Fields

```jsx
<Field>
  <Label>Email</Label>
  <Description>We'll never share your email.</Description>
  <Input type="email" name="email" placeholder="you@example.com" />
  <ErrorMessage>Please enter a valid email.</ErrorMessage>
</Field>

<Field>
  <Label>Message</Label>
  <Textarea name="message" rows={4} />
</Field>

<CheckboxField>
  <Checkbox name="terms" />
  <Label>Accept terms</Label>
  <Description>You agree to our terms of service.</Description>
</CheckboxField>

<SwitchField>
  <Label>Notifications</Label>
  <Description>Receive email updates.</Description>
  <Switch name="notifications" />
</SwitchField>
```

## Table Patterns

```jsx
// Basic table
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Role</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {users.map((user) => (
      <TableRow key={user.id}>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell className="text-zinc-500">{user.role}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

// Full-width with gutter
<Table bleed className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">

// With row links
<TableRow href={`/users/${user.id}`}>

// Condensed
<Table dense>

// With grid lines
<Table grid>

// Striped rows
<Table striped>
```

## Dialog Patterns

```jsx
<Dialog open={isOpen} onClose={setIsOpen} size="lg">
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogDescription>
    This action cannot be undone.
  </DialogDescription>
  <DialogBody>
    {/* Form or content */}
  </DialogBody>
  <DialogActions>
    <Button plain onClick={() => setIsOpen(false)}>Cancel</Button>
    <Button color="red" onClick={handleConfirm}>Delete</Button>
  </DialogActions>
</Dialog>

// Sizes: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl
```

## Sidebar Layout

```jsx
<SidebarLayout
  sidebar={
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarBody>
        <SidebarSection>
          <SidebarItem href="/dashboard" current>
            <HomeIcon />
            <SidebarLabel>Dashboard</SidebarLabel>
          </SidebarItem>
          <SidebarItem href="/team">
            <UsersIcon />
            <SidebarLabel>Team</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem href="/settings">
            <Cog6ToothIcon />
            <SidebarLabel>Settings</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter>
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <Avatar src="/user.jpg" />
            <SidebarLabel>John Doe</SidebarLabel>
            <ChevronUpIcon />
          </DropdownButton>
          <DropdownMenu anchor="top start">
            <DropdownItem href="/profile">Profile</DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/logout">Sign out</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  }
>
  {/* Page content */}
</SidebarLayout>
```

## Badge Colors

```jsx
<Badge>Default</Badge>
<Badge color="zinc">Neutral</Badge>
<Badge color="red">Error</Badge>
<Badge color="orange">Warning</Badge>
<Badge color="yellow">Caution</Badge>
<Badge color="lime">Active</Badge>
<Badge color="green">Success</Badge>
<Badge color="cyan">Info</Badge>
<Badge color="blue">Primary</Badge>
<Badge color="indigo">Feature</Badge>
<Badge color="purple">Premium</Badge>
<Badge color="pink">Special</Badge>
```

## Avatar Patterns

```jsx
// Image
<Avatar src="/user.jpg" />

// Initials fallback
<Avatar initials="JD" className="bg-indigo-500 text-white" />

// Sizes
<Avatar src="/user.jpg" className="size-6" />   {/* Small */}
<Avatar src="/user.jpg" className="size-10" />  {/* Default */}
<Avatar src="/user.jpg" className="size-16" />  {/* Large */}

// Square variant
<Avatar src="/user.jpg" square />
```

## Typography

```jsx
<Heading>Page Title</Heading>
<Subheading>Section Title</Subheading>

<Text>Regular paragraph text.</Text>
<Text><Strong>Bold text</Strong></Text>
<Text><Code>inline code</Code></Text>
<Text>Visit <TextLink href="/about">About</TextLink> page.</Text>
```

## Description Lists

```jsx
<DescriptionList>
  <DescriptionTerm>Full name</DescriptionTerm>
  <DescriptionDetails>John Doe</DescriptionDetails>
  
  <DescriptionTerm>Email</DescriptionTerm>
  <DescriptionDetails>john@example.com</DescriptionDetails>
  
  <DescriptionTerm>Status</DescriptionTerm>
  <DescriptionDetails>
    <Badge color="lime">Active</Badge>
  </DescriptionDetails>
</DescriptionList>
```

## Alert Patterns

```jsx
<Alert>
  <AlertTitle>Payment successful</AlertTitle>
  <AlertDescription>
    Your order has been confirmed.
  </AlertDescription>
  <AlertActions>
    <Button plain onClick={dismiss}>Dismiss</Button>
    <Button onClick={viewOrder}>View order</Button>
  </AlertActions>
</Alert>
```

## Dropdown Menus

```jsx
<Dropdown>
  <DropdownButton outline>
    Options
    <ChevronDownIcon />
  </DropdownButton>
  <DropdownMenu anchor="bottom end">
    <DropdownItem href="/edit">
      <PencilIcon />
      <DropdownLabel>Edit</DropdownLabel>
    </DropdownItem>
    <DropdownItem href="/duplicate">
      <DocumentDuplicateIcon />
      <DropdownLabel>Duplicate</DropdownLabel>
    </DropdownItem>
    <DropdownDivider />
    <DropdownItem href="/delete">
      <TrashIcon />
      <DropdownLabel>Delete</DropdownLabel>
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```

## Pagination

```jsx
<Pagination>
  <PaginationPrevious href="?page=1" />
  <PaginationList>
    <PaginationPage href="?page=1">1</PaginationPage>
    <PaginationPage href="?page=2">2</PaginationPage>
    <PaginationPage href="?page=3" current>3</PaginationPage>
    <PaginationPage href="?page=4">4</PaginationPage>
    <PaginationGap />
    <PaginationPage href="?page=10">10</PaginationPage>
  </PaginationList>
  <PaginationNext href="?page=4" />
</Pagination>
```

## Dependencies

```bash
npm install @headlessui/react motion clsx tailwindcss@latest
npm install @heroicons/react  # Optional but recommended
```

## Theme Setup

```css
/* In your main CSS file */
@theme {
  --font-sans: Inter, sans-serif;
  --font-sans--font-feature-settings: 'cv11';
}
```
