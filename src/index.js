const html2canvas = require('./html2canvas');

class Img2Ascii {
    constructor(imgSrc, cb) {
        this.size = {}
        this.img = null;
        this.cb = cb;
        this.data = null;
        this.init(imgSrc);
    }
    init(imgSrc) {
        const promise = this.importImg(imgSrc);
        promise.then(() => {
            const data = this.initCanvas();
            this.toAscii(data);
        })
    }

    importImg(imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.img = img;
                resolve();
            }
        });
    }

    initCanvas() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        this.size.width = 100;
        this.size.height = 100 * this.img.height / this.img.width;
        canvas.width = this.size.width;
        canvas.height = this.size.height;
        context.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.size.width, this.size.height);
        // document.body.appendChild(canvas);
        const imgRawData = context.getImageData(0, 0, this.size.width, this.size.height);
        this.data = imgRawData.data;
    }

    toAscii() {
        const diving = this.size.width * 4;
        //转换灰度图
        const arr = ["M", "N", "H", "Q", "$", "O", "C", "?", "7", ">", "!", ":", "–", ";", "."]
        const result = [];
        const data = this.data;
        for (let i = 0, len = data.length; i < len; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            const num = Math.floor(avg / 18);
            result.push(arr[num]);
            if ((i + 4) % diving == 0 && i != 0) {
                result.push("<br>");
            }
        }
        const dom = document.createElement('pre');
        this.setStyle(dom);
        dom.innerHTML = result.join('');
        document.body.appendChild(dom);
        this.toImage(dom);
    }

    setStyle(dom) {
        dom.style.cssText += 'display:inline-block;' +
            'font-size:10px;' +
            'font-family:monospace;' +
            'line-height:7px;' +
            'white-space:nowrap;' +
            'margin:0;' +
            'padding:0;'
    }

    toImage(dom) {
        // 避免图片失真
        dom.style.transform = dom.style.webkitTransform = 'scale(2)';
        dom.style.transformOrigin = dom.style.webkitTransformOrigin = '0 0';
        const cb = this.cb;
        const img = this.img;
        // 性能瓶颈主要在于html2canvas这个插件上
        html2canvas(dom, {
            onrendered: function(c) {
                c.style.width = dom.offsetWidth + 'px';
                c.style.height = dom.offsetHeight + 'px';
                const nSrc = c.toDataURL("image/png", 1.0);
                typeof cb === 'function' && cb(nSrc, img);
            },
            width: dom.offsetWidth * 2,
            height: dom.offsetHeight * 2
        });
        dom.style.transform = dom.style.webkitTransform = 'scale(1)';
        dom.style.display = 'none';
    }
}

module.exports = Img2Ascii;
