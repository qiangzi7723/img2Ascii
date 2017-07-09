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
