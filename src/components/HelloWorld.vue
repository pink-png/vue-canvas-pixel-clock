<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import HTMLElementTagNameMap from '../Domtype/DOM'
const canvaselement = ref() // canvas 元素
const PARTICLE_NUM = 600 // 生成的粒子数量
const particles: Array<Particle> = [] // 粒子阵列
const FRAME_RATE = 20 // 每秒帧数目标
let width: number
let height: number
let ctx_g: CanvasRenderingContext2D //设置全局的画笔
let updateColor: boolean
let bgGrad: boolean
let RADIUS = Math.PI * 2; // 粒子半径
let key = { up: false, shift: false } // key presses
let mouse = { x: 0, y: 0 } // position of mouse / touch
// 初始化
const init = () => {
  const el = canvaselement.value
  ctx_g = el.getContext("2d") as CanvasRenderingContext2D;
  initgetContext(el)
  initcanvas(el, '800', '400')
  createparticles(el)
  FPS.initialize('canvas', 'fps');
  // setInterval(loop, FRAME_RATE);
}

// 初始化画笔
const initgetContext = (el: HTMLElementTagNameMap['canvas']) => {
  if (el === null || !el.getContext) {
    return;
  }
  const ctx_g = el.getContext("2d");
}
// 初始化画布
const initcanvas = (el: HTMLElementTagNameMap['canvas'], width?: string, height?: string, bgc?: string) => {
  const inerwidth: string | number = window.innerWidth
  const inerheight: string | number = window.innerHeight
  el.style.width = inerwidth as unknown + 'px'
  el.style.height = inerheight as unknown + 'px'
  el.style.backgroundColor = bgc ? bgc.toString() : '#cccccc'
  el.style.position = 'absolute'
  el.style.left = '0px'
  el.style.top = '0px'
}

// 创建新粒子
const createparticles = (el: HTMLElementTagNameMap['canvas']) => {
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles[i] = new Particle(el);
  }
  // console.log('粒子数组',particles)
}
class Particle {
  public canvasel: HTMLElementTagNameMap['canvas']
  public range: number // 随机起点
  public spread: number  // 粒子的起始位置应该离文本多远
  public size: number  // 颗粒的随机大小
  public delta: number
  public x: number
  public y: number
  public px: number //起始位置x左边
  public py: number //起始位置y左边
  public velocityX: number //例子滑行速度x
  public velocityY: number //例子滑行速度y
  public origSize: number
  public inText: boolean
  constructor(el: HTMLElementTagNameMap['canvas']) {
    this.canvasel = el
    this.range = Math.random() * 180 / Math.PI
    this.spread = el.height
    this.size = Math.random() * 7
    this.delta = 0.25
    this.x = 0
    this.y = 0
    this.px = (el.width / 2) + (Math.cos(this.range) * this.spread)
    this.py = (el.height / 2) + (Math.sin(this.range) * this.spread)
    this.velocityX = Math.floor(Math.random() * 10) - 5
    this.velocityY = Math.floor(Math.random() * 10) - 5
    this.origSize = this.size
    this.inText = false
  }
}

let FPS = {
  // defaults
  delta: 0,
  lastTime: 0,
  frames: 0,
  totalTime: 0,
  updateTime: 0,
  updateFrames: 0,

  initialize: function (canvasID: string, fpsID: string) {
    this.lastTime = (new Date()).getTime();
    if (!document.getElementById(fpsID) && document.getElementById(canvasID)) {
      this.createFPS(canvasID, fpsID);
    }
  },

  // create FPS div if needed
  createFPS: function (canvasID: string, fpsID: string) {
    const div = document.createElement('div');
    div.setAttribute('id', fpsID);
    const canvas = document.getElementById(canvasID) as HTMLElement;
    const parent = canvas.parentNode as HTMLElement;
    div.innerHTML = "FPS AVG: 0 CURRENT: 0";
    parent.appendChild(div);
  },

  // update FPS count
  update: function (fpsID: string) {
    const now = (new Date()).getTime();
    this.delta = now - this.lastTime;
    this.lastTime = now;
    this.updateTime += this.delta;
    this.totalTime += this.delta;
    this.frames++;
    this.updateFrames++;
    this.updateTime = 0; // reset time
    this.updateFrames = 0; // reset frames
    const elfpsID = document.getElementById(fpsID) as HTMLElement
    elfpsID.innerHTML = "FPS Average: " + Math.round(1000 * this.frames / this.totalTime) + " Current: " + Math.round(1000 * this.updateFrames / this.updateTime);
  }
}

let textSize: number
let valentine: boolean
let msgTime: number
let text: string
// 生成帧动画
let loop = function (el: HTMLElementTagNameMap['canvas']) {
  // const ctx_g = el.getContext("2d") as CanvasRenderingContext2D;
  // clear out text
  ctx_g.clearRect(0, 0, Number(el.style.width), Number(el.style.height));

  var time = getTime(true);

  textSize = 140;

  // draw text on canvas
  if (valentine === true) {
    if (msgTime > 0) {
      textSize = 180;
      text = '?';
      msgTime--;
    } else {
      text = time.timeString;
    }
    // valentine-ify it by setting hue to pink
    setStyles(300);

  } else if (updateColor === true && bgGrad === true) {
    // changing color with time
    // @TODO: come up with something better, this is a hacky implementation
    var color = time.hours + time.minutes + time.seconds;
    setStyles(color);
    text = time.timeString;
  } else {
    defaultStyles();
    text = time.timeString;
  }

  ctx_g.fillStyle = "rgb(255, 255, 255)";
  ctx_g.textBaseline = "middle";
  ctx_g.font = textSize + "px 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
  ctx_g.fillText(text, (width - ctx_g.measureText(text).width) * 0.5, height * 0.5);

  // copy pixels
  var imgData = ctx_g.getImageData(0, 0, width, height);

  // clear canvas, again
  ctx_g.clearRect(0, 0, width, height);

  if (bgGrad === true) {
    // draw gradient
    ctx_g.fillStyle = gradient;
    ctx_g.fillRect(0, 0, width, height);
  }

  let press
  if (press === false) {
    // reset particles
    for (var i = 0, l = particles.length; i < l; i++) {
      var p = particles[i];
      p.inText = false;
    }
    particleText(imgData);
  } else {
    explode();
  }
  FPS.update('fps');
};

