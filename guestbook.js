(() => {
 'use strict';
 const $=id=>document.getElementById(id),write=$('guestbook-write'),remove=$('guestbook-delete');
 let page=1,deleteId,opener,overflow='',busy=false,sequence=0;
 const notice=text=>{$('guestbook-status').textContent=text;};
 async function request(url,options){
  const config=window.WEDDING.guestbook||{};
  if(config.backend==='supabase'){
   if(!config.url||!config.publishableKey)throw new Error('방명록 연결을 준비하고 있습니다.');
   if(config.publishableKey.startsWith('sb_secret_'))throw new Error('공개용 Publishable key를 설정해 주세요.');
   const base=new URL(config.url);if(base.protocol!=='https:')throw new Error('방명록 연결 주소를 확인해 주세요.');
   const method=options?.method||'GET',body=options?.body?JSON.parse(options.body):{};
   let rpc,params;
   if(method==='GET'){rpc='wedding_guestbook_list';params={p_page:Number(new URL(url,location.href).searchParams.get('page'))||1};}
   else if(method==='POST'){rpc='wedding_guestbook_create';params={p_name:body.name,p_message:body.message,p_password:body.password};}
   else if(method==='DELETE'){rpc='wedding_guestbook_delete';params={p_id:url.split('/').pop(),p_password:body.password};}
   else throw new Error('지원하지 않는 요청입니다.');
   let response;try{response=await fetch(base.origin+'/rest/v1/rpc/'+rpc,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify(params)});}catch{throw new Error('방명록에 연결하지 못했습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.');}
   let data;try{data=await response.json();}catch{throw new Error('방명록 응답을 확인하지 못했습니다.');}
   if(!response.ok){if(response.status===401||response.status===403)throw new Error('방명록 연결 키와 접근 권한 설정을 확인해 주세요.');if(data.code==='PGRST202')throw new Error('방명록 데이터베이스 설정이 필요합니다.');throw new Error('방명록 요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.');}
   if(data?.error)throw new Error(data.error);return data;
  }
  // Local server is an explicit development option, never an automatic fallback.
  if(config.backend!=='local')throw new Error('방명록 연결을 준비하고 있습니다.');
  const response=await fetch(url,options);let data;
  try{data=await response.json();}catch{throw new Error('로컬 서버를 실행한 웹 주소에서 열어주세요.');}
  if(!response.ok)throw new Error(data.error||'요청을 처리하지 못했습니다.');return data;
 }

 const send=(url,method,data)=>request(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
 function open(dialog,button){opener=button;overflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';}
 for(const dialog of [write,remove]){
  dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  dialog.addEventListener('close',()=>{document.body.style.overflow=overflow;(opener?.isConnected?opener:$('guestbook-open')).focus({preventScroll:true});});
 }
 async function load(target=page){
  const token=++sequence;
  try{
   const data=await request(`/api/guestbook?page=${target}`);if(token!==sequence)return;notice('');page=data.page;
   $('guestbook-total').textContent=`전체 ${data.total}개`;$('guestbook-empty').hidden=data.total>0;
   $('guestbook-list').replaceChildren();
   data.posts.forEach(post=>{
    const card=document.createElement('article');card.className='guestbook-card';
    const header=document.createElement('header'),name=document.createElement('strong'),button=document.createElement('button'),message=document.createElement('p'),time=document.createElement('time');
    name.textContent=post.name;button.type='button';button.className='guestbook-remove';button.textContent='삭제';button.setAttribute('aria-label',`${post.name}님의 글 삭제`);
    button.onclick=()=>{deleteId=post.id;$('guestbook-delete-form').reset();$('guestbook-delete-error').textContent='';open(remove,button);};
    message.className='guestbook-message';message.textContent=post.message;time.dateTime=new Date(post.createdAt).toISOString();time.textContent=new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'2-digit',day:'2-digit',timeZone:'Asia/Seoul'}).format(post.createdAt);
    header.append(name,button);card.append(header,message,time);$('guestbook-list').append(card);
   });
   const nav=$('guestbook-pagination');nav.replaceChildren();
   function add(label,target,disabled,current=false){const button=document.createElement('button');button.type='button';button.textContent=label;button.disabled=disabled;if(current)button.setAttribute('aria-current','page');button.onclick=()=>{notice('');load(target);};nav.append(button);}
   add('‹',page-1,page===1);const start=Math.floor((page-1)/5)*5+1;
   for(let i=start;i<=Math.min(start+4,data.pages);i++)add(String(i),i,false,i===page);
   add('›',page+1,page===data.pages);
  }catch(e){notice(e.message);}
 }
 $('guestbook-open').onclick=()=>{$('guestbook-form').reset();$('guestbook-length').textContent='0 / 500';$('guestbook-write-error').textContent='';open(write,$('guestbook-open'));};
 $('guestbook-close').onclick=()=>{if(!busy)write.close();};$('guestbook-delete-close').onclick=()=>{if(!busy)remove.close();};
 $('guestbook-message').oninput=e=>{$('guestbook-length').textContent=`${e.target.value.length} / 500`;};
 $('guestbook-form').onsubmit=async e=>{
  e.preventDefault();if(busy)return;busy=true;$('guestbook-submit').disabled=true;
  try{await send('/api/guestbook','POST',{name:$('guestbook-name').value,message:$('guestbook-message').value,password:$('guestbook-password').value});write.close();await load(1);notice('축하 메시지를 남겼습니다.');}
  catch(e){$('guestbook-write-error').textContent=e.message;}finally{busy=false;$('guestbook-submit').disabled=false;}
 };
 $('guestbook-delete-form').onsubmit=async e=>{
  e.preventDefault();if(busy)return;busy=true;$('guestbook-delete-submit').disabled=true;
  try{await send(`/api/guestbook/${deleteId}`,'DELETE',{password:$('guestbook-delete-password').value});remove.close();await load();notice('글을 삭제했습니다.');}
  catch(e){$('guestbook-delete-error').textContent=e.message;}finally{busy=false;$('guestbook-delete-submit').disabled=false;}
 };
 load();
})();
