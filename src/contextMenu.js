exports.contextMenu = function (options) {
  var stopEvent = function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
  },

  /**
   *  Contains all listeners and turns menu on/off
   */
  contextHelpers = {
    // Current hovered context menu option
    index: 0,

    // Turns contextmenu display on
    toggleMenuOn: function (contextmenu) {
      if (contextmenu.style.display = 'none') {
        contextmenu.style.display = 'block';
      }
    },

    // Turns contextmenu display off
    toggleMenuOff: function (contextmenu) {
      if (contextmenu.style.display === '' || contextmenu.style.display === 'block') {
        contextmenu.style.display = 'none';
      }
    },

    findHover: function (contextmenu) {
      var items = contextmenu.getElementsByClassName(classNames.selectable),
        i;

      for (i = 0; i < items.length; i++) {
        if (items[i].classList.contains(classNames.hover)) {
          return i;
        }
      }
    },

    // Listens for keycodes like arrowkeys/ESC
    keydownListener: function (contextmenu) {
      var self = this,
        selection = contextmenu.getElementsByClassName(classNames.selectable);


      window.addEventListener('keydown', function (e) {
        var hovered;

        switch (e.keyCode) {
          // ESC Key
          case 27:
            self.toggleMenuOff(contextmenu);
            self.index = 0;
            break;

          // Up arrow
          case 38:
            hovered = contextmenu.getElementsByClassName(classNames.hover);
            // focus on <li> element above hovered & focused <li>
            if (contextmenu.style.display === 'block') {
              self.index--;

              if (self.index === -1) {
                self.index = selection.length - 1;
              }

              if (hovered.length === 0) {
                selection[self.index].classList.add(classNames.hover);
              }
              else {
                self.index = self.findHover(contextmenu);
                self.index--;
                hovered[0].classList.remove(classNames.hover);

                if (self.index === -1) {
                  self.index = selection.length - 1;
                }

                selection[self.index].classList.add(classNames.hover);
              }
            }
            break;

          // Down arrow
          case 40:
            hovered = contextmenu.getElementsByClassName(classNames.hover);

            // focus on <li> element below hovered & focused <li>
            if (contextmenu.style.display === '' || contextmenu.style.display === 'block') {

              if (self.index === selection.length) {
                self.index = 0;
              }

              if (hovered.length === 0) {
                selection[self.index].classList.add(classNames.hover);
              }
              else {
                self.index = self.findHover(contextmenu);
                self.index++;
                hovered[0].classList.remove(classNames.hover);

                if (self.index === selection.length) {
                  self.index = 0;
                }

                selection[self.index].classList.add(classNames.hover);
              }
            }
            break;
          case 13:
            hovered = contextmenu.getElementsByClassName(classNames.hover);
            if (hovered.length > 0) {
              hovered[0].click();
              self.index = 0;
              self.toggleMenuOff(contextmenu);
            }
            break;
        }
      });
    },

    // Turn menu off if window is resized
    resizeListener: function (contextmenu) {
      var self = this;
      window.onresize = function (e) {
        self.toggleMenuOff(contextmenu);
      };
    },

    rightClickListener: function (contextmenu) {
      var self = this,
        hovered = contextmenu.getElementsByClassName(classNames.hover),
        i;
      contextmenu.addEventListener('mousedown', function (e) {
        stopEvent(e);
        if (e.button === 0 || e.button === 1 || e.button === 2) {
          e.target.click();
          self.toggleMenuOff(contextmenu);
          if (hovered.length !== 0) {
            for (i = 0; i < hovered.length; i++) {
              hovered[i].classList.remove(classNames.hover);
            }
            document.body.removeChild(document.body.querySelector('.contextMenuBackground'));
          }
        }
      });
    },

    openContextListener: function (element, contextmenu) {
      var self = this;
      element.addEventListener('contextmenu', function (e) {
        stopEvent(e);
        self.self = 0;
        contextHelpers.toggleMenuOn(contextmenu);
        positionMenu.setMenuPosition(e, contextmenu);
        makeBackground(contextmenu);
      });
    }
  },

  /**
   *  Contains all helper functions to position menu next to mouse
   */
  positionMenu = {
    /**
     * Gets exact position of where user clicked
     * @param {Object} e - Click event
     * @return {Object} Returns the x and y position
     */
    getMousePosition: function (e) {
      var posx = 0,
        posy = 0;

      if (!e) {
        e = window.event;
      }

      // Gets mouse position
      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      }
      else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      return {
        x: posx,
        y: posy
      };
    },

    /**
     * Positions the contextmenu properly
     * @param {Object} e - Event for right-clicking task
     */
    setMenuPosition: function (e, menu) {
      var clickCoords = this.getMousePosition(e),
        menuWidth = menu.offsetWidth + 3,
        menuHeight = menu.offsetHeight + 3,

        windowWidth = window.innerWidth,
        windowHeight = window.innerHeight;

      // X coordinates
      if ((windowWidth - clickCoords.x) < menuWidth) {
        menu.style.left = windowWidth - menuWidth + 'px';
      }
      else {
        menu.style.left = clickCoords.x + 'px';
      }

      // Y coordinates
      if ((windowHeight - clickCoords.y) < menuHeight) {
        menu.style.top = windowHeight - menuHeight + 'px';
      }
      else {
        menu.style.top = clickCoords.y + 'px';
      }
    }
  },

  supportsContext = ('HTMLMenuItemElement' in window),

  classNames = {
    item: 'contextMenuItem',
    hover: 'contextMenuHover',
    disabled: 'contextMenuDisabled',
    visible: 'contextMenuVisible',
    notSelectable: 'contextMenuNoSelect',
    selectable: 'contextMenuSelect',
    icon: 'contextMenuIcon'
  },

  setCss = function () {
    var fileref = document.createElement('link');
    
    fileref.setAttribute('rel', 'stylesheet');
    fileref.setAttribute('type', 'text/css');
    fileref.setAttribute('href', 'src/contextMenu.css');

    if (typeof fileref !== undefined) {
      document.getElementsByTagName('head')[0].appendChild(fileref);
    }
  },

  getSelector = function (selector) {
    return selector[0].match(/^[a-zA-Z0-9]+$/) ? selector : selector.slice(1, selector.length);
  },

  makeUl = function (options) {
    var ul = document.createElement('ul'),
      keys = Object.keys(options.items),
      len = keys.length;

    ul.classList.add('contextMenuList');
    ul.classList.add('menu');

    if (options.items) {
      for (i = 0; i < len; i++) {
        makeLi(options.items[keys[i]], ul);
      }
    }
    return ul;
  },

  makeLi = function (key, ul) {
    var li = document.createElement('li');
    li.classList.add(classNames.item);
    if (key.name.toLowerCase() === 'separator') {
      li.classList.add('contextMenuSeparator');
      li.classList.add('contextMenuNoSelect');
    }
    else {
      li.classList.add(classNames.icon);
      li.classList.add(classNames.selectable);

      if (key.callback !== undefined) {
        li.onclick = key.callback;
      }
      makeSpan(key.name, li);
    }
    ul.appendChild(li);
  },

  makeSpan = function (inner, li) {
    var span = document.createElement('span');
    span.innerText = inner;
    li.appendChild(span);
  },

  makeBackground = function (menu) {
    var div = document.createElement('div');

    div.classList.add('contextMenuBackground');
    div.style.width = window.innerWidth.toString() + 'px';
    div.style.height = window.innerHeight.toString() + 'px';
    document.body.appendChild(div);


    div.addEventListener('mousedown', function (e) {
      var hovered = menu.getElementsByClassName(classNames.hover),
        i;
      if (e.button === 0 || e.button === 1 || e.button === 2) {
        contextHelpers.toggleMenuOff(menu);
        if (hovered.length !== 0) {
          for (i = 0; i < hovered.length; i++) {
            hovered[i].classList.remove(classNames.hover);

          }
        }
        contextHelpers.index = 0;
        document.body.removeChild(div);
      }
    }, false);

  },

  makeMenu = function(element, options) {
    var menu = document.createElement('menu'),
        keys = Object.keys(options.items),
        len = keys.length;
        
    menu.type = 'context';
    menu.id = getSelector(options.selector);
    element.setAttribute('contextmenu', getSelector(options.selector));

    if (options.items) {
      for (i = 0; i < len; i++) {
        makeMenuItem(options.items[keys[i]], menu);
      }
    }
    return menu;
  },

  makeMenuItem = function (key, menu) {
    var mi = document.createElement('menuitem');
    mi.label = key.name;

    mi.classList.add(classNames.item);
    if (key.name.toLowerCase() === 'separator') {
      mi = document.createElement('hr');
    }
    else {
      if (key.callback !== undefined) {
        mi.onclick = key.callback;
      }
    }
    menu.appendChild(mi);
  },

  removeHover = function (e) {
    stopEvent(e);
    if (e.target.classList.contains(classNames.hover)) {
      e.target.classList.remove(classNames.hover);
    }
    else if (e.target.nodeName === 'SPAN') {
      e.target.parentNode.classList.remove(classNames.hover);
    }
  },

  element = document.querySelector(options.selector),
  items,
  hovered,
  spans,
  contextmenu;

  if (supportsContext) {
    contextmenu = makeMenu(element, options);
  }
  else {
    contextmenu = makeUl(options);
    items = document.getElementsByClassName(classNames.item),
    hovered = document.getElementsByClassName(classNames.hover),
    spans = document.querySelectorAll('.contextMenuItem span');

    setCss();    
    contextHelpers.toggleMenuOff(contextmenu);
    contextHelpers.keydownListener(contextmenu);
    contextHelpers.resizeListener(contextmenu);
    contextHelpers.rightClickListener(contextmenu);
    contextHelpers.openContextListener(element, contextmenu);

    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('mouseout', removeHover, false);
    }

    for (var i = 0; i < spans.length; i++) {
      spans[i].addEventListener('mouseout', removeHover, false);
    }

    document.addEventListener('mouseover', function (e) {
      if (e.target.classList.contains(classNames.selectable)) {
        if (hovered.length > 0) {
          hovered[0].classList.remove(classNames.hover);
        }
        e.target.classList.add(classNames.hover);
      }
      else if (e.target.nodeName === 'SPAN' && e.target.parentNode.classList.contains(classNames.item)) {
        e.target.parentNode.classList.add(classNames.hover);
      }
    });
  }

  document.body.appendChild(contextmenu);    
};
