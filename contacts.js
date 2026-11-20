(() => {
  'use strict';
  const $=id=>document.getElementById(id), dialog=$('contacts-dialog');
  const paths={phone:'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.69 2.79a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.83.57 2.79.69A2 2 0 0 1 22 16.92z',sms:'M3 4h18v16H3z M3 5l9 7 9-7'};
  function icon(kind){
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.6');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',paths[kind]);svg.append(path);return svg;
  }
  (window.WEDDING.contactGroups||[]).forEach(group=>{
    const column=document.createElement('section');column.className='contact-column '+(group.side==='bride'?'bride':'groom');
    const title=document.createElement('h3');title.textContent=group.title;column.append(title);
    group.people.forEach(person=>{
      const row=document.createElement('div');row.className='person-contact';
      const name=document.createElement('p');const role=document.createElement('span');role.className='contact-role';role.textContent=person.role+' ';const personName=document.createElement('span');window.appendWeddingName(personName,person.name);name.append(role,personName);
      const actions=document.createElement('div');actions.className='person-actions';
      const number=String(person.phone||'').replace(/[^+\d]/g,'');
      [['phone','전화','tel:'],['sms','문자','sms:']].forEach(([kind,label,scheme])=>{
        const control=document.createElement(number?'a':'button');
        if(number)control.href=scheme+number;
        else{control.type='button';control.disabled=true;control.title='연락처 등록 전';}
        control.setAttribute('aria-label',`${person.role} ${person.name} ${label}${number?'':' (연락처 등록 전)'}`);control.append(icon(kind));actions.append(control);
      });
      row.append(name,actions);column.append(row);
    });
    $('contact-columns').append(column);
  });
  let priorOverflow='';
  $('open-contacts').onclick=()=>{priorOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';};
  $('close-contacts').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{document.body.style.overflow=priorOverflow;$('open-contacts').focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
})();
