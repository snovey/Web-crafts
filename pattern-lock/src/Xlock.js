(function () {
  'use strict';
  window.Xlock = class Xlock {
    constructor(obj) {
      this.row    = +obj.row || 3;
      this.column = +obj.column || 3;
      this.backgroundColor = obj.backgroundColor || 'whitesmoke';
      this.opacity = obj.opacity || 0.0;
      this.container = obj.container;
      this.lineColor = obj.lineColor || 'springgreen';
      this.lineWidth = obj.lineWidth || 3;
      this.pointBackColor = obj.pointBackColor || 'white';
      this.pointBorderColor = obj.pointBorderColor || 'grey';
      this.radius = obj.radius || 'auto';
    }

    init () {
      this.input = [];
      this.canvas = document.getElementById(this.container);
      this.context = this.canvas.getContext('2d');
      // this.context.globalAlpha = this.opacity;
      let width = parseInt(this.canvas.getAttribute('width'));
      let height = parseInt(this.canvas.getAttribute('height'));
      this.xunit = width / (2*this.column);
      this.yunit = height / (2*this.row);
      this.radius = (this.radius === 'auto' ? Math.min(this.xunit, this.yunit) / 2 : this.radius);
      this.coor = [];
      for (let i = 0; i < this.column; i++) {
        this.coor[i] = [];
        for (let j = 0; j < this.row; j++) {
          this.coor[i].push({
            x: this.xunit * (2*i+1),
            y: this.yunit * (2*j+1),
            visit: false
          });
        }
      }
      this.drawCircle();
      this.bindEvent();
    }

    drawCircle () {
      this.context.beginPath();
      this.context.fillStyle = this.pointBackColor;
      this.context.strokeStyle = this.pointBorderColor;
      this.context.lineWidth = this.lineWidth;
      for (let i = 0; i < this.column; i++) {
        for (let j = 0; j < this.row; j++) {
          let x = this.xunit * (2*i+1);
          let y = this.yunit * (2*j+1);
          this.context.moveTo(x+this.xunit/2, y);
          this.context.arc(x, y, this.radius, 0, 2 * Math.PI, true);
        }
      }
      this.context.closePath();
      this.context.stroke();
      this.context.fill();
    }

    bindEvent () {
      let self = this;
      this.canvas.addEventListener('touchstart', function (evt) {
        evt.preventDefault();
        let pos = self.getPosition(evt);
        if (pos.hit) {
          self.input.push({
            x: pos.indexX,
            y: pos.indexY
          });
          self.coor[pos.indexX][pos.indexY].visit = true;
          self.context.beginPath();
          self.context.fillStyle = self.lineColor;
          self.context.arc(pos.recentX, pos.recentY, self.radius/2, 0, 2 * Math.PI, true);
          self.context.closePath();
          self.context.fill();
        }
      });

      this.canvas.addEventListener('touchmove', /*throttle(*/function (evt) {
        evt.preventDefault();
        self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
        self.drawCircle();
        if(self.input.length > 0) {
          self.input.reduce((prev, next) => self.drawLine(prev, next));
        }
        console.log('touchmove');
        let pos = self.getPosition(evt);
        self.context.beginPath();
        self.context.lineWidth = this.lineWidth;
        self.context.strokeStyle = self.lineColor;
        try {
          let last = self.input.slice(-1)[0];
          self.context.moveTo((2*last.x+1)*self.xunit, (2*last.y+1)*self.yunit);
        } catch (e) {
          console.log('a litte problem accured');
        }
        self.context.lineTo(pos.touchX, pos.touchY);
        self.context.closePath();
        self.context.stroke();
        if (pos.hit && !self.coor[pos.indexX][pos.indexY].visit) {
          self.input.push({
            x: pos.indexX,
            y: pos.indexY
          });
          self.coor[pos.indexX][pos.indexY].visit = true;
        }
      })/*, 10, 50, self)*/;

      this.canvas.addEventListener('touchend', function (evt) {
        evt.preventDefault();
        self.context.clearRect(0, 0, self.context.canvas.width, self.context.canvas.height);
        self.drawCircle();
      });
    }

    getPosition (evt) {
      let touchX  = evt.touches[0].clientX - evt.currentTarget.getBoundingClientRect().left;
      let touchY  = evt.touches[0].clientY - evt.currentTarget.getBoundingClientRect().top;
      let indexX  = Math.floor(touchX / (2*this.xunit));
      let indexY  = Math.floor(touchY / (2*this.yunit));
      let recentX = (2*indexX+1) * this.xunit;
      let recentY = (2*indexY+1) * this.yunit;
      let hit = Math.pow(recentX-touchX, 2)+Math.pow(recentY-touchY, 2) < Math.pow(this.radius, 2);
      let pos = {
        indexX: indexX,
        indexY: indexY,
        touchX: touchX,
        touchY: touchY,
        recentX: recentX,
        recentY: recentY,
        hit: hit
      };
      return pos;
    }

    drawLine (prev, next) {
      this.context.beginPath();
      this.context.strokeStyle = this.lineColor;
      this.context.lineWidth = this.lineWidth;
      this.context.moveTo((2*prev.x+1)*this.xunit, (2*prev.y+1)*this.yunit);
      this.context.lineTo((2*next.x+1)*this.xunit, (2*next.y+1)*this.yunit);
      this.context.moveTo((2*next.x+1)*this.xunit, (2*next.y+1)*this.yunit);
      this.context.stroke();
      this.context.closePath();

      this.context.beginPath();
      this.context.fillStyle = this.lineColor;
      this.context.arc((2*prev.x+1)*this.xunit, (2*prev.y+1)*this.yunit, this.radius/2, 0, 2 * Math.PI, true);
      this.context.arc((2*next.x+1)*this.xunit, (2*next.y+1)*this.yunit, this.radius/2, 0, 2 * Math.PI, true);
      this.context.fill();
      this.context.closePath();

      this.context.beginPath();
      this.context.strokeStyle = this.pointBorderColor;
      this.context.moveTo((2*prev.x+1.5)*this.xunit, (2*prev.y+1)*this.yunit);
      this.context.arc((2*prev.x+1)*this.xunit, (2*prev.y+1)*this.yunit, this.radius, 0, 2 * Math.PI, true);
      this.context.moveTo((2*next.x+1.5)*this.xunit, (2*next.y+1)*this.yunit);
      this.context.arc((2*next.x+1)*this.xunit, (2*next.y+1)*this.yunit, this.radius, 0, 2 * Math.PI, true);
      this.context.stroke();
      this.context.closePath();
      return next;
    }

    clear () {
      this.input = [];
      this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
      for (let i = 0; i < this.column; i++) {
        for (let j = 0; j < this.row; j++) {
          this.coor[i][j].visit = false;
        }
      }
      this.drawCircle();
    }

    changeColor (color) {
      let tempLine = this.lineColor;
      let tempPoint = this.pointBorderColor;
      this.lineColor = color.lineColor || this.lineColor;
      this.pointBorderColor = color.pointBorderColor || this.pointBorderColor;
      this.input.reduce((prev, next) => this.drawLine(prev, next));
      this.lineColor = tempLine;
      this.pointBorderColor = tempPoint;
    }
  };
})();
