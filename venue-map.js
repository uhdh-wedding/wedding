(() => {
  'use strict';
  const c=window.WEDDING, settings=c.map || {}, $=id=>document.getElementById(id);
  const fallback=$('map-fallback'); fallback.href=$('naver-map').href;
  const status=$('map-status'), canvas=$('venue-map');
  let timeout, failed=false, resizeObserver;
  const showStatus=message=>{failed=true;clearTimeout(timeout);resizeObserver?.disconnect();$('map-status-text').textContent=message;status.hidden=false;canvas.hidden=true;};
  if(!settings.clientId){showStatus('지도 연결 준비 중입니다. 아래에서 위치를 확인해 주세요.');return;}
  if(!/^https?:$/.test(location.protocol)){showStatus('이 미리보기에서는 지도를 표시할 수 없습니다. 아래에서 위치를 확인해 주세요.');return;}
  window.navermap_authFailure=()=>showStatus('지도를 불러오지 못했습니다. 네이버지도에서 확인해 주세요.');
  const script=document.createElement('script');script.async=true;
  script.src=`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(settings.clientId)}`;
  timeout=setTimeout(()=>showStatus('지도 연결이 지연되고 있습니다. 네이버지도에서 확인해 주세요.'),15000);
  script.onerror=()=>showStatus('지도를 불러오지 못했습니다. 네이버지도에서 확인해 주세요.');
  script.onload=()=>{
    if(failed)return;
    try{
      const maps=window.naver.maps, position=new maps.LatLng(settings.latitude,settings.longitude);
      const map=new maps.Map(canvas,{center:position,zoom:settings.zoom || 16,zoomControl:true,scrollWheel:false});
      const marker=new maps.Marker({position,map,title:c.venue});
      maps.Event.addListener(marker,'click',()=>window.open(fallback.href,'_blank','noopener,noreferrer'));
      clearTimeout(timeout);status.hidden=true;
      // Card width changes must resize the map without shifting the venue marker.
      if('ResizeObserver' in window){
        resizeObserver=new ResizeObserver(()=>{
          if(failed || !window.naver?.maps || !canvas.clientWidth || !canvas.clientHeight)return;
          try{map.setSize(new maps.Size(canvas.clientWidth,canvas.clientHeight));map.setCenter(position);}
          catch{showStatus('지도를 불러오지 못했습니다. 네이버지도에서 확인해 주세요.');}
        });
        resizeObserver.observe(canvas);
      }
    }catch{showStatus('지도를 불러오지 못했습니다. 네이버지도에서 확인해 주세요.');}
  };
  document.head.append(script);
})();

