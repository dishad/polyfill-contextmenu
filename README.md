# polyfill-contextmenu
polyfill-contextmenu was designed for an application where you would want a custom contextmenu on a DOMElement. Whether you want to use the HTML5 `<menu>` element on Mozilla or have your own on another browser, it can all be done. All you need to do is create an options object and polyfill-contextmenu will create the markup and show it on the page.

## Example of options object
```
var options = {
  selector: '.test',
  items: {
    edit: {
      name: 'Edit'
    },
    cut: {
      name: 'Cut'
    },
    separator: { name: 'Separator' },
    copy: {
      name: 'Copy', callback: function (e) {
        alert(this);
      }
    },
    paste: {
      name: 'Paste', callback: function (e) {
        alert(this);
      }
    },
    separator2: { name: 'Separator' },
    delete: {
      name: 'Delete', callback: function (e) {
        alert(this);
      }
    },
    add: {
      name: 'Add', callback: function (e) {
        alert(this);
      }
    },
    quit: {
      name: 'Quit', callback: function (e) {
        alert(this);
      }
    }
  }
};
```
## Options attributes
`selector` is the identifier for the DOMElement you want to add the contextmenu to

`items` is an object filled with your contextmenu buttons + horizontal rules

`name` is what will be shown as the text for the button on the contextmenu, if you want the list item to be a horizontal rule, give it the name `'separator'`

`callback` callback event when user selects button on contextmenu
    
