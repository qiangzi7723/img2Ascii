img2Ascii，基于JS的图片转ASCII示意图。

### 效果

转码前图片

![image](./src/assets/av.png)

转码后图片

![image](./src/assets/av-r.png)

### 构建

    npm install 或者 yarn install

之后通过

    npm run dev

即可打开项目

### 使用

以下代码在`main.js`中

    const Img2Ascii=require('./index');
    const img=require('./assets/av.png');

    new Img2Ascii(img,(nSrc,img)=>{
        const nImg = new Image();
        nImg.src = nSrc;
        nImg.style.width = img.width + 'px';
        nImg.style.height = img.height + 'px';
        nImg.onload = () => {
            document.body.appendChild(nImg);
            document.getElementById('tip').style.display='none';
        }
    });

Img2Ascii方法需要传入两个参数，第一个参数是图片路径，第二个参数是图片转换完毕后的回调函数，需要自己在回调函数中注入新生成的图片节点，否则看不到效果。

### 实现思路

把图片在`canvas`中绘制后，利用`getImageData`接口获取图片的`rgba`，计算`rgba`值转换为对应的`ASCII`码，在适当的位置进行换行，然后整体转换便完成。

### 瓶颈

目前项目的瓶颈存在于`html2canvas`这个插件，把图片转成ASCII码在浏览器中输出是十分快速的，但是后期将输出的ASCII码转换成图片时，使用了`html2canvas`插件，这个插件在转换图片的过程中十分缓慢，导致最后的输出缓慢。接下来会把`html2canvas`这个插件换成使用别的插件实现，忘广大网友提供一些转图片的插件。

---

除此之外我还写有`draggable`拖拽库以及`ant-template`模板引擎，如果觉得不错可以给个`star`。