const getTime = (amPM: boolean) => {
  var date = new Date()
  let hours: any
  hours = date.getHours()
  var timeOfDay = '';

  if (amPM) {
    hours = (hours > 12) ? hours -= 12 : hours;
    hours = (hours == 0) ? 12 : hours;
  } else {
    hours = pad(hours);   //bug------------------2
  }

  var minutes = pad(date.getMinutes());
  var seconds = pad(date.getSeconds());
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    timeString: hours + " : " + minutes + " : " + seconds
  };
};

const pad = (number: number) => {
  return ('0' + number).substr(-2);
};

let particleColor: string = 'hsla(0, 0%, 100%, 0.3)'
const setStyles = (hue: number | string) => {
  // color stops
  var gradientStops = {
    0: 'hsl(' + hue + ', 100%, 100%)',
    0.5: 'hsl(' + hue + ', 10%, 50%)'
  };

  // change particle color
  particleColor = 'hsla(' + hue + ', 10%, 50%, 0.3)';

  // create gradient
  setGradient(gradientStops);
};

let gradient: CanvasGradient  //bug-------------------1

let setGradient = (gradientStops: any) => {

  // create gradient
  gradient = ctx_g.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);

  // iterate through colorstops
  for (var position in gradientStops) {
    var color = gradientStops[position];
    gradient.addColorStop(Number(position), color);
  }
};

let defaultStyles = () => {
  textSize = 140;
  // particle color
  particleColor = 'hsla(0, 0%, 100%, 0.3)';

  // color stops
  var gradientStops = {
    0: '#333333',
    0.5: '#222222'
  };

  // create gradient
  setGradient(gradientStops);
};

let quiver: boolean
// ImageDataSettings
let particleText = (imgData: any) => {

  var pxls = [];
  for (var w = width; w > 0; w -= 6) {
    for (var h = 0; h < width; h += 6) {
      var index = (w + h * (width)) * 4;
      if (imgData.data[index] > 10) {
        pxls.push([w, h]);
      }
    }
  }

  var count = pxls.length;
  for (var i = 0; i < pxls.length && i < particles.length; i++) {
    try {
      var p = particles[i],
        X,
        Y;

      if (quiver) {
        X = (pxls[count - 1][0]) - (p.px + Math.random() * 5);
        Y = (pxls[count - 1][1]) - (p.py + Math.random() * 5);
      } else {
        X = (pxls[count - 1][0]) - p.px;
        Y = (pxls[count - 1][1]) - p.py;
      }

      // tangent
      var T = Math.sqrt(X * X + Y * Y);

      // arctangent
      var A = Math.atan2(Y, X);

      // cosine
      var C = Math.cos(A);

      // sine
      var S = Math.sin(A);

      // set new postition
      p.x = p.px + C * T * p.delta;
      p.y = p.py + S * T * p.delta;

      // set previous positions
      p.px = p.x;
      p.py = p.y;

      p.inText = true;

      // draw the particle
      draw(p);

      if (key.up === true) {
        p.size += 0.3;
      } else {
        var newSize = p.size - 0.5;
        if (newSize > p.origSize && newSize > 0) {
          p.size = newSize;
        } else {
          // p.size = m.origSize;
        }
      }
    } catch (e) {
      //console.log(e);
    }
    count--;
  }
};
let draw = (p: Particle) =>{
  ctx_g.fillStyle = particleColor;
  ctx_g.beginPath();
  ctx_g.arc(p.x, p.y, p.size, 0, RADIUS, true);
  ctx_g.closePath();
  ctx_g.fill();
};

let explode = () => {
  for (var i = 0, l = particles.length; i < l; i++) {
    var p = particles[i];

    if (p.inText) {

      var ax = mouse.x - p.px,
        ay = mouse.y - p.py,
        angle = Math.atan2(ay, ax),
        polarity,
        C = Math.cos(angle),
        S = Math.sin(angle);

      // change polarity
      // attract particles if mouse pressed, repel if shift + mousedown
      polarity = (key.shift === true) ? -1 : 1;

      p.x += polarity * (Math.pow((C - 1), 2) - 1) + p.velocityX * p.delta;
      p.y += polarity * (Math.pow((S - 1), 2) - 1) + p.velocityY * p.delta;

      // set previous positions
      p.px = p.x;
      p.py = p.y;

      draw(p);
    }
  }
};

onMounted(() => {
  init()
})
onUpdated(() => {

});

</script>

<template>
  <canvas id="canvas" ref="canvaselement">
    <p class="nope">No canvas, no particles</p>
  </canvas>
</template>

<style scoped>
</style>
