<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import HTMLElementTagNameMap from '../Domtype/DOM'
let canvaselement = ref() // canvas 元素
const PARTICLE_NUM: number = 600 // 生成的粒子数量
const FRAME_RATE: number = 20 // 每秒帧数目标
let particles: Array<Particle> = [] // 粒子阵列
let width: number = window.innerWidth
let height: number = window.innerHeight
let ctx_g: CanvasRenderingContext2D //设置全局的画笔
let updateColor: boolean = true
let bgGrad: boolean = true
let RADIUS = Math.PI * 2; // 粒子半径
let key = { up: false, shift: false } // key presses
let mouse = { x: 0, y: 0 } // position of mouse / touch
let textSize: number
let valentine: boolean = true
let msgTime: number
let text: string
let particleColor: string = 'hsla(0, 0%, 100%, 0.3)'
let press: boolean = true
let quiver: boolean = true
let gradient: CanvasGradient

// 初始化
const init = () => {
  const el = canvaselement.value // canvas画布
  ctx_g = el.getContext("2d") // 设置画笔 
  initcanvas(el)
  createparticles(el)
  FPS.initialize('canvas', 'fps');
  loop()
  // setInterval(loop, FRAME_RATE);
}
// 初始化画布
const initcanvas = (el: HTMLElementTagNameMap['canvas'], width?: string, height?: string, bgc?: string) => {
  const inerwidth: string | number = window.innerWidth
  const inerheight: string | number = window.innerHeight
  // console.log('inerwidth',inerwidth)
  // console.log('inerheight',inerheight)
  el.style.width = inerwidth + 'px'
  el.style.height = inerheight as unknown + 'px'
  el.style.backgroundColor = bgc ? bgc.toString() : ''
  el.style.position = 'absolute'
  el.style.left = '0px'
  el.style.top = '0px'
}

// 创建新粒子
const createparticles = (el: HTMLElementTagNameMap['canvas']) => {
  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles[i] = new Particle(el);
  }
  // console.log('粒子数组', particles)
}

// 例子类
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
    this.inText = true
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
    // console.log('canvasID-----------',canvasID)
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
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
    const elfpsID = document.getElementById(fpsID) as HTMLElement
    elfpsID.innerHTML = "FPS Average: " + Math.round(1000 * this.frames / this.totalTime) + " Current: " + Math.round(1000 * this.updateFrames / this.updateTime);
    this.updateTime = 0; // reset time
    this.updateFrames = 0; // reset frames

  }
}

const pad = (number: string) => {
  return ('0' + number).substr(-2);
};


// 获取当前的时间
const getTime = (amPM: boolean) => {
  let date = new Date()
  let hours: any
  hours = date.getHours()

  if (amPM) {
    hours = (hours > 12) ? hours -= 12 : hours;
    hours = (hours == 0) ? 12 : hours;
  } else {
    hours = pad(hours);
  }

  let minutes = pad(date.getMinutes().toString());
  let seconds = pad(date.getSeconds().toString());
  return {
    hours: hours.toString(),
    minutes: minutes,
    seconds: seconds,
    timeString: hours + " : " + minutes + " : " + seconds
  };
};

// 生成帧动画
let loop = () => {
  // clear out text
  console.log('canvaselement', canvaselement)
  const elwidth = Number(canvaselement.value.style.width.replace('px', ''))
  const elheight = Number(canvaselement.value.style.height.replace('px', ''))
  // console.log('elwidth', elwidth)
  // console.log('elheight', elheight)
  ctx_g.clearRect(0, 0, elwidth, elheight) // 绘制矩形

  let time = getTime(true);
  console.log('time', time)

  textSize = 140;

  // 在画布上绘制文本
  if (valentine === true) {
    if (msgTime > 0) {
      textSize = 180;
      text = '?';
      msgTime--;
    } else {
      text = time.timeString;
    }
    // valentine-ify 通过将色调设置为粉色来增强色彩
    setStyles(300);
    console.log(111111111111)
  } else if (updateColor === true && bgGrad === true) {
    // 随着时间改变颜色
    let color = time.hours + time.minutes + time.seconds;
    setStyles(color);
    text = time.timeString;
    console.log(22222222222)
  } else {
    defaultStyles();
    text = time.timeString;
    console.log(33333333333)
  }
  console.log('数字文本------------', text)
  console.log('数字文本大小-----------', textSize)
  console.log('画笔是否可用---------', ctx_g)
  ctx_g.fillStyle = "rgb(255, 255, 255)";
  ctx_g.textBaseline = "middle";
  ctx_g.font = textSize + "px 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
  let widthposition = parseInt(((width - ctx_g.measureText(text).width) * 0.5).toString())
  let heightposition = parseInt((height * 0.5).toString())
  console.log('文字显示位置x', parseInt(((width - ctx_g.measureText(text).width) * 0.5).toString()))
  console.log('文字显示位置y', parseInt((height * 0.5).toString()));
  ctx_g.fillText(text, widthposition, heightposition);
  console.log('当前canvas元素', canvaselement)

  // copy pixels
  var imgData = ctx_g.getImageData(0, 0, width, height);
  console.log('imgData--------------', imgData)

  // clear canvas, again
  ctx_g.clearRect(0, 0, width, height);

  if (bgGrad === true) {
    // draw gradient
    ctx_g.fillStyle = gradient;
    ctx_g.fillRect(0, 0, width, height);
  }

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


let setGradient = (gradientStops: any) => {

  // 创建渐变
  // console.log('111111', width)
  gradient = ctx_g.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
  // console.log('gradient------',gradient)
  // console.log('gradientStops-------',gradientStops)

  // 遍历颜色停止
  for (let position in gradientStops) {
    let color = gradientStops[position];
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

// ImageDataSettings
let particleText = (imgData: any) => {
  console.log('width', width)
  let pxls: number[][] = [];
  for (let w = width; w > 0; w -= 6) {
    for (let h = 0; h < width; h += 6) {
      let index = (w + h * (width)) * 4;
      console.log('index------', index)
      if (imgData.data[index] > 10) {
        console.log('xxa')
        pxls.push([w, h]);
      }
    }
  }
  console.log('pxls----22222', pxls)
  let count = pxls.length;
  for (let i = 0; i < pxls.length && i < particles.length; i++) {
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

  // console.log('绘制完成的数组---------',particles)
};

// 把粒子画到页面上去
let draw = (p: Particle) => {
  ctx_g.fillStyle = particleColor;
  ctx_g.beginPath();
  ctx_g.arc(p.x, p.y, p.size, 0, RADIUS, true);
  ctx_g.closePath();
  ctx_g.fill();
};

let explode = () => {
  for (let i = 0, l = particles.length; i < l; i++) {
    let p = particles[i];
    if (p.inText) {
      let ax = mouse.x - p.px,
        ay = mouse.y - p.py,
        angle = Math.atan2(ay, ax),
        polarity,
        C = Math.cos(angle),
        S = Math.sin(angle);

      // 改变极性
      // 按住鼠标时吸引粒子，按住shift+mousedown时排斥粒子
      polarity = (key.shift === true) ? -1 : 1;

      p.x += polarity * (Math.pow((C - 1), 2) - 1) + p.velocityX * p.delta;
      p.y += polarity * (Math.pow((S - 1), 2) - 1) + p.velocityY * p.delta;

      // 设置以前的位置
      p.px = p.x;
      p.py = p.y;

      // console.log('准备把粒子画到页面上之前', p)
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
canvas {
  background: #222;
  cursor: default;
  z-index: 1;
}
</style>
