(function(){
  var Simulator = function() {
    this.init();
  }

  Simulator.prototype.init = function() {
    var _this = this;
    this.frameRate = 60;
    this.timeStart = new Date();
    this.canvas = document.getElementById('hell-canvas');
    this.context = this.canvas.getContext('2d');
    this.bindEvents();
    this.backgroundColor = '#eee';
    this.buttonColor = '#dad';
    this.buttonTextColor = '#666';

    this.canvasHeight = $(window).height();
    this.canvasWidth = $(window).width();
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.canvasCenter = {
      x: this.canvasWidth/2, 
      y: this.canvasHeight/2
    };

    this.buttonWidth = 212;
    this.buttonHeight = 44;
    this.buttonOriginX = this.canvasCenter.x - this.buttonWidth/2;
    this.buttonOriginY = this.canvasCenter.y - this.buttonHeight/2;

    this.spinnerColor = {
      r: 0,
      g: 0,
      b: 0
    }

    this.spinnerEnabled = false;
    this.inHell = false;

    setInterval(function() {
      _this.loop();
    }, 1000/this.frameRate);
  }

  Simulator.prototype.bindEvents = function() {
    var _this = this;

    this.canvas.addEventListener('click', function(evt) {
      _this.handleMouseClick(_this.getMousePos(_this.canvas, evt));
    }, false);
    this.canvas.addEventListener('mousemove', function(evt) {
      _this.handleMouseHover(_this.getMousePos(_this.canvas, evt));
    }, false);
    this.canvas.addEventListener('mousedown', function(evt) {
      _this.handleMouseActive(_this.getMousePos(_this.canvas, evt), true);
    }, false);
    this.canvas.addEventListener('mouseup', function(evt) {
      _this.handleMouseActive(_this.getMousePos(_this.canvas, evt), false);
    }, false);
  }

  Simulator.prototype.handleMouseClick = function(mousePosition) {
    var _this = this;
    var buttonRect = {
      originX: this.buttonOriginX,
      originY: this.buttonOriginY,
      width: this.buttonWidth,
      height: this.buttonHeight
    };
    if (this.checkPointForCollision(mousePosition, buttonRect)) {
      if (this.inHell) {
        this.goToHeaven();
      } else {
        this.spinnerEnabled = true;
        setTimeout(function() {
          _this.inHell = true;
          _this.backgroundColor = 'black';
          _this.spinnerColor = {
            r: 255,
            g: 255,
            b: 255
          }
          _this.flash(32);
          $('hell-canvas').fire({
            mode: 'background',
            speed:90,
            maxPow:5,
            gravity:0,
            flameWidth:3,
            flameHeight:80,
            fadingFlameSpeed:8  
          });
        }, 2000);
      }
    }
  }

  Simulator.prototype.goToHeaven = function() {
    alert('great job you did it');
  }

  Simulator.prototype.handleMouseHover = function(mousePosition) {
    var buttonRect = {
      originX: this.buttonOriginX,
      originY: this.buttonOriginY,
      width: this.buttonWidth,
      height: this.buttonHeight
    };
    if (this.checkPointForCollision(mousePosition, buttonRect)) {
      this.buttonColor = "#eac";
      if (this.inHell) {
        this.moveButton();
      }
    } else {
      this.buttonColor = "#dad";
    }
  }

  Simulator.prototype.moveButton = function() {
    this.buttonOriginX = Math.random() * (this.canvasWidth - this.buttonWidth);
    this.buttonOriginY = Math.random() * (this.canvasHeight - this.buttonHeight);
  }  

  Simulator.prototype.handleMouseActive = function(mousePosition, active) {
    var _this = this,
      buttonRect = {
        originX: this.buttonOriginX,
        originY: this.buttonOriginY,
        width: this.buttonWidth,
        height: this.buttonHeight
      }, 
      colliding = this.checkPointForCollision(mousePosition, buttonRect);
    if (active) {
      if (colliding) {
        _this.buttonColor = "#cbe";
      } 
    } else {
      if (colliding) {
        _this.buttonColor = "#eac";
      } else {
        _this.buttonColor = "#dad";
      }
    }
  }

  Simulator.prototype.checkPointForCollision = function(point, rect) {
    var xCollision =  (point.x > rect.originX) && (point.x < rect.originX + rect.width);
    var yCollision =  (point.y > rect.originY) && (point.y < rect.originY + rect.height);
    return xCollision && yCollision;
  }

  Simulator.prototype.loop = function() {
    this.update();
    this.draw();
  }

  Simulator.prototype.update = function() {
    this.canvasHeight = $(window).height();
    this.canvasWidth = $(window).width();
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.canvasCenter = {
      x: this.canvasWidth/2, 
      y: this.canvasHeight/2
    };
  }

  Simulator.prototype.draw = function() {
    //this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBackground();
    if (this.spinnerEnabled) {
      this.drawSpinner();
    }
    this.drawButton();
  }

  Simulator.prototype.drawBackground = function() {
    this.context.fillStyle = this.backgroundColor;
    this.context.strokeStyle = this.backgroundColor;
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.stroke();
    this.context.fill();
  }  

  Simulator.prototype.drawSpinner = function() {
    var lines = 20,
        height = Math.min(this.canvasHeight, this.canvasWidth),
        width = Math.min(this.canvasHeight, this.canvasWidth),
        originX = this.canvasCenter.x,
        originY = this.canvasCenter.y,
        outerRadius = width / 8,
        innerRadius = width / 2.2,
        lineWidth = width / 26,
        rotation = parseInt(((new Date() - this.timeStart) / 1000) * lines) / lines;
    this.context.save();
    this.context.translate(originX, originY);
    this.context.rotate(Math.PI * 2 * rotation);

    for (var i = 0; i < lines; i++) {

        this.context.beginPath();
        this.context.rotate(Math.PI * 2 / lines);
        this.context.moveTo(outerRadius, 0);
        this.context.lineTo(innerRadius, 0);
        this.context.lineWidth = lineWidth;
        this.context.strokeStyle = "rgba(" + this.spinnerColor.r + ", " 
                                           + this.spinnerColor.g + ", " 
                                           + this.spinnerColor.b + "," 
                                           + i / lines + ")";
        this.context.stroke();
    }
    this.context.restore();
  }

  Simulator.prototype.drawButton = function() {
    if (!this.inHell) {
      this.buttonOriginX = this.canvasCenter.x - this.buttonWidth/2;
      this.buttonOriginY = this.canvasCenter.y - this.buttonHeight/2;
    }

    this.context.beginPath();
    this.context.fillStyle = this.buttonColor;
    this.context.strokeStyle = this.buttonColor;
    this.context.rect(this.buttonOriginX, 
      this.buttonOriginY, 
      this.buttonWidth, 
      this.buttonHeight);
    this.context.stroke();
    this.context.fill();
    this.context.font = '20pt Calibri';
    this.context.fillStyle = 'black';
    this.context.fillText('TOUCH TO START', 
      this.buttonOriginX + 10, 
      this.buttonOriginY + 20 + 10);
  }

  Simulator.prototype.writeMessage = function(canvas, message) {
    this.context.font = '18pt Calibri';
    this.context.fillStyle = 'black';
    this.context.fillText(message, 10, 25);
  }

  Simulator.prototype.getMousePos = function(canvas, evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  Simulator.prototype.flash = function(times) {
    if (times == 0) return;
    var _this = this;
    var nextTime = times - 1;
    this.backgroundColor = "white";
    this.spinnerColor = {
      r: 0,
      g: 0,
      b: 0
    }
    setTimeout(function() {
      _this.backgroundColor = "black";
      _this.spinnerColor = {
        r: 255,
        g: 255,
        b: 255
      }
      setTimeout(function() {
        _this.flash(nextTime)
      },1000/_this.frameRate * 2.3);
    },1000/_this.frameRate * 2.3);
  }


  $(document).ready(function() {
    sim = new Simulator();
  });
})();