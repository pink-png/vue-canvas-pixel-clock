<script setup lang="ts">
import HTMLElementTagNameMap from '../Domtype/DOM'
import { ref, onMounted } from 'vue'

const canvasref: HTMLCanvasElement = ref().value
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

const pad = (number: string) => {
    return ('0' + number).substr(-2);
};

const loop = () => {
    canvasref.style.width = window.innerWidth as any + 'px'
    canvasref.style.height = window.innerHeight as any + 'px'
    canvasref.style.backgroundColor = 'hsla(0, 0%, 100%, 0.3)'
    const ctx = canvasref.getContext("2d") as CanvasRenderingContext2D;
    ctx.font = "30px Verdana";
    const time = getTime(true)
    // 创建渐变
    const gradient = ctx.createLinearGradient(0, 0, parseInt(canvasref.style.width), 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1.0, "red");
    // 用渐变填色
    ctx.fillStyle = gradient;
    ctx.fillText(time.timeString, 10, 90);
}

const init = () => {
    loop()
    // setInterval(loop,1000)
}

onMounted(() => {
    init()
})


</script>
<template>
    <canvas id="myCanvas" ref="canvasref">
    </canvas>
</template>
<style>
</style>