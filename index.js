class walkingDog {
    constructor() {
        this.canvas = document.querySelector("#canvas")
        this.ctx = this.canvas.getContext("2d"); //建立二维渲染上下文
        this.canvas.width = window.innerWidth;  
        this.canvas.height = 200
        this.dogPictures = [];
        // 图片目录
        this.RES_PATH = "./images";
        this.IMG_COUNT = 8;
        // 记录上一帧时间
        this.lastWalkingTime = new Date()
        // 记录当前画的索引
        this.keyFrameIndex = -1
        // 小狗的位移
        this.currentX = 0
        this.dog = {
            // 一步10px
            stepDistance: 10,
            // 狗的速度
            speed: 0.15,
            // 鼠标的x坐标
            mouseX: -1,
            // 往前走停留的位置
            frontStopX: -1,
            // 往回走停留的位置,
            backStopX: window.innerWidth
        };
        this.start()
    }

    async start() {
       await this.loadResources()
        this.pictureWidth = this.dogPictures[0].naturalWidth / 2;
        this.recordMousePosition();
        window.requestAnimationFrame(this.draw.bind(this))
    }
    recordMousePosition() {
        window.addEventListener('mousemove', event => {
            this.dog.fontStopX = event.clientX - this.pictureWidth
            this.dog.backStopX = event.clientX
        })
    }
   draw (){
        // 绘制狗的图片
       let now = new Date()
       if(now - this.lastWalkingTime > 100) {
           // 计算位移 = 时间 * 速度
           let distance = (now - this.lastWalkingTime) * this.dog.speed
           console.log(this.currentX, this.canvas.width)
           this.ctx.save();
           this.currentX >= this.canvas.width - 80 ? this.currentX *= -1 : null;
           this.ctx.scale(-1, 1);
           this.currentX += distance;
           this.keyFrameIndex >= this.IMG_COUNT ? this.keyFrameIndex = 0 : null
           let img = this.dogPictures[++this.keyFrameIndex];
           this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
           this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, this.currentX, 20, 186, 162);
           this.lastWalkingTime = now;
       }
       // 给下一帧注册一个函数
       window.requestAnimationFrame(this.draw.bind(this))
   }
    loadResources() {
        let imagesPath = [];
        for (let i = 0; i <= this.IMG_COUNT; i++) {
            imagesPath.push(`${this.RES_PATH}/${i}.png`);
        }
        let works = [];
        imagesPath.forEach(item => {
            works.push(
                new Promise(resolve => {
                    let img = new Image()
                    img.onload = () => resolve(img)
                    img.src = item
                })
            )
        })

        return new Promise(resolve =>{
            Promise.all(works).then(dogPictures => {
                this.dogPictures = dogPictures
                resolve()
            })
        })
    }
}