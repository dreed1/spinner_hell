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
    this.buttonTextColor = '#666';

    this.buttonNormalColor = '#6bd';
    this.buttonHighlightColor = '#9ce';
    this.buttonActiveColor = '#acf';
    this.buttonColor = this.buttonNormalColor;

    this.canvasHeight = $(window).height();
    this.canvasWidth = $(window).width();
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.canvasCenter = {
      x: this.canvasWidth/2, 
      y: this.canvasHeight/2
    };

    this.fire = new Fire({
      width: this.canvasWidth,
      height: this.canvasHeight,
      speed:60,
      maxPow:12,
      gravity:0,
      flameWidth:3,
      flameHeight:6,
      fadingFlameSpeed:10
    });

    this.buttonStartWidth = 212;
    this.buttonHellWidth = 200;
    this.buttonWidth = this.buttonStartWidth;

    this.startButtonText = 'TOUCH TO START';
    this.hellButtonText = 'TOUCH TO STOP';
    this.buttonText = this.startButtonText;

    this.buttonHeight = 44;
    this.buttonOriginX = this.canvasCenter.x - this.buttonWidth/2;
    this.buttonOriginY = this.canvasCenter.y - this.buttonHeight/2;

    this.spinnerSideLength = 200;
    this.spinnerOuterRadius = 90;
    this.spinnerInnerRadius = 28;
    this.spinnerOriginX = this.canvasCenter.x;
    this.spinnerOriginY = this.canvasCenter.y;
    this.spinnerColor = {
      r: 0,
      g: 0,
      b: 0
    }

    this.spinnerEnabled = false;
    this.inHell = false;
    this.burning = false;
    this.buttonVisible = true;

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
      } else if (this.inHeaven) {

      } else {
        this.spinnerEnabled = true;
        this.buttonVisible = false;
        _this.animateSpinnerChange(
            240, 10, 35
          )
        setTimeout(function() {
          _this.animateSpinnerChange(
            240, 22, 80
          )
          setTimeout(function() {
            _this.flash(10, "IT'LL NEVER LOAD", function() {
              _this.goToHell();
            });
          }, 4000)
        }, 4000)
      }
    }
  }

  Simulator.prototype.goToHell = function() {
    this.buttonVisible = true;
    this.inHell = true;
    this.buttonText = this.hellButtonText;
    this.buttonWidth = this.buttonHellWidth;
    this.burning = true;
    this.spinnerEnabled = true;
    this.spinnerWidth = 500;
    this.backgroundColor = 'black';
    this.moveButton();
    this.spinnerColor = {
      r: 255,
      g: 255,
      b: 255
    }
    this.playSong();
  }

  Simulator.prototype.playSong = function() {
    $('#video').append('<iframe width="420" height="315" src="//www.youtube.com/embed/LaeIOGFZ0Lc?autoplay=1" frameborder="0" allowfullscreen></iframe>');
  }

  Simulator.prototype.animateSpinnerChange = function(times, innerRadius, outerRadius) {
    if (times == 0) return;
    var _this = this;
    var newTimes = times - 1;
    this.spinnerInnerRadius = this.spinnerInnerRadius - (innerRadius / times);
    this.spinnerOuterRadius = this.spinnerOuterRadius - (outerRadius / times);
    setTimeout(function() {
      _this.animateSpinnerChange(newTimes, innerRadius, outerRadius);
    }, this.frameRate / 1000);
  }

  Simulator.prototype.changeSpinner = function(innerRadius, outerRadius) {
    this.spinnerInnerRadius = innerRadius;
    this.spinnerOuterRadius = outerRadius;
  }

  Simulator.prototype.goToPurgatory = function() {
    this.inHell = true;
    this.burning = true;
    this.spinnerEnabled = false;
    this.backgroundColor = '#ddd';
    this.moveButton();
    this.spinnerColor = {
      r: 255,
      g: 255,
      b: 255
    }
  }

  Simulator.prototype.goToHeaven = function() {
    this.buttonVisible = false;
    this.inHeaven = true;
    alert('Great job! You did it, I never expected you to.');
    this.inHell = false;
    this.burning = false;
    this.backgroundColor = 'white';
    this.spinnerEnabled = false;
    this.moveButton();
    this.spinnerColor = {
      r: 255,
      g: 255,
      b: 255
    }
  }

  Simulator.prototype.handleMouseHover = function(mousePosition) {
    var buttonRect = {
      originX: this.buttonOriginX,
      originY: this.buttonOriginY,
      width: this.buttonWidth,
      height: this.buttonHeight
    };
    if (this.checkPointForCollision(mousePosition, buttonRect)) {
      this.buttonColor = this.buttonHighlightColor;
      if (this.inHell) {
        this.moveButton();
      }
    } else {
      this.buttonColor = this.buttonNormalColor;
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
        _this.buttonColor = this.buttonActiveColor;
      } 
    } else {
      if (colliding) {
        _this.buttonColor = this.buttonHighlightColor;
      } else {
        _this.buttonColor = this.buttonNormalColor;
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
    this.fire.width = this.canvasWidth;
    this.fire.height = this.canvasHeight + 10 + this.fire.flameHeight * 5;
    this.canvasCenter = {
      x: this.canvasWidth/2, 
      y: this.canvasHeight/2
    };

    if (this.burning) {
      this.updateFire();
    }
  }

  Simulator.prototype.updateFire = function() {
    this.fire.update();
  }

  Simulator.prototype.draw = function() {
    //this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.drawBackground();
    if (this.inHell) {
      this.drawFire();
      this.drawDerogatoryMessage();
    }
    if (this.inHeaven) {
      this.drawHeaven();
    }
    if (this.spinnerEnabled) {
      this.drawSpinner();
    }
    if (this.buttonVisible) {
      this.drawButton();
    }
  }

  Simulator.prototype.drawBackground = function() {
    this.context.fillStyle = this.backgroundColor;
    this.context.strokeStyle = this.backgroundColor;
    this.context.rect(0, 0, this.canvasWidth, this.canvasHeight);
    this.context.stroke();
    this.context.fill();
  }  

  Simulator.prototype.drawFire = function() {
    this.fire.draw();
  }

  Simulator.prototype.drawDerogatoryMessage = function() {
    this.context.font = '28pt Calibri';
    this.context.fillStyle = '#c22';
    this.context.fillText("WELCOME TO SPINNER HELL", 400, 125);
  }

  Simulator.prototype.drawHeaven = function() {

  }

  Simulator.prototype.drawSpinner = function() {
    var lines = 20,
        lineWidth = this.spinnerSideLength / 26,
        rotation = parseInt(((new Date() - this.timeStart) / 1000) * lines) / lines;

    this.context.save();
    this.context.translate(this.spinnerOriginX, this.spinnerOriginY);
    this.context.rotate(Math.PI * 2 * rotation);

    for (var i = 0; i < lines; i++) {

        this.context.beginPath();
        this.context.rotate(Math.PI * 2 / lines);
        this.context.moveTo(this.spinnerInnerRadius, 0);
        this.context.lineTo(this.spinnerOuterRadius, 0);
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
    this.context.fillText(this.buttonText, 
      this.buttonOriginX + 10, 
      this.buttonOriginY + 20 + 10);
  }

  Simulator.prototype.writeMessage = function(canvas, message) {
    this.context.font = '38pt Calibri';
    this.context.fillStyle = 'black';
    this.context.fillText(message, 80, 95);
  }

  Simulator.prototype.getMousePos = function(canvas, evt) {
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  Simulator.prototype.flash = function(times, text, callback) {
    if (times == 0) {
      callback();
      return;
    }
    var _this = this;
    var nextTime = times - 1;

    this.backgroundColor = "white";
    this.spinnerColor = {
      r: 0,
      g: 0,
      b: 0
    }
    this.context.font = '28pt Calibri';
    this.context.fillStyle = 'white';
    this.context.fillText(text, 80, 105);

    setTimeout(function() {
      _this.backgroundColor = "black";
      _this.spinnerColor = {
        r: 255,
        g: 255,
        b: 255
      }
      _this.context.font = '28pt Calibri';
      _this.context.fillStyle = 'black';
      _this.context.fillText(text, 80, 105);
      setTimeout(function() {
        _this.flash(nextTime, text, callback);
      },1000/_this.frameRate * 2.3);
    },1000/_this.frameRate * 2.3);
  }


  $(document).ready(function() {
    sim = new Simulator();
  });
})();