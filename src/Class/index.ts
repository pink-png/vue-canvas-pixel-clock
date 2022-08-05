// 例子类
export class Particle {
    private canvaselement: HTMLElementTagNameMap['canvas']
    private range: number // 随机起点
    private spread: number  // 粒子的起始位置应该离文本多远
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
        this.canvaselement = el
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

// 时钟类
export class Pixelclock {
    public canvaselement: HTMLElementTagNameMap['canvas']
    public canvaseContext: CanvasRenderingContext2D

    public bgGrad: boolean = true // 背景梯度 
    public gradient: any // 渐变（背景）
    public height: number = 400 // 画布高度
    public key = { up: false, shift: false } // key presses
    public particles: Array<Particle> = [] //粒子阵列
    public particleColor = 'hsla(0, 0%, 100%, 0.3)' // 粒子颜色
    public mouse = { x: 0, y: 0 } // 鼠标/触摸的位置
    public press: boolean = false // 是否鼠标按下
    public quiver: boolean = false// 是否抖动 
    public text: string | number = '' // 要从中复制像素的文本
    public textSize: number = 140 // 初始文本大小
    public valentine: boolean = false
    public msgTime: number = 100 // 返回时钟前显示消息的时间
    public updateColor: boolean = true // 是否随时间更新渐变/粒子的颜色？
    public width: number = 800; // 画布宽度

    // 常量
    public FRAME_RATE = 20 // 每秒帧数目标
    public MIN_WIDTH = 800 // 画布的最小宽度
    public MIN_HEIGHT = 400 // 画布的最小高度
    public PARTICLE_NUM = 600 // （最大）要生成的粒子数
    public RADIUS = Math.PI * 2 // 粒子半径

    constructor(el: HTMLElementTagNameMap['canvas']) {
        this.canvaselement = el // canvas 元素
        this.canvaseContext = this.canvaselement.getContext('2d') as CanvasRenderingContext2D // 设置画笔
    }
    // 初始化函数
    init() {
        if (this.canvaselement == null || this.canvaseContext == null) {
            throw new Error('无法执行init函数')
        }
        console.log('this.canvaseContext', this.canvaseContext)
        // 设置维度
        this.setDimensions();

        // 设置界面的一些操作
        this.ui();

        for (var i = 0; i < this.PARTICLE_NUM; i++) {
            this.particles[i] = new Particle(this.canvaselement);
        }
        console.log('例子数组', this.particles)

        // // set defaults
        this.defaultStyles();

        // // let's do this
        setInterval(this.loop, this.FRAME_RATE);
    }

    // 初始化ui
    ui() {
        // UI: buttons and events
        var toggleOptions = document.getElementById('toggle-options') as HTMLElement,
            options = document.getElementById('options') as HTMLElement,
            onMsg = '[-] Hide Options',
            offMsg = '[+] Show Options',
            quiverBtn = document.getElementById('quivers') as HTMLElement,
            gradientBtn = document.getElementById('gradient') as HTMLElement,
            valentineifyBtn = document.getElementById('valentineify') as HTMLElement,
            colorBtn = document.getElementById('color') as HTMLElement;

        toggleOptions.innerHTML = offMsg;

        /**
         * Events
         */
        toggleOptions.addEventListener('click', function (e) {
            e.preventDefault();
            if (options.className === 'on') {
                options.className = '';
                toggleOptions.innerHTML = offMsg;
            } else {
                options.className = 'on';
                toggleOptions.innerHTML = onMsg;
            }
        }, false);

        quiverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (quiverBtn.className === 'on') {
                quiverBtn.className = '';
                this.quiver = false;
            } else {
                quiverBtn.className = 'on';
                this.quiver = true;
            }
        }, false);

        gradientBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (gradientBtn.className === 'on') {
                gradientBtn.className = '';
                this.bgGrad = false;
            } else {
                gradientBtn.className = 'on';
                this.bgGrad = true;
            }
        }, false);

        valentineifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (valentineifyBtn.className === 'on') {
                valentineifyBtn.className = '';
                this.valentine = false;
                this.msgTime = 0;
            } else {
                valentineifyBtn.className = 'on';
                this.msgTime = 60;
                this.valentine = true;
            }
        }, false);

        colorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (colorBtn.className === 'on') {
                colorBtn.className = '';
                this.updateColor = false;
            } else {
                colorBtn.className = 'on';
                this.updateColor = true;
            }
        }, false);

        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 16: // shift
                    this.key.shift = true;
                    e.preventDefault();
                    break;
                case 38: // up key
                    this.key.up = true;
                    e.preventDefault();
                    break;
            }
        }, false);

        document.addEventListener('keyup', (e) => {
            switch (e.keyCode) {
                case 16: // shift
                    this.key.shift = false;
                    e.preventDefault();
                    break;
                case 38: // space
                    this.key.up = false;
                    e.preventDefault();
                    break;
            }
        }, false);

        window.addEventListener('resize', (e) => {
            this.setDimensions();
        }, false);

        this.canvaselement.addEventListener('mousedown', (e) => {
            this.press = true;
        }, false);

        document.addEventListener('mouseup', (e) => {
            this.press = false;
        }, false);

        this.canvaselement.addEventListener('mousemove', (e) => {
            if (this.press) {
                this.mouse = this.setCoordinates(e);
            }
        }, false);

        // @TODO: add touch events
    }

    // 设置画布的尺寸
    setDimensions() {
        this.width = Math.max(window.innerWidth, this.MIN_WIDTH);
        this.height = Math.max(window.innerHeight, this.MIN_HEIGHT);

        // 调整画布的大小
        this.canvaselement.width = this.width;
        this.canvaselement.height = this.height;

        this.canvaselement.style.position = 'absolute';
        this.canvaselement.style.left = '0px';
        this.canvaselement.style.top = '0px';
    }

    setCoordinates(e: any) {
        if (e.offsetX) {
            return { x: e.offsetX, y: e.offsetY }; // use offset if available
        } else if (e.layerX) {
            return { x: e.layerX, y: e.layerY }; // firefox... make sure to position the canvas
        } else {
            // iOS. Maybe others too?
            return { x: e.pageX - this.canvaselement.offsetLeft, y: e.pageY - this.canvaselement.offsetTop };
        }
    };

    defaultStyles() {
        this.textSize = 140;
        // particle color
        this.particleColor = 'hsla(0, 0%, 100%, 0.3)';

        // color stops
        const gradientStops = {
            0: '#333333',
            0.5: '#222222'
        };

        // 创建渐变
        this.setGradient(gradientStops);
    };

    setGradient(gradientStops: any) {

        // 创建渐变
        this.gradient = this.canvaseContext.createRadialGradient(this.width / 2, this.height / 2, 0, this.width / 2, this.height / 2, this.width);
        console.log('gradient------1', this.gradient)
        console.log('gradientStops-------', gradientStops)
        // 遍历颜色停止
        for (var position in gradientStops) {
            var color = gradientStops[position];
            this.gradient.addColorStop(position, color);
        }
        console.log('gradient------2', this.gradient)
    };

    pad(number: string | number) {
        return ('0' + number).substr(-2);
    };

    // 返回时间
    getTime(amPM: boolean) {
        var date = new Date(),
            hours: number | string = date.getHours(),
            timeOfDay = '';

        if (amPM) {
            hours = (hours > 12) ? hours -= 12 : hours;
            hours = (hours == 0) ? 12 : hours;
        } else {
            hours = this.pad(hours);
        }

        var minutes = this.pad(date.getMinutes());
        var seconds = this.pad(date.getSeconds());
        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            timeString: hours + " : " + minutes + " : " + seconds
        };
    };

    setStyles(hue: string | number) {
        // color stops
        var gradientStops = {
            0: 'hsl(' + hue + ', 100%, 100%)',
            0.5: 'hsl(' + hue + ', 10%, 50%)'
        };

        // change particle color
        this.particleColor = 'hsla(' + hue + ', 10%, 50%, 0.3)';

        // create gradient
        this.setGradient(gradientStops);
    };

    // 画圆
    draw(p: Particle) {
        this.canvaseContext.fillStyle = this.particleColor;
        this.canvaseContext.beginPath();
        this.canvaseContext.arc(p.x, p.y, p.size, 0, this.RADIUS, true);
        this.canvaseContext.closePath();
        this.canvaseContext.fill();
    };

    particleText(imgData: any) {
        // console.log('imgData-----',imgData)
        var pxls = [];
        for (var w = this.width; w > 0; w -= 6) {
            for (var h = 0; h < this.width; h += 6) {
                var index = (w + h * (this.width)) * 4;
                if (imgData.data[index] > 10) {
                    pxls.push([w, h]);
                }
            }
        }
        // console.log('pxls-----',pxls)
        var count = pxls.length;
        for (var i = 0; i < pxls.length && i < this.particles.length; i++) {
            try {
                var p = this.particles[i],
                    X,
                    Y;

                if (this.quiver) {
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
                this.draw(p);

                if (this.key.up === true) {
                    p.size += 0.3;
                } else {
                    var newSize = p.size - 0.5;
                    if (newSize > p.origSize && newSize > 0) {
                        p.size = newSize;
                    } else {
                        p.size = p.origSize;
                    }
                }
            } catch (e) {
                //console.log(e);
            }
            count--;
        }
    };

    explode() {
        for (let i = 0, l = this.particles.length; i < l; i++) {
            let p = this.particles[i];

            if (p.inText) {

                let ax = this.mouse.x - p.px,
                    ay = this.mouse.y - p.py,
                    angle = Math.atan2(ay, ax),
                    polarity,
                    C = Math.cos(angle),
                    S = Math.sin(angle);

                // change polarity
                // attract particles if mouse pressed, repel if shift + mousedown
                polarity = (this.key.shift === true) ? -1 : 1;

                p.x += polarity * (Math.pow((C - 1), 2) - 1) + p.velocityX * p.delta;
                p.y += polarity * (Math.pow((S - 1), 2) - 1) + p.velocityY * p.delta;

                // set previous positions
                p.px = p.x;
                p.py = p.y;
                console.log('绘制前的粒子数组', p)
                this.draw(p);
            }
        }
    };


    // 动画循环  这里必须使用箭头函数，不然this的指向会有问题
    loop = () => {

        // 清除文本

        if (this.canvaseContext) {
            // (this.canvaselement.getContext('2d') as CanvasRenderingContext2D).clearRect(0, 0, this.width, this.height);
            this.canvaseContext.clearRect(0, 0, this.width, this.height);
        }

        let time = this.getTime(true);
        this.textSize = 140;

        // 在画布上绘制文本
        if (this.valentine === true) {
            if (this.msgTime > 0) {
                this.textSize = 180;
                this.text = '?';
                this.msgTime--;
            } else {
                this.text = time.timeString;
            }
            // valentine-ify 通过将色调设置为粉红色，可以进行调整
            this.setStyles(300);

        } else if (this.updateColor === true && this.bgGrad === true) {
            // changing color with time
            // @TODO: come up with something better, this is a hacky implementation
            let color = time.hours + time.minutes + time.seconds;
            this.setStyles(color);
            this.text = time.timeString;
        } else {
            this.defaultStyles();
            this.text = time.timeString;
        }

        this.canvaseContext.fillStyle = "rgb(255, 255, 255)";
        this.canvaseContext.textBaseline = "middle";
        this.canvaseContext.font = this.textSize + "px 'Avenir', 'Helvetica Neue', 'Arial', 'sans-serif'";
        this.canvaseContext.fillText(this.text, (this.width - this.canvaseContext.measureText(this.text).width) * 0.5, this.height * 0.5);

        // copy pixels
        let imgData = this.canvaseContext.getImageData(0, 0, this.width, this.height);

        // clear canvas, again
        this.canvaseContext.clearRect(0, 0, this.width, this.height);

        if (this.bgGrad === true) {
            // draw gradient
            this.canvaseContext.fillStyle = this.gradient;
            this.canvaseContext.fillRect(0, 0, this.width, this.height);
        }

        if (this.press === false) {
            // reset particles
            for (let i = 0, l = this.particles.length; i < l; i++) {
                let p = this.particles[i];
                p.inText = false;
            }
            this.particleText(imgData);
        } else {
            this.explode();
        }
    };
}