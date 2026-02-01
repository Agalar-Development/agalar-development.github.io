# mapping-tree

a web-based viewer for minecraft class mappings. browse classes, methods, fields, and their usages across the codebase.

## features

- search across all indexed classes
- view class members (fields and methods)
- track usages and references between classes
- navigate package hierarchy
- syntax highlighted signatures

## requirements

- node.js 18+
- java (for running javap during indexing)

## setup

```
npm install
```

## indexing

before running the app, you need to index the minecraft classes:

```
node scripts/index-codebase.js
```

this parses all `.class` files in `1.21.11_unobfuscated/` and generates json data in `public/data/`.

## development

```
npm run dev
```

## build

```
npm run build
```

## project structure

```
src/
  components/    - reusable ui components
  pages/         - route pages
  main.jsx       - app entry point
scripts/
  index-codebase.js - class file indexer
public/
  data/          - generated json index files
```

## license

MIT
see license file.
