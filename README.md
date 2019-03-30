# gulp-pugbem

A plugin that adds **BEM** shortcuts to **Pug** for **Gulp**

- **[BEM](https://en.bem.info/methodology/quick-start/)**
- **[for Bootstrap](https://github.com/legostaev-vadim/gulp-pugbem/issues/1)**

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
