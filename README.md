# n4v - An accessible, responsive navbar library (prod)

## Hosting

 - [www.n4v.bar](https://www.n4v.bar)
 - [NPM - @sunderapps/n4v/](https://www.npmjs.com/package/@sunderapps/n4v)
 - [GitHub - Sunder-Apps/n4v/](https://github.com/Sunder-Apps/n4v)

## Development

### Getting Started

1. Install <sup>7</sup>[NodeJS](https://nodejs.org/en/docs/) and <sup>8</sup>[NPM](https://docs.npmjs.com/) [here](https://nodejs.org/en/download/).
2. Install <sup>15</sup>[git](https://git-scm.com/doc) [here](https://git-scm.com/downloads) or <sup>18</sup>[GitHub Desktop here](https://desktop.github.com/).
3. Clone the <sup>16</sup>[GitHub](https://docs.github.com/en) repository.

```powershell
PS C:\proj> git clone https://github.com/Sunder-Apps/n4v.git ./n4v
```

4. Change directory into the n4v project

```powershell
PS C:\proj> cd n4v
```

5. Install development dependencies.

```powershell
PS C:\proj\n4v> npm install
```

6. Run the development server.

```powershell
PS C:\proj\n4v> npm run serve
```

7. Visit [http://localhost:42069/](http://localhost:42069/) in a browser.

### Operations

#### Branching

 - Branch from `origin/prod`.
 - Name your branch either:
    - `feature/descriptive-feature-name`
    - `bugfix/descriptive-bugfix-name`
  - Create pull requests with `origin/dev` when it's ready for testing.
  - Create pull requests with `origin/prod` when it's stable.

#### Publishing

 - Publish from `origin/prod`.
 - Ensure the version number has been updated in `package.json`.
 - Set `isDev` to `false` in `webpack.config.ts` and save.
 - Build prod:

```powershell
PS C:\proj\n4v> npm run build
```

 - Set `isDev` to `true` in `webpack.config.ts` and save.
 - Build dev:

```powershell
PS C:\proj\n4v> npm run build
```

 - Publish to <sup>8</sup>[NPM](https://docs.npmjs.com/).

```powershell
PS C:\proj\n4v> npm publish
```

 - Commit the new `dist` files and `package.json`.

```powershell
PS C:\proj\n4v> git add -A
PS C:\proj\n4v> git commit -m "Descriptive commit message"
PS C:\proj\n4v> git push
```

### Guidelines

#### General

 - File names should be lowercase (besides README, LICENSE, etc.)

#### SCSS

 - CSS variables go in `/src/scss/css-var.scss` and should be included with `@use`.
 - Global styles go in `/src/scss/global.scss` and should be included with `@use`.
 - Base styles go in `/src/scss/n4v.scss` and should be included with `@use`.
 - Theme styles go in `/src/scss/theme.scss` and should be included with `@use`.
 - SCSS variables go in `/src/scss/var.scss` and should be included with `@import`.
 - Use the variables, functions, and mixins in `/src/scss/var.scss` to generate selectors and css variable references with a prefix.
   - To use these SCSS helpers, import the file: `@import 'var';`
   - Mixins:
     - `@include css-var(height, 50px)` &rarr; `--n4v-height: 50px;`
     - `@include css-var-ref(width, height)` &rarr; `--n4v-width: var(--n4v-height);`
   - Functions:
	   - `css-var(height)` &rarr; `var(--n4v-height)` // NOTE: No string interpolation
	   - `#{neg(something)}` &rarr; `not(something)` // NOTE: Doesn't add the prefix
	   - `#{class(open)}` &rarr; `.n4v-open`
	   - `#{id(logo)}` &rarr; `#n4v-logo`
	   - `#{controls(wrapper)}` &rarr; `[controls=n4v-wrapper]`
	   - `#{expanded(true)}` &rarr; `[aria-expanded=true]`
	   - `ms(100)` &rarr; `100ms`
	   - `px(100)` &rarr; `100px`
	   - `strip-unit(100px)` &rarr; `100`

#### TypeScript

 - Main functionality goes in `/src/ts/n4vbar.ts`.
 - CSS selector tools go in `/src/ts/selectors.ts`.  Should be similar to `/src/scss/var.scss`.
 - Variable setting tools go in `/src/ts/settings.ts`.
 - Utility functions go in `/src/ts/util.ts`.
 - New classes should be:
   - Prefixed with 'n4v' and PascalCase after that.  `E.g. n4vClassName`.
   - Exported as default in the file that defines them.  `I.e. export default n4vClassName;`.
   - Imported and exported in `/src/main.ts`.
 - Event functions should be:
   - Prefixed with a lowercase 'e'.  `E.g. eHandleEvent()`.
   - Attached using `Function.bind(this)`.
   - Attached using the `n4vUtil.throttle()` function.
     - The default timeout is `n4vSettings.delay.default`.
     - The default options are `{ leading: true, trailing: true }`.
   - Casted `as EventListenerOrEventListenerObject`.

## Usage

### Getting Started

### Vanilla HTML / CSS / JavaScript

### HTML / SCSS / JavaScript with WebPack

### HTML / SCSS / TypeScript

### Angular / SCSS / TypeScript

## References

### The Basics:

 - <sup>1</sup>[HTML](https://www.w3schools.com/html/default.asp)
 - <sup>2</sup>[CSS](https://www.w3schools.com/css/default.asp)
 - <sup>3</sup>[JavaScript](https://www.w3schools.com/css/default.asp)

### Advanced:

 - <sup>4</sup>[SCSS](https://sass-lang.com/guide)
 - <sup>5</sup>[TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
 - <sup>6</sup>[PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/overview?view=powershell-7.2)
 - <sup>7</sup>[NodeJS](https://nodejs.org/en/docs/)

### Build Tools:

 - <sup>8</sup>[NPM](https://docs.npmjs.com/)
 - <sup>9</sup>[WebPack](https://webpack.js.org/guides/)
 - <sup>10</sup>[Babel](https://babeljs.io/docs/en/)

### Testing:

 - <sup>11</sup>[Jasmine](https://jasmine.github.io/pages/docs_home.html)
 - <sup>12</sup>[Karma](https://karma-runner.github.io/6.4/index.html)

### Organization:

 - <sup>13</sup>[TSDoc](https://tsdoc.org/)
 - <sup>14</sup>[ESLint](https://eslint.org/docs/user-guide/getting-started)

### Version Control:

 - <sup>15</sup>[git](https://git-scm.com/doc)
 - <sup>16</sup>[GitHub](https://docs.github.com/en)

### Software:

 - <sup>17</sup>[VS Code](https://code.visualstudio.com/)
 - <sup>18</sup>[GitHub Desktop](https://desktop.github.com/)
 - <sup>19</sup>[Discord](https://discord.com/)
