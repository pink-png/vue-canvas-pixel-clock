
<script setup lang="ts">
import { ref, onMounted, onUpdated } from 'vue'
import HTMLElementTagNameMap from '../Domtype/DOM'

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

// // Create new particles
// var Particle = function (canvas) {

//     var range = Math.random() * 180 / Math.PI, // random starting point
//         spread = canvas.height, // how far away from text should the particles begin?
//         size = Math.random() * 7; // random size of particle

//     this.delta = 0.25;
//     this.x = 0;
//     this.y = 0;

//     // starting positions
//     this.px = (canvas.width / 2) + (Math.cos(range) * spread);
//     this.py = (canvas.height / 2) + (Math.sin(range) * spread);

//     this.velocityX = Math.floor(Math.random() * 10) - 5;
//     this.velocityY = Math.floor(Math.random() * 10) - 5;

//     this.size = size;
//     this.origSize = size;

//     this.inText = false;

// };

</script>

<template></template>
<style>
</style>