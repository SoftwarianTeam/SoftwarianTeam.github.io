;(function() {
    'use strict'
  
    function scaleImageMap() {
      function resizeMap() {
        function resizeAreaTag(cachedAreaCoords, idx) {
          function scale(coord) {
            var dimension = 1 === (isWidth = 1 - isWidth) ? 'width' : 'height'
            return (
              padding[dimension] +
              Math.floor(Number(coord) * scalingFactor[dimension])
            )
          }
  
          var isWidth = 0
          areas[idx].coords = cachedAreaCoords
            .split(',')
            .map(scale)
            .join(',')
        }
  
        var scalingFactor = {
          width: image.width / image.naturalWidth,
          height: image.height / image.naturalHeight,
        }
  
        var padding = {
          width: parseInt(
            window.getComputedStyle(image, null).getPropertyValue('padding-left'),
            10
          ),
          height: parseInt(
            window.getComputedStyle(image, null).getPropertyValue('padding-top'),
            10
          ),
        }
  
        cachedAreaCoordsArray.forEach(resizeAreaTag)
      }
  
      function getCoords(e) {
        //Normalize coord-string to csv format without any space chars
        return e.coords.replace(/ *, */g, ',').replace(/ +/g, ',')
      }
  
      function debounce() {
        clearTimeout(timer)
        timer = setTimeout(resizeMap, 250)
      }
  
      function start() {
        if (
          image.width !== image.naturalWidth ||
          image.height !== image.naturalHeight
        ) {
          resizeMap()
        }
      }
  
      function addEventListeners() {
        image.addEventListener('load', resizeMap, false) //Detect late image loads in IE11
        window.addEventListener('focus', resizeMap, false) //Cope with window being resized whilst on another tab
        window.addEventListener('resize', debounce, false)
        window.addEventListener('readystatechange', resizeMap, false)
        document.addEventListener('fullscreenchange', resizeMap, false)
      }
  
      function beenHere() {
        return 'function' === typeof map._resize
      }
  
      function getImg(name) {
        return document.querySelector('img[usemap="' + name + '"]')
      }
  
      function setup() {
        areas = map.getElementsByTagName('area')
        cachedAreaCoordsArray = Array.prototype.map.call(areas, getCoords)
        image = getImg('#' + map.name) || getImg(map.name)
        map._resize = resizeMap //Bind resize method to HTML map element
      }
  
      var /*jshint validthis:true */
        map = this,
        areas = null,
        cachedAreaCoordsArray = null,
        image = null,
        timer = null
  
      if (!beenHere()) {
        setup()
        addEventListeners()
        start()
      } else {
        map._resize() //Already setup, so just resize map
      }
    }
  
    function factory() {
      function chkMap(element) {
        if (!element.tagName) {
          throw new TypeError('Object is not a valid DOM element')
        } else if ('MAP' !== element.tagName.toUpperCase()) {
          throw new TypeError(
            'Expected <MAP> tag, found <' + element.tagName + '>.'
          )
        }
      }
  
      function init(element) {
        if (element) {
          chkMap(element)
          scaleImageMap.call(element)
          maps.push(element)
        }
      }
  
      var maps
  
      return function imageMapResizeF(target) {
        maps = [] // Only return maps from this call
  
        switch (typeof target) {
          case 'undefined':
          case 'string':
            Array.prototype.forEach.call(
              document.querySelectorAll(target || 'map'),
              init
            )
            break
          case 'object':
            init(target)
            break
          default:
            throw new TypeError('Unexpected data type (' + typeof target + ').')
        }
  
        return maps
      }
    }
  
    if (typeof define === 'function' && define.amd) {
      define([], factory)
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
      module.exports = factory() //Node for browserfy
    } else {
      window.imageMapResize = factory()
    }
  
    if ('jQuery' in window) {
      window.jQuery.fn.imageMapResize = function $imageMapResizeF() {
        return this.filter('map')
          .each(scaleImageMap)
          .end()
      }
    }
  })()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      
            // stores the device context of the canvas we use to draw the outlines
            // initialized in myInit, used in myHover and myLeave
            var hdc;
            
            // shorthand func
            function byId(e){return document.getElementById(e);}
            
            // takes a string that contains coords eg - "227,307,261,309, 339,354, 328,371, 240,331"
            // draws a line from each co-ord pair to the next - assumes starting point needs to be repeated as ending point.
            function drawPoly(coOrdStr)
            {
                var mCoords = coOrdStr.split(',');
                var i, n;
                n = mCoords.length;
            
                hdc.beginPath();
                hdc.moveTo(mCoords[0], mCoords[1]);
                for (i=2; i<n; i+=2)
                {
                    hdc.lineTo(mCoords[i], mCoords[i+1]);
                }
                hdc.lineTo(mCoords[0], mCoords[1]);
                hdc.stroke();
            }
            
            function drawRect(coOrdStr)
            {
                var mCoords = coOrdStr.split(',');
                var top, left, bot, right;
                left = mCoords[0];
                top = mCoords[1];
                right = mCoords[2];
                bot = mCoords[3];
                hdc.strokeRect(left,top,right-left,bot-top); 
            }
            
            function myHover(element)
            {
                var hoveredElement = element;
                var coordStr = element.getAttribute('coords');
                var areaType = element.getAttribute('shape');
            
                switch (areaType)
                {
                    case 'polygon':
                    case 'poly':
                        drawPoly(coordStr);
                        break;
            
                    case 'rect':
                        drawRect(coordStr);
                }
            }
            
            function myLeave()
            {
                var canvas = byId('myCanvas');
                hdc.clearRect(0, 0, canvas.width, canvas.height);
            }
            
            function myInit()
            {
                // get the target image
                var img = byId('imgID');
            
                var x,y, w,h;
            
                // get it's position and width+height
                x = img.offsetLeft;
                y = img.offsetTop;
                w = img.clientWidth;
                h = img.clientHeight;
            
                // move the canvas, so it's contained by the same parent as the image
                var imgParent = img.parentNode;
                var can = byId('myCanvas');
                imgParent.appendChild(can);
            
                // place the canvas in front of the image
                can.style.zIndex = 1;
            
                // position it over the image
                can.style.left = x+'px';
                can.style.top = y+'px';
            
                // make same size as the image
                can.setAttribute('width', w+'px');
                can.setAttribute('height', h+'px');
            
                // get it's context
                hdc = can.getContext('2d');
            
                // set the 'default' values for the colour/width of fill/stroke operations
                hdc.fillStyle = '#fa7a09';
                hdc.strokeStyle = '#d4350d';
                hdc.lineWidth = 2;
            }

            var e = document.getElementById('parent');
e.onmouseover = function() {
  document.getElementById('popup').style.display = 'block';
}
e.onmouseout = function() {
  document.getElementById('popup').style.display = 'none';
}

