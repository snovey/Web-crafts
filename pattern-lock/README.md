# Description

![Pattern-lock](https://github.com/snovey/Web-crafts/raw/master/images/pattern-lock.gif)

Easier to create a pattern lock.

Online demo: [pattern-lock](https://www.snovey.com/Web-crafts/pattern-lock/demo.html)

# Quick Start

```html
<canvas id="password" width="300px" height="300px" style="display: inline-block;">
```
```javascript
let x = new Wlock({
  container: 'password'
});
```

# API

## init

```javascript
let x = new Wlock({
  /**
   * @param {String} row
   * @param {Number} column
   * @param {Number} opacity background alpha
   * @param {Number} lineColor
   * @param {String} pointBackColor
   * @param {String} pointBorderColor
   * @param {Number} radius touch point radius
   * @param {String} backgroundColor
   */
  container: 'password',
  //option
  row: 3, //default
  //option
  column: 3, //default
  //option
  opacity: 0.0, //default
  //option
  lineColor: 'springgreen', //default
  //option
  pointBackColor: 'white', //default
  //option
  pointBorderColor: 'grey', //default
  //option
  radius: 25, //default
  //option
  backgroundColor: 'whitesmoke' //default
});

x.init() //init
```

## get input

```javascript
/**
 * @return {Array} password
 */
x.password
```

Returns an array of objects containing the order of touch points.

If you want to store or transfer the array of objects, you can call the `JSON.stringify ()` function.

## clear input
```javascript
x.clear();
```

## Temporarily change the changeColor

```javascript
x.changeColor({
  pointBorderColor: 'red',
  lineColor: 'yellow'
});
```

This method can be used for error warnings and may need to be used in conjunction with the `setTimeout()` function.

# Note

The size of the canvas is specified by the `width` and` height` attributes of the element, and not by CSS.

If you are interest in how to make this project, please visit [my blog](https://www.snovey.com/2017/04/pattern-lock/).
