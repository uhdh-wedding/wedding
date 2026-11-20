(() => {
  'use strict';
  const c=window.WEDDING, $=id=>document.getElementById(id);
  const lat=c.map.latitude, lng=c.map.longitude, name=encodeURIComponent(c.venue);
  const mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const android=/Android/i.test(navigator.userAgent);
  const webNaver=$('naver-map').href;
  const webKakao=`https://map.kakao.com/link/to/${name},${lat},${lng}`;
  const appname=encodeURIComponent(/^https?:$/.test(location.protocol)?location.origin: 'https://map.naver.com');
  const naver=`nmap://route/car?dlat=${lat}&dlng=${lng}&dname=${name}&appname=${appname}`;
  // TMAP versions use goal* or rGo* parameters. Both describe the same destination.
  const tmap=`tmap://route?goalname=${name}&goalx=${lng}&goaly=${lat}&rGoName=${name}&rGoX=${lng}&rGoY=${lat}`;
  const stores={
    naver:android?'https://play.google.com/store/apps/details?id=com.nhn.android.nmap':'https://apps.apple.com/app/id311867728',
    tmap:android?'https://play.google.com/store/apps/details?id=com.skt.tmap.ku':'https://apps.apple.com/app/id431589174',
    kakao:android?'https://play.google.com/store/apps/details?id=com.locnall.KimGiSa':'https://apps.apple.com/app/id417698849'
  };
  let timer;
  function help(message,web,store){
    $('navigation-message').textContent=message;$('navigation-web').href=web;
    $('navigation-install').href=store;$('navigation-install').hidden=!mobile;
    $('navigation-help').hidden=false;
  }
  function launch(scheme,web,store,label){
    clearTimeout(timer);$('navigation-help').hidden=true;
    if(!mobile){help(`${label} 앱 길안내는 휴대폰에서 이용해 주세요. PC에서는 웹 지도를 확인할 수 있습니다.`,web,store);return;}
    location.href=scheme;
    timer=setTimeout(()=>{if(!document.hidden)help('앱이 열리지 않으면 설치 여부를 확인하거나 웹 지도를 이용해 주세요.',web,store);},1800);
  }
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(timer);$('navigation-help').hidden=true;}});
  window.addEventListener('pagehide',()=>clearTimeout(timer));
  $('naver-map').href=mobile?naver:webNaver;
  $('tmap').href=mobile?tmap:webNaver;
  $('kakao-map').href=webKakao;
  for(const id of ['naver-map','tmap','kakao-map'])$(id).removeAttribute('target');
  $('naver-map').onclick=e=>{e.preventDefault();launch(naver,webNaver,stores.naver,'네이버지도');};
  $('tmap').onclick=e=>{e.preventDefault();launch(tmap,webNaver,stores.tmap,'티맵');};
  const key=c.navigation?.kakaoJavaScriptKey;
  let kakaoReady=false;
  if(key&&/^https?:$/.test(location.protocol)){
    const sdk=document.createElement('script');sdk.src='https://t1.kakaocdn.net/kakao_js_sdk/2.8.4/kakao.min.js';sdk.async=true;
    sdk.onload=()=>{try{if(!window.Kakao.isInitialized())window.Kakao.init(key);kakaoReady=true;}catch{ kakaoReady=false; }};
    sdk.onerror=()=>{kakaoReady=false;};document.head.append(sdk);
  }
  $('kakao-map').onclick=e=>{
    e.preventDefault();
    if(!mobile){help('카카오내비 앱 길안내는 휴대폰에서 이용해 주세요. PC에서는 웹 지도를 확인할 수 있습니다.',webKakao,stores.kakao);return;}
    if(!kakaoReady){help('카카오내비 연결을 준비하고 있습니다. 지금은 카카오맵에서 길찾기를 이용해 주세요.',webKakao,stores.kakao);return;}
    try{window.Kakao.Navi.start({name:c.venue,x:lng,y:lat,coordType:'wgs84'});}
    catch{help('카카오내비를 열지 못했습니다. 앱 설치 여부를 확인하거나 웹 지도를 이용해 주세요.',webKakao,stores.kakao);}
  };
})();
