'use strict';

const { TASKS, AI_EXAMPLES, MEDICAL_CHOICES, REVIEW_VIEW, SAMPLE_SCORES, SAMPLE_CLIPS, normaliseDigits, createModel } = require('./model.cjs');
const { createView } = require('./view.cjs');

// Maps browser events to model actions, audio, printing and downloads.
function createController({ document, window, SpeechSynthesisUtterance, Blob, URL, autoStart = true }) {
 const model = createModel(), s = model.s;
 let language = document.documentElement?.lang === 'en' ? 'en' : 'ar';
 const main = document.getElementById('main');
 const view = createView({ state: s, document, window, getLanguage: () => language, isSpeaking: () => Boolean(demoUtterance) });
 const { render, tr, translateChrome, time, icons, reviewPlayLabel, assessmentClip, syncPainFields, syncMedicalField } = view;

 let recordInterval=null,playInterval=null,toastTimer=null;

 function notify(text){const el=document.getElementById('toast');el.textContent=tr(text);el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200)}
 let demoUtterance=null;
 const speechEngine=window?.speechSynthesis;
 speechEngine?.getVoices();

 function updateReviewPlayButton(){
  const inAssessment=s.view===3;
  const button=document.getElementById(inAssessment?'play-button':'review-play');
  if(!button)return;
  const label=button.querySelector('span'),image=button.querySelector('svg');
  const clip=inAssessment?(s.segment?assessmentClip():null):SAMPLE_CLIPS[s.selected][s.reviewClip];
  label.textContent=tr(reviewPlayLabel(clip));
  image.innerHTML=icons[s.playing||demoUtterance?'pause':'play'];
 }
 function stopDemoSpeech(){
  if(!demoUtterance)return;
  demoUtterance=null;speechEngine.cancel();updateReviewPlayButton();
 }
 function speakDemoTask(clip){
  if(demoUtterance){stopDemoSpeech();return}
  if(!speechEngine||typeof SpeechSynthesisUtterance==='undefined'){notify('الصوت المولّد غير مدعوم في هذا المتصفح.');return}
  const arabic=speechEngine.getVoices().filter(v=>/^ar(?:[-_]|$)/i.test(v.lang));
  const voice=arabic.find(v=>v.localService&&/^ar[-_]SA$/i.test(v.lang))||arabic.find(v=>v.localService)||arabic[0];
  if(!voice){notify('لم يتوفر صوت عربي في هذا المتصفح.');return}
  stopTimers();
  const utterance=new SpeechSynthesisUtterance(clip?.[2]??(s.selected===0?'آه':TASKS[s.selected].prompt));
  utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.9;
  const finish=(error=false)=>{if(demoUtterance!==utterance)return;demoUtterance=null;updateReviewPlayButton();if(error)notify('تعذّر تشغيل الصوت المولّد. جرّبي متصفحًا آخر.')};
  utterance.onend=()=>finish();utterance.onerror=()=>finish(true);
  demoUtterance=utterance;updateReviewPlayButton();
  try{speechEngine.speak(utterance)}catch{finish(true)}
 }
 function stopTimers(){stopDemoSpeech();clearInterval(recordInterval);clearInterval(playInterval);recordInterval=null;playInterval=null;s.playing=false;if(s.phase==='recording'){s.phase=s.quality[s.task]==='fail'?'fail':'idle';s.elapsed=0}}

 function updateRecord(){const timer=document.getElementById('record-timer');if(timer)timer.textContent=time(s.elapsed)}
 function startRecord(){stopTimers();if(!model.startRecord())return;render(false);recordInterval=setInterval(()=>{s.elapsed+=1;updateRecord();if(s.elapsed>=5){clearInterval(recordInterval);recordInterval=null;const previousView=s.view;model.finishRecord();render(s.view!==previousView);const b=main.querySelector('[data-action="next-task"], [data-action="record"], [data-action="report"]');if(b)b.focus({preventScroll:true})}},1000)}
 function updatePlayback(){const t=TASKS[s.selected],line=document.getElementById('playhead'),label=document.getElementById('play-time');if(line){const x=10+s.playTime/t.seconds*570;line.setAttribute('x1',x);line.setAttribute('x2',x)}if(label)label.textContent=time(s.playTime)+' / '+time(t.seconds)}
 function togglePlay(clip){stopDemoSpeech();if(s.playing){clearInterval(playInterval);playInterval=null;s.playing=false;render(false);return}const [start,end]=clip||[0,TASKS[s.selected].seconds];if(s.playTime<start||s.playTime>=end)s.playTime=start;s.playing=true;render(false);playInterval=setInterval(()=>{s.playTime=Math.min(end,s.playTime+.1);updatePlayback();if(s.playTime>=end){clearInterval(playInterval);playInterval=null;s.playing=false;render(false)}},100)}

 function download(){const copy=document.documentElement.cloneNode(true);copy.querySelector('#main').replaceChildren();copy.querySelector('#stepper').replaceChildren();const title=copy.querySelector('title');if(title)title.textContent=tr('نبرة');const toast=copy.querySelector('#toast');if(toast){toast.textContent='';toast.classList.remove('show')}const blob=new Blob(['<!doctype html>\n'+copy.outerHTML],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='NABRA_Prototype.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('تم تجهيز نسخة فارغة من النموذج، دون بيانات الجلسة.')}
 document.addEventListener('input',e=>{if(e.target.id==='review-note')s.note=e.target.value.slice(0,1200);if(e.target.dataset?.patient){model.updatePatient(e.target.dataset.patient,e.target.value);e.target.setCustomValidity('')}});
 document.addEventListener('change',e=>{if(e.target.id==='notice-consent'){s.consent=e.target.checked;e.target.setCustomValidity('')}if(e.target.dataset?.patient){model.updatePatient(e.target.dataset.patient,e.target.value);e.target.setCustomValidity('');if(e.target.dataset.patient==='hasPain')syncPainFields();else if(e.target.dataset.patient.endsWith('Status'))syncMedicalField(e.target.dataset.patient.slice(0,-6))}});
 document.addEventListener('submit',e=>{if(e.target.id!=='history-form')return;e.preventDefault();let error=model.validateHistory(s.historyStep);if(!error&&s.historyStep===2){for(let i=0;i<3;i++){error=model.validateHistory(i);if(error){s.historyStep=i;render(false);break}}}if(error){const el=error.key==='consent'?document.getElementById('notice-consent'):main.querySelector('[data-patient="'+error.key+'"]');el.setCustomValidity(tr(error.message));el.reportValidity();el.focus();return}if(model.nextHistory())render()});
 document.addEventListener('toggle',e=>{if(e.target.id==='all-recordings')s.recordingsOpen=e.target.open},true);
 document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;const i=Number(b.dataset.index);if(a==='language'){const open=[...main.querySelectorAll('details')].map(el=>el.open);language=language==='ar'?'en':'ar';translateChrome();render(false);main.querySelectorAll('details').forEach((el,i)=>{el.open=open[i]??el.open});return}if(a==='previous-step'){stopTimers();if(model.previousStep())render();return}if(a==='open-demo'){stopTimers();if(model.openDemo())render();return}if(a==='exit-demo'||(a==='home'&&s.demo)){stopTimers();if(model.exitDemo())render();return}if(a==='review'){stopTimers();if(model.review())render();return}if(s.view===REVIEW_VIEW&&a==='review-task'){stopTimers();if(model.select(i)){s.detailOpen=false;s.reviewClip=-1;render(false);main.querySelector('[data-action="review-task"][data-index="'+i+'"]').focus({preventScroll:true})}return}if(s.view===REVIEW_VIEW&&a==='review-clip'){const clip=SAMPLE_CLIPS[s.selected][i];if(clip){stopTimers();s.reviewClip=s.reviewClip===i?-1:i;s.playTime=s.reviewClip===-1?0:clip[0];render(false);main.querySelector('[data-action="review-clip"][data-index="'+i+'"]').focus({preventScroll:true})}return}if(s.view===REVIEW_VIEW&&a==='review-play'){const clip=SAMPLE_CLIPS[s.selected][s.reviewClip];if(s.demo)speakDemoTask(clip);else togglePlay(clip);document.getElementById('review-play')?.focus({preventScroll:true});return}if(s.view===REVIEW_VIEW&&a==='review-compare'){s.compareTasks=!s.compareTasks;render(false);const comparison=document.getElementById('review-comparison');comparison.focus({preventScroll:true});comparison.scrollIntoView({block:'nearest'});return}if(s.view===REVIEW_VIEW&&a==='review-export'){stopTimers();if(model.report()){render();window.print()}return}if(a==='download'){download();return}if(a==='record'){startRecord();return}if(a==='stop-record'){clearInterval(recordInterval);recordInterval=null;const previousView=s.view;model.finishRecord();render(s.view!==previousView);return}if(a==='play'){if(s.demo&&s.view===3)speakDemoTask(s.segment?assessmentClip():null);else togglePlay();return}if(a==='print'){window.print();return}if(a==='segment'){stopDemoSpeech();s.segment=!s.segment;s.playTime=s.segment?2:0;render(false);notify(s.segment?'تم تحديد المقطع التوضيحي من الثانية ٢ إلى ٣.':'أُلغي تحديد المقطع.');return}stopTimers();if(a==='history-section'){if(!model.historySection(i))return}else if(a==='home')model.home();else if(a==='start'){if(!model.start())return}else if(a==='task')model.openTask(i);else if(a==='next-task')model.nextTask();else if(a==='quality'){if(!model.summary())return}else if(a==='recordings')model.openTask(0);else if(a==='report'){if(!model.report())return}else if(a==='ai'){if(!model.ai())return}else if(a==='back-report'){if(!model.report())return}else if(a==='close-detail'){s.detailOpen=false;s.fromAI=false;render(false);const target=main.querySelector('[data-action="ai-evidence"][data-index="'+s.selected+'"]');if(target)target.focus({preventScroll:true});else main.focus({preventScroll:true});return}else if(a==='ai-evidence'||a==='review-segment'){if(!model.reviewAI(i))return;s.fromAI=a==='ai-evidence';render(false);document.getElementById('task-detail').focus();document.getElementById('task-detail').scrollIntoView({block:'start'});if(s.demo&&a==='ai-evidence')speakDemoTask(assessmentClip());return}else if(a==='select-report'){model.select(i);render(false);document.getElementById('task-detail').focus();document.getElementById('task-detail').scrollIntoView({block:'start'});return}else return;render()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTimers();if(s.view===1||s.view===3||s.view===REVIEW_VIEW)render(false)}});

 if(autoStart) { translateChrome(); render(false); }
 return { model, view, download };
}

module.exports = { createController };
