# Key Components

This document provides an overview of the main components in the Next.js WordPress Starter project.

## Core Components

### Layout Components

#### Layout (`src/components/Layout/Layout.js`)

The main layout component that wraps all pages. It includes:
- Header
- Main content area
- Footer
- SEO metadata management (now using next/head instead of react-helmet)

```jsx
// Usage example
<Layout>
  <Section>
    <Container>
      <Content>Page content goes here</Content>
    </Container>
  </Section>
</Layout>
```

#### Header (`src/components/Header/Header.js`)

The site header component that includes:
- Logo
- Navigation menu
- Search functionality

#### Footer (`src/components/Footer/Footer.js`)

The site footer component that includes:
- Copyright information
- Social links
- Additional navigation

### Content Components

#### Section (`src/components/Section/Section.js`)

A wrapper component for page sections:

```jsx
<Section>
  <Container>
    <Content>Content goes here</Content>
  </Container>
</Section>
```

#### Container (`src/components/Container/Container.js`)

Provides a centered, width-constrained container:

```jsx
<Container>Content goes here</Container>
```

#### Content (`src/components/Content/Content.js`)

Handles main content styling and layout:

```jsx
<Content>
  <h1>Page Title</h1>
  <p>Content paragraph</p>
</Content>
```

### Post-Related Components

#### PostCard (`src/components/PostCard/PostCard.js`)

Displays a post preview in a card format:

```jsx
<PostCard post={post} />
```

#### PostHeader (`src/components/PostHeader/PostHeader.js`)

Displays post header information:

```jsx
<PostHeader
  title={post.title}
  date={post.date}
  author={post.author}
  categories={post.categories}
  featuredImage={post.featuredImage}
/>
```

#### PostSidebar (`src/components/PostSidebar/PostSidebar.js`)

Displays sidebar content for posts:

```jsx
<PostSidebar categories={categories} recentPosts={recentPosts} />
```

#### BentoPosts (`src/components/BentoPosts/BentoPosts.js`)

Displays posts in a modern bento grid layout:

```jsx
<BentoPosts posts={posts} />
```

#### MorphPosts (`src/components/MorphPosts/MorphPosts.js`)

Displays posts with a morphing/animated layout:

```jsx
<MorphPosts posts={posts} />
```

### UI Components

#### Button (`src/components/Button/Button.js`)

Styled button component:

```jsx
<Button onClick={handleClick}>Click Me</Button>
```

#### Image (`src/components/Image/Image.js`)

Enhanced image component:

```jsx
<Image 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={800} 
  height={600} 
/>
```

#### Pagination (`src/components/Pagination/Pagination.js`)

Handles paginated content:

```jsx
<Pagination 
  currentPage={currentPage} 
  pagesCount={pagesCount} 
  basePath="/posts" 
/>
```

#### FormPopup (`src/components/FormPopup/FormPopup.js`)

Popup form for capturing user information:

```jsx
<FormPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
```

#### Metadata (`src/components/Metadata/Metadata.js`)

Displays metadata about posts:

```jsx
<Metadata 
  author={post.author} 
  date={post.date} 
  categories={post.categories} 
/>
```

### Navigation Components

#### Nav (`src/components/Nav/Nav.js`)

Site navigation component:

```jsx
<Nav menu={menu} />
```

#### Breadcrumbs (`src/components/Breadcrumbs/Breadcrumbs.js`)

Displays breadcrumb navigation:

```jsx
<Breadcrumbs breadcrumbs={breadcrumbs} />
```

### Meta Components

#### Meta (`src/components/Meta/index.js`)

Manages metadata and SEO information (replaces react-helmet):

```jsx
<Meta 
  title="Page Title" 
  description="Page description" 
  meta={[{ name: 'keywords', content: 'key, words' }]} 
  link={[{ rel: 'canonical', href: 'https://example.com' }]}
/>
```

#### JsonLd (`src/components/JsonLd/index.js`)

Manages structured data:

```jsx
<JsonLd data={{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description"
}} />
```

## Component Relationships

The components follow a hierarchical structure:

```
Layout
├── Meta (SEO)
├── Header
│   ├── Nav
│   └── Logo
├── Main
│   ├── Section
│   │   └── Container
│   │       └── Content
│   │           ├── PostHeader
│   │           ├── PostCard(s)
│   │           └── Pagination
│   └── Section
│       └── Container
│           └── Content
│               └── BentoPosts/MorphPosts
└── Footer
```

## Custom Hooks Used by Components

- `useSite` - Provides site-wide data to components
- `usePageMetadata` - Manages page metadata
- `useSearch` - Provides search functionality

## Styling Approach

Components use CSS Modules with SCSS for styling:

- Each component has its own `.module.scss` file
- Styles are scoped to the component
- Global variables are imported from `src/styles/_variables.module.scss`
- Common styles are shared via SCSS mixins and functions 