# gulp-pugbem

A plugin that adds **BEM** shortcuts to **Pug** for **Gulp**

- **[BEM](https://en.bem.info/methodology/quick-start/)**
- **[for Bootstrap](https://github.com/legostaev-vadim/gulp-pugbem/issues/1)**

# New! v2.2.0

Now you can specify your own prefixes for blocks in the **b** property:

```js
var pugbem = require('gulp-pugbem');

// block prefix
pugbem.b = 'my-';
```

**or**

```js
// default 'b-'
pugbem.b = true;
```

The prefix name can consist of letters, numbers, underscores, and hyphens. After that, only classes that begin with your prefix will be considered when parsing the **BEM** blocks. Classes of blocks without a prefix will be skipped at any depth of nesting elements. This will solve the problem associated with the use of external css-libraries, such as Bootstrap, with a large depth of nesting elements. For example:

**no prefix:**

*test.pug*

```pug
.block
  .row
    .col-lg-8.col-xl-4
      .row
        .col-lg-8.col-xl-3
          ._elem1
    .col-lg-4.col-xl-8
      ._elem2
```

*will be compiled to:*

```html
<div class="block">
  <div class="row">
    <div class="col-lg-8 col-xl-4">
      <div class="row">
        <div class="col-lg-8 col-xl-3">
          <!-- the block is the closest parent element with the class 'col-lg-8' in the file 'test.pug' -->
          <div class="col-lg-8__elem1"></div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-xl-8">
      <!-- the block is the closest parent element with the class 'col-lg-4' in the file 'test.pug' -->
      <div class="col-lg-4__elem2"></div>
    </div>
  </div>
</div>
```

**user prefix:**

*gulpfile.js*

```js
var pugbem = require('gulp-pugbem');
pugbem.b = true // default 'b-'
```

*test.pug*

```pug
//- add prefix to block name
.b-block
  .row
    .col-lg-8.col-xl-4
      .row
        .col-lg-8.col-xl-3
          ._elem1
    .col-lg-4.col-xl-8
      ._elem2
```

*will be compiled to:*

```html
<!-- user prefix will not fall into the final html -->
<div class="block">
  <div class="row">
    <div class="col-lg-8 col-xl-4">
      <div class="row">
        <div class="col-lg-8 col-xl-3">
         <!-- the block is an element with the prefix 'b-' in the file 'test.pug' -->
          <div class="block__elem1"></div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-xl-8">
      <!-- the block is an element with the prefix 'b-' in the file 'test.pug' -->
      <div class="block__elem2"></div>
    </div>
  </div>
</div>
```

**another example:**

```pug
//- when using custom prefixes, they must be added to the name of each BEM block.
//- block classes without a prefix are not taken into account in the BEM namespace when compiling!
.b-block1
  .class1.class2
    .class3
      ._elem1
    .b-block2
      ._elem2
```

*will be compiled to:*

```html
<div class="block1">
  <div class="class1 class2">
    <div class="class3">
      <div class="block1__elem1"></div>
    </div>
    <div class="block2">
      <div class="block2__elem2"></div>
    </div>
  </div>
</div>
```

# Install

```
npm install gulp-pugbem --save-dev
```

## Setup

```js
var gulp = require('gulp');
var pug = require('gulp-pug');
var pugbem = require('gulp-pugbem');

gulp.task('pages', function () {
    return gulp.src('app/**/*.pug')
        .pipe(pug({
            plugins: [pugbem]
        }))
        .pipe(gulp.dest('dist'));
});
```

## Example Usage

### Block

>.block

```pug
.header
form.search-form

.header
    nav.menu
```

*result:*

```html
<div class="header"></div>
<form class="search-form"></form>

<div class="header">
    <nav class="menu"></nav>
```

***

### Element

>.\_element

```pug
form.search-form
    input._input
    button._button Search
```

*result:*

```html
<form class="search-form">
    <input class="search-form__input">
    <button class="search-form__button">Search</button>
</form>
```

***

### Modifier

>.-modifier

#### Boolean

>>.-boolean

```pug
form.search-form.-focused
    button._button.-disabled Search
```

*result:*

```html
<form class="search-form search-form--focused">
    <button class="search-form__button search-form__button--disabled">Search</button>
</form>
```

#### Key\_Value

>>.-key\_value

```pug
form.search-form.-theme_islands
    button._button.-size_m Search
```

*result:*

```html
<form class="search-form search-form--theme_islands">
    <button class="search-form__button search-form__button--size_m">Search</button>
</form>
```

***

### Mix

>.block.\_element

```pug
.header
    form.search-form._search-form
```

*result:*

```html
<div class="header">
    <form class="search-form header__search-form"></form>
</div>
```

***

## Example

```pug
header.header
    nav.menu
        a(href="#")._logo Company
        .list
            a._item.-active(href="#") Home
            a._item(href="#") News
            a._item(href="#") Gallery
            a._item(href="#") Partners
            a._item(href="#") About
            a._item(href="#") Contacts
    h1._title Hello, World!
    .myslider._myslider
        ._slide Content
        ._slide.-active Content
        ._slide Content
    p._text Good weather
```

*result:*

```html
<header class="header">
    <nav class="menu">
        <a class="menu__logo" href="#">Company</a>
        <div class="list">
            <a class="list__item list__item--active" href="#">Home</a>
            <a class="list__item" href="#">News</a>
            <a class="list__item" href="#">Gallery</a>
            <a class="list__item" href="#">Partners</a>
            <a class="list__item" href="#">About</a>
            <a class="list__item" href="#">Contacts</a>
        </div>
    </nav>
    <h1 class="header__title">Hello, World!</h1>
    <div class="myslider header__myslider">
        <div class="myslider__slide">Content</div>
        <div class="myslider__slide myslider__slide--active">Content</div>
        <div class="myslider__slide">Content</div>
    </div>
    <p class="header__text">Good weather</p>
</header>
```

## Options

```js
var pugbem = require('gulp-pugbem');

// element separator
pugbem.e = 'string';

// modifier separator
pugbem.m = 'string';
```

### Example

```js
pugbem.e = '**';
```

```pug
form.search-form
    input._input
```

*result:*

```html
<form class="search-form">
    <input class="search-form**input">
</form>
```

***

```js
pugbem.m = '++';
```

```pug
form.search-form.-focused
```

*result:*

```html
<form class="search-form search-form++focused"></form>
```

## License

ISC License

## Author

Legostaev Vadim (*legostaev.vadim@mail.ru*)
