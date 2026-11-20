(() => {
  'use strict';
  const c = window.WEDDING;
  window.appendWeddingName=(element,name)=>{element.textContent='';if((c.memorialNames||[]).includes(name)){const icon=document.createElement('img');icon.src='assets/memorial-flower.svg';icon.alt='고인';icon.className='memorial-flower';element.append(icon);}element.append(document.createTextNode(name));};
  const $ = id => document.getElementById(id);
  const text = (id, value) => { $(id).textContent = value; };
  const safeURL = value => {
    if (!value || typeof value !== 'string') return '';
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'file:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  function photo(slot, item, alt) {
    const src = safeURL(slot.closest('.gallery') ? (item?.thumb || item?.src) : item?.src);
    if (!src) return;
    const img = document.createElement('img');
    img.alt = item.alt || alt; img.style.objectPosition = item.position || '50% 50%';
    img.decoding = 'async'; img.loading = slot.closest('.gallery') ? 'lazy' : 'eager';
    img.addEventListener('load', () => slot.querySelector('.photo-mark')?.remove());
    img.addEventListener('error', () => {
      img.remove(); const fallback = document.createElement('span');
      fallback.className = 'image-fallback'; fallback.textContent = '사진을 불러오지 못했습니다'; slot.append(fallback);
    }, { once: true });
    img.src = src; slot.append(img);
  }
  const [year, month, day] = c.date.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdays = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
  text('hero-month', ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][month-1]);
  document.querySelector('.editorial-title').setAttribute('aria-label', `Begins on ${month}월`);
  let timeLabel = '';
  if (c.time) { const [h,m] = c.time.split(':').map(Number); timeLabel = `${h < 12 ? '오전' : h < 15 ? '낮' : '오후'} ${h % 12 || 12}시${m ? ` ${m}분` : ''}`; }
  text('invitation', c.invitation);
  c.families.forEach(family => {
    const row = document.createElement('div'); row.className = 'family-row';
    if (typeof family === 'string') {
      row.textContent = family.replaceAll(' / ', ' · ');
    } else {
      const part = (value, className) => {
        const span = document.createElement('span'); span.className = className;
        if(className==='family-name')window.appendWeddingName(span,value);else span.textContent=value; row.append(span);
      };
      family.parents.forEach((name, index) => {
        if (index) part(' · ', 'family-separator');
        part(name, 'family-name');
      });
      part('의 ', 'family-relation');
      part(family.relation + ' ', 'family-relation');
      part(family.name, 'family-name');
    }
    $('families').append(row);
  });
  text('date-heading', `${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}`);
  text('wedding-time', `${weekdays[date.getDay()]}${timeLabel ? ` ${timeLabel}` : ''}`);
  const table = document.createElement('table'); table.className = 'calendar'; table.setAttribute('aria-label', `${year}년 ${month}월 예식 달력`);
  const head = table.createTHead().insertRow();
  ['일','월','화','수','목','금','토'].forEach(label => { const th = document.createElement('th'); th.scope = 'col'; th.textContent = label; head.append(th); });
  const body = table.createTBody();
  const offset = new Date(year,month-1,1).getDay(), last = new Date(year,month,0).getDate();
  for (let i = 0; i < Math.ceil((offset+last)/7)*7; i++) {
    if (i % 7 === 0) body.insertRow();
    const cell = body.rows[body.rows.length-1].insertCell(), n = i-offset+1;
    if(n > 0 && n <= last) { const span = document.createElement('span'); span.textContent = n; cell.append(span); if(n === day) { cell.className = 'wedding-day'; cell.setAttribute('aria-label', `${n}일 결혼식`); } }
  }
  $('calendar').append(table);
  // 한국 예식 시간 기준으로 계산하여 해외 기기에서도 같은 카운트다운 표시.
  const weddingTarget = Date.parse(`${c.date}T${c.time || '00:00'}:00+09:00`);
  $('countdown-note').hidden = !!c.time;
  function updateCountdown() {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((weddingTarget - now) / 1000));
    const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
    ['days','hours','minutes','seconds'].forEach((key,index) => text(`count-${key}`, String(values[index]).padStart(2,'0')));
    const koreaToday = new Date(now + 9 * 3600000).toISOString().slice(0,10);
    const calendarDays = Math.round((Date.parse(c.date) - Date.parse(koreaToday)) / 86400000);
    text('countdown-message', calendarDays > 0
      ? `다혜, 욱환이의 결혼식이 ${calendarDays}일 남았습니다.`
      : calendarDays === 0 ? '오늘, 저희 결혼합니다.' : '함께해 주신 모든 분께 감사드립니다.');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateCountdown(); });
  photo($('main-photo'), c.photos.main, '신랑 신부의 웨딩 사진');
  const introReady=[];
  c.photos.intro.slice(0,2).forEach((p,i) => { const slot=$(`intro-photo-${i}`); photo(slot,p,`인트로 사진 ${i+1}`); introReady.push(window.setupIntroPhoto(slot,p)); });
  text('venue', `${c.venue} ${c.hall}`); text('address', c.address);
  text('location-detail', c.locationDetail || '');
  if(c.venuePhone){text('venue-phone', `Tel. ${c.venuePhone}`);$('venue-phone').href='tel:'+c.venuePhone.replace(/[^+\d]/g,'');$('venue-phone').hidden=false;}
  const query = encodeURIComponent(`${c.venue} ${c.address}`.trim());
  $('naver-map').href = safeURL(c.map?.naverDirections) || `https://map.naver.com/p/search/${query}`;
  $('kakao-map').href = `https://map.kakao.com/link/search/${query}`;
  c.transport.forEach(value => {
    if(typeof value==='string'){const p=document.createElement('p');p.textContent=value;$('transport').append(p);return;}
    const block=document.createElement('div');block.className='transport-item';const title=document.createElement('h3');title.textContent=value.title;const list=document.createElement('ul');
    value.lines.forEach(line=>{
      const li=document.createElement('li');
      if(typeof line==='string')li.textContent=line;
      else {
        if(line.color){const dot=document.createElement('span');dot.className='transit-dot';dot.textContent='●';dot.style.color=line.color;dot.setAttribute('aria-hidden','true');li.append(dot);}
        if(line.note)li.className='transit-note';
        li.append(document.createTextNode((line.note?'· ':'')+line.text));
      }
      list.append(li);
    });block.append(title,list);$('transport').append(block);
  });
  let toastTimer;
  function toast(message) { text('toast', message); $('toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').classList.remove('visible'), 3000); }
  async function copy(value, message) {
    try {
      if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
      else {
        const input = document.createElement('textarea'); input.value = value; input.style.cssText = 'position:fixed;left:-9999px'; document.body.append(input); input.select();
        const ok = document.execCommand('copy'); input.remove(); if(!ok) throw new Error('copy failed');
      }
      toast(message);
    } catch { window.prompt('아래 내용을 길게 눌러 복사해 주세요.', value); }
  }
  if(c.address) { $('copy-address').hidden = false; $('copy-address').onclick = () => copy(c.address, '주소를 복사했습니다'); }
  const accounts = c.accounts.filter(a => a.name);
  $('account-section').hidden = !accounts.length;
  const accountGroups = [...new Set(accounts.map(a => a.group || '계좌 안내'))];
  accountGroups.forEach((group, index) => {
    const tab = document.createElement('button'); tab.type='button'; tab.role='tab'; tab.id=`account-tab-${index}`;
    tab.textContent=group; tab.setAttribute('aria-controls',`account-panel-${index}`); tab.setAttribute('aria-selected',String(index===0)); tab.tabIndex=index===0?0:-1;
    const panel=document.createElement('div'); panel.id=`account-panel-${index}`; panel.role='tabpanel'; panel.className='account-panel'; panel.tabIndex=0;panel.setAttribute('aria-labelledby',tab.id); panel.hidden=index!==0;
    $('account-tabs').append(tab); $('accounts').append(panel);
    tab.onclick=()=>{ [...$('account-tabs').children].forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;}); [...$('accounts').children].forEach((p,i)=>{p.hidden=i!==index;}); };
    tab.onkeydown=e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%accountGroups.length;else if(e.key==='ArrowLeft')next=(index-1+accountGroups.length)%accountGroups.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=accountGroups.length-1;else return;e.preventDefault();const target=$('account-tabs').children[next];target.click();target.focus();};
  });
  accounts.forEach(a => {
    const row = document.createElement('div'); row.className = 'account-row'; const label = document.createElement('div');
    const role = document.createElement('small'); role.textContent = a.role || '';
    const name = document.createElement('div'); name.className='account-name'; window.appendWeddingName(name,a.name);
    const detail = document.createElement('p'); detail.textContent = a.bank && a.number ? `${a.bank} ${a.number}` : '계좌 정보를 준비하고 있습니다.';
    label.append(role,name,detail);
    const button = document.createElement('button'); button.type = 'button'; button.textContent = '계좌번호 복사'; button.disabled=!(a.bank&&a.number); button.setAttribute('aria-label', `${a.name} 계좌 복사`);
    button.onclick = () => {if(a.bank&&a.number)copy(a.number,'계좌번호를 복사했습니다');};
    row.append(label,button); $('accounts').children[accountGroups.indexOf(a.group || '계좌 안내')].append(row);
  });
  const gallery = c.photos.gallery.filter(p => safeURL(p.src));
  $('gallery-empty').hidden = !!gallery.length;
  const dialog = $('lightbox'), track = $('gallery-track');
  let current=0, opener, built=false, resizeObserver;
  const slides=[];
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateCount(index){
    current=Math.max(0,Math.min(gallery.length-1,index));
    text('photo-count', `${current+1} / ${gallery.length}`);
    $('prev-photo').disabled=current===0;
    $('next-photo').disabled=current===gallery.length-1;
  }
  function showPhoto(index, smooth=true){
    updateCount(index);
    track.scrollTo({left:current*track.clientWidth,behavior:smooth&&!reduced()?'smooth':'instant'});
  }
  function buildSlides(){
    if(built)return;built=true;
    gallery.forEach((p,i)=>{
      const slide=document.createElement('div');slide.className='gallery-slide';
      slide.setAttribute('role','group');slide.setAttribute('aria-label',`사진 ${i+1} / ${gallery.length}`);
      const img=document.createElement('img');img.alt=p.alt||`웨딩 사진 ${i+1}`;
      img.loading=i===0?'eager':'lazy';img.decoding='async';img.draggable=false;
      img.onerror=()=>{img.hidden=true;const message=document.createElement('p');message.textContent='사진을 불러오지 못했습니다. 다음 사진으로 이동해 주세요.';slide.append(message);};
      img.src=safeURL(p.src);slide.append(img);track.append(slide);slides.push(slide);
    });
    if('ResizeObserver' in window){resizeObserver=new ResizeObserver(()=>{if(dialog.open)showPhoto(current,false);});resizeObserver.observe(track);}
  }
  gallery.slice(0,6).forEach((p,i)=>{
    const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`사진 ${i+1} 확대: ${p.alt||'웨딩 사진'}`);
    const slot=document.createElement('div');slot.className='photo-slot';button.append(slot);$('gallery').append(button);photo(slot,p,p.alt||`웨딩 사진 ${i+1}`);
    button.onclick=()=>{opener=button;buildSlides();dialog.showModal();document.body.style.overflow='hidden';showPhoto(i,false);};
  });
  const galleryPage=$('gallery-page');let galleryScroll=0,fullGalleryBuilt=false;
  $('gallery-total').textContent=gallery.length+'장';$('gallery-more').hidden=gallery.length<=6;
  function renderFullGallery(){if(fullGalleryBuilt)return;fullGalleryBuilt=true;gallery.forEach((p,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','사진 '+(i+1)+' 확대');const slot=document.createElement('div');slot.className='photo-slot';button.append(slot);$('gallery-all').append(button);photo(slot,p,p.alt||'웨딩 사진 '+(i+1));button.onclick=()=>{opener=button;buildSlides();dialog.showModal();document.body.style.overflow='hidden';showPhoto(i,false);};});}
  function showGalleryPage(){galleryScroll=window.scrollY;renderFullGallery();$('main').hidden=true;document.querySelector('.phone').hidden=true;galleryPage.hidden=false;window.scrollTo(0,0);$('gallery-back').focus({preventScroll:true});}
  function hideGalleryPage(){if(galleryPage.hidden)return;if(dialog.open)dialog.close();galleryPage.hidden=true;$('main').hidden=false;document.querySelector('.phone').hidden=false;window.scrollTo(0,galleryScroll);$('gallery-more').focus({preventScroll:true});}
  $('gallery-more').onclick=()=>{history.pushState({weddingGallery:true},'','#gallery-page');showGalleryPage();};
  $('gallery-back').onclick=()=>{if(history.state?.weddingGallery)history.back();else hideGalleryPage();};
  window.addEventListener('popstate',()=>{if(location.hash==='#gallery-page'){if(galleryPage.hidden)showGalleryPage();}else hideGalleryPage();});
  track.addEventListener('scroll',()=>{if(track.clientWidth)updateCount(Math.round(track.scrollLeft/track.clientWidth));},{passive:true});
  // Trackpads and touch screens scroll natively; a mouse wheel can also advance horizontally.
  track.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)&&!e.ctrlKey){e.preventDefault();track.scrollLeft+=e.deltaY;}},{passive:false});
  $('close-photo').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus();});
  $('prev-photo').onclick=()=>showPhoto(current-1);$('next-photo').onclick=()=>showPhoto(current+1);
  dialog.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(current-1);}
    if(e.key==='ArrowRight'){e.preventDefault();showPhoto(current+1);}
    if(e.key==='Home'){e.preventDefault();showPhoto(0);}
    if(e.key==='End'){e.preventDefault();showPhoto(gallery.length-1);}
  });
  const intro=$('intro'), scenes=[...intro.querySelectorAll('.scene')]; let timers=[];
  const at=(fn,ms)=>timers.push(setTimeout(fn,ms));
  function endIntro() {
    timers.forEach(clearTimeout); timers=[]; $('main').inert=false; intro.classList.add('fade-out'); document.body.classList.remove('intro-playing');
    if(intro.contains(document.activeElement)){if(document.activeElement.matches(':focus-visible'))$('replay').focus({preventScroll:true});else document.activeElement.blur();}
    at(()=>{intro.hidden=true;},450);
  }
  function startIntro() {
    document.documentElement.classList.remove("intro-loading");
    timers.forEach(clearTimeout); timers=[];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.hidden=true; $('main').inert=false; return; }
    window.scrollTo(0,0); intro.hidden=false; intro.classList.remove('fade-out'); $('main').inert=true; document.body.classList.add('intro-playing');
    scenes.forEach(s=>s.classList.remove('active')); void intro.offsetWidth; scenes[0].classList.add('active');
    const hold=c.introTiming?.photoMs||4000,gap=c.introTiming?.gapMs||400;
    let elapsed=0;
    scenes.forEach((scene,i)=>{const duration=i===0?(c.introTiming?.firstPhotoMs||hold):hold;if(i>0)at(()=>scene.classList.add('active'),elapsed);at(()=>scene.classList.remove('active'),elapsed+duration);elapsed+=duration+gap;});
    at(endIntro,elapsed);
  }
  $('skip').onclick=endIntro; $('replay').onclick=startIntro;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!intro.hidden) endIntro();});
  // 제목·본문 등 내용 묶음마다 한 번만 등장. 지원하지 않는 환경은 즉시 표시.
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('#main .section:not([data-reveal]):not(.guestbook-section) > *, .hero-bottom, .hero-english').forEach(el=>{
    if(!el.hasAttribute('data-reveal') && !el.closest('[data-reveal]')) el.setAttribute('data-reveal','');
  });
  if('IntersectionObserver' in window && !motionQuery.matches){
    const revealNodes=[...document.querySelectorAll('[data-reveal]')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    }),{threshold:0,rootMargin:'0px 0px -40px 0px'});
    revealNodes.forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});
    motionQuery.addEventListener('change',event=>{if(event.matches){observer.disconnect();revealNodes.forEach(el=>el.classList.add('is-visible'));}});
  }
  Promise.all(introReady).then(startIntro);
})();



