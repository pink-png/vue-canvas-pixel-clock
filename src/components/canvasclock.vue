<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import { Pixelclock } from '../Class/index'

// ref直接定义dom元素。直接const 定义即可
const CanvasEl = ref() // canvas元素

//操作dom元素还是跟vue2.x 一样需要在Mounted 生命周期里操作
onMounted(() => {
 new Pixelclock(CanvasEl.value).init()
})

</script>

<template>
  <canvas width="800" height="400" id="canvas" ref="CanvasEl">
    <p class="nope">No canvas, no particles</p>
  </canvas>
  <header>
    <h1 ref="text1">Particle Clock</h1>
    <div id="about">
      <a href="#" id="toggle-options"></a>
      <ul id="options">
        <li><a href="#" id="quivers" class="">Quiver</a></li>
        <li><a href="#" id="gradient" class="on">Gradient</a></li>
        <li><a href="#" id="color" class="on">Colorize</a></li>
        <li><a href="#" id="valentineify" class="">Valentine-ify</a></li>
        <li class="group"><span>Mouse down: explode and repel</span></li>
        <li><span>Mouse down + shift: explode and attract</span></li>
        <li><span>Arrow Up: increase particle size</span></li>
        <li class="group"><span>Sorry about your CPU</span></li>
        <li><span id="fps"></span></li>
      </ul>
    </div>
  </header>
</template>
<style>
* {
  margin: 0;
  outline: none;
  padding: 0;
}

canvas {
  background: #222;
  cursor: default;
  z-index: 1;
}

.nope {
  color: #fff;
  text-align: center;
  margin-top: 150px;
}

header {
  position: relative;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  width: 100%;
  z-index: 10;
}

#about {
  color: #fff;
  color: rgba(255, 255, 255, 0.5);
  display: block;
  float: right;
  margin: 20px;
  text-align: right;
  width: 50%;
}

h1 {
  color: rgba(255, 255, 255, 0.75);
  float: left;
  font-size: 10px;
  font-weight: normal;
  margin: 20px;
}

a {
  color: rgba(255, 255, 255, 0.5);
  display: inline-block;
  text-decoration: none;
  transition: 0.5s ease color;
  -moz-transition: 0.5s ease color;
  -o-transition: 0.5s ease color;
  -webkit-transition: 0.5s ease color;
}

a:hover {
  color: rgba(255, 255, 255, 0.75);
}

ul#options {
  list-style: none;
  margin: 10px 0 0;
  position: relative;
  right: 0;
  z-index: 10;
}

ul#options li {
  margin: 5px 0;
  min-width: 200px;
  opacity: 0;
  transition: 0.25s ease-in opacity;
  -moz-transition: 0.25s ease-in opacity;
  -o-transition: 0.25s ease-in opacity;
  -webkit-transition: 0.25s ease-in opacity;
}

ul#options li.group {
  margin-top: 15px;
}

ul#options li * {
  display: none;
}

ul#options li a {
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  padding: 3px 5px;
  position: relative;
  transition: 0.5s ease all;
  -moz-border-radius: 3px;
  -o-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  -moz-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  -moz-transition: 0.5s ease all;
  -o-transition: 0.5s ease all;
  -webkit-transition: 0.5s ease all;
}

ul#options li a:hover {
  color: rgba(255, 255, 255, 0.75);
}

ul#options li a.on {
  background-color: rgba(255, 255, 255, 0.8);
  color: rgba(0, 0, 0, 0.9);
  text-shadow: 0px 0px 0px;
}

ul#options li a.on:after {
  content: "\2713 ";
}

ul#options.on li {
  opacity: 1;
  right: 20px;
}

ul#options.on li * {
  display: inline-block;
}

ul#borders {}

ul#borders li {
  position: fixed;
  list-style: none;
  margin: 0;
  background-color: transparent;
  background-color: rgba(0, 0, 0, 0.05);
  z-index: 100;
}

li#top {
  height: 10px;
  left: 0;
  right: 0;
  top: 0;
}

li#right {
  bottom: 10px;
  right: 0;
  top: 10px;
  width: 10px;
}

li#bottom {
  bottom: 0;
  height: 10px;
  left: 0;
  right: 0;
}

li#left {
  bottom: 10px;
  left: 0;
  top: 10px;
  width: 10px;
}
</style>