(()=>{'use strict';const slots=[];const meadow=new Image();meadow.onload=()=>slots.forEach(p=>renderEdges(...p));meadow.src='assets/intro/grass-extension.png';
function renderEdges(frame,img,values){
 if(!img.complete||!img.naturalWidth||!frame.clientHeight)return;
 img.style.maskImage='none';img.style.webkitMaskImage='none';
 let canvas=frame.querySelector('canvas');if(!canvas){canvas=document.createElement('canvas');canvas.className='edge-background';canvas.setAttribute('aria-hidden','true');frame.prepend(canvas);}
 const w=Math.round(frame.clientWidth*2),h=Math.round(frame.clientHeight*2);canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');

 const sw=img.naturalWidth,sh=img.naturalHeight,base=Math.min(w/sw,h/sh),zoom=values.zoom,iw=sw*base,ih=sh*base;
 const x=((w-iw)*values.x/100-w/2)*zoom+w/2,y=((h-ih)*values.y/100-h/2)*zoom+h/2,lower=y+ih*zoom;
 // Sky extension stays as before, behind the untouched original photo.
 ctx.drawImage(img,0,0,sw,2,-30,-30,w+60,h+60);
 ctx.save();ctx.filter='blur(22px)';ctx.drawImage(canvas,-30,-30,w+60,h+60);ctx.restore();
 if(lower<h&&meadow.complete&&meadow.naturalWidth){
  const eh=Math.ceil(h-lower),texture=document.createElement('canvas');texture.width=w;texture.height=eh;const t=texture.getContext('2d',{willReadFrequently:true});
  const r=Math.max(w/meadow.naturalWidth,eh/meadow.naturalHeight);t.drawImage(meadow,0,0,meadow.naturalWidth*r,meadow.naturalHeight*r);
  function mean(source,sx,sy,sw,sh){const sample=document.createElement('canvas');sample.width=32;sample.height=4;const c=sample.getContext('2d',{willReadFrequently:true});c.drawImage(source,sx,sy,sw,sh,0,0,32,4);const pixels=c.getImageData(0,0,32,4).data,avg=[0,0,0];for(let i=0;i<pixels.length;i+=4)for(let k=0;k<3;k++)avg[k]+=pixels[i+k]/128;return avg;}
  const target=mean(img,0,sh*.98,sw,sh*.02),generated=mean(texture,0,0,w,Math.min(32,eh)),pixels=t.getImageData(0,0,w,eh);
  const gain=target.map((v,k)=>Math.max(.65,Math.min(1.4,v/Math.max(1,generated[k]))));
  for(let i=0;i<pixels.data.length;i+=4)for(let k=0;k<3;k++)pixels.data[i+k]=Math.min(255,pixels.data[i+k]*gain[k]);t.putImageData(pixels,0,0);
  // No sampled edge strip: keep a clean continuous synthesized background.
  // Fade only the synthesized extension into its matching grass color.
  ctx.fillStyle='rgb('+target.map(v=>Math.round(v)).join(',')+')';ctx.fillRect(0,Math.floor(lower)-3,w,eh+6);
  ctx.save();ctx.globalAlpha=1-(Number.isFinite(values.fade)?values.fade:45)/100;ctx.drawImage(texture,0,Math.floor(lower)-2,w,eh+2);ctx.restore();
 }
}

window.setupIntroPhoto=(frame,item)=>{const img=frame.querySelector('img');if(!img)return;if(item.crop){frame.classList.add('configured-intro','cropped-intro');return new Promise(resolve=>{const source=new Image();source.onload=()=>{const crop=item.crop,canvas=document.createElement('canvas');canvas.width=Math.min(2160,source.naturalWidth*crop.width/100);canvas.height=Math.round(canvas.width*(source.naturalHeight*crop.height)/(source.naturalWidth*crop.width));canvas.getContext('2d').drawImage(source,source.naturalWidth*crop.left/100,source.naturalHeight*crop.top/100,source.naturalWidth*crop.width/100,source.naturalHeight*crop.height/100,0,0,canvas.width,canvas.height);img.src=canvas.toDataURL('image/jpeg',.95);img.decode().catch(()=>{}).then(resolve);};source.onerror=()=>resolve();source.src=img.src;});}frame.classList.add('configured-intro');img.style.objectPosition=(item.x??50)+'% '+(item.y??50)+'%';img.style.transform='scale('+(item.zoom??1)+')';const values={x:item.x??50,y:item.y??50,zoom:item.zoom??1,fade:item.fade??45};const draw=()=>renderEdges(frame,img,values);slots.push([frame,img,values]);img.addEventListener('load',draw);new ResizeObserver(draw).observe(frame);draw();return img.decode().catch(()=>{});};})();