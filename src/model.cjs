'use strict';

// Demo data, validation and workflow state. No browser dependencies.
const TASKS = [
 {name:'صوت ممدود',hint:'اطلبي من المريض مدّ صوت «آ» بطبقة مريحة.',prompt:'آآآ',caption:'مهمة توضيحية.',seconds:5,pitch:156,icon:'mic'},
 {name:'القراءة الأولى',hint:'يقرأ المريض الجملة بصوته المعتاد، دون استعجال.',prompt:'كان هذا الصباح هادئًا، فجلست قرب النافذة.',caption:'نص توضيحي يراجعه المختص.',seconds:7,pitch:172,icon:'book'},
 {name:'القراءة الثانية',hint:'يقرأ المريض الجملة التالية بصوته المعتاد.',prompt:'سافرت سارة صباح السبت إلى الساحل.',caption:'نص توضيحي يراجعه المختص.',seconds:6,pitch:168,icon:'book'},
 {name:'كلام طبيعي',hint:'اطلبي من المريض التحدث باختصار عن يومه بطريقته المعتادة.',prompt:'كيف كان يومك؟',caption:'مثال توضيحي للكلام الطبيعي.',seconds:12,pitch:160,icon:'chat'}
];

const AI_EXAMPLES = [
 {id:'adld',label:'ترجيح الحالة الأولى',title:'يميل إلى خلل التوتر الحنجري المُقرِّب',english:'Adductor laryngeal dystonia (AdLD)',summary:'مثال لنتيجة تربط ترجيح الحالة بمقاطع من مهمتي القراءة.',tasks:[1,2]},
 {id:'pmtd',label:'ترجيح الحالة الثانية',title:'يميل إلى عسر التصويت الناتج عن التوتر العضلي الأولي',english:'Primary muscle tension dysphonia (pMTD)',summary:'مثال لنتيجة تربط ترجيح الحالة بمقاطع من الصوت الممدود والكلام الطبيعي.',tasks:[0,3]},
 {id:'inconclusive',label:'غير حاسمة',title:'لا يمكن ترجيح إحدى الحالتين',english:'Inconclusive',summary:'مثال لعدم كفاية المعطيات أو تداخل المؤشرات؛ تُحال النتيجة للمختص.',tasks:[1,2]}
];


const MEDICAL_CHOICES=['medicalHistory','surgeries','medications','allergies','previousTreatment','familyHistory'];
const REVIEW_VIEW=4;
const SAMPLE_SCORES=[2.1,6,2.4,4.3];
const SAMPLE_CLIPS=[[],[[.8,1.3,'كان هذا الصباح'],[2,3,'هادئًا'],[4.5,5.1,'فجلست قرب النافذة.']],[[2,3,'صباح السبت']],[]];
function emptyPatient(){return {fullName:'',age:'',sex:'',occupation:'',chiefComplaint:'',onset:'',course:'',hasPain:'',painLocation:'',painSeverity:'',triggers:'',associatedSymptoms:'',medicalHistory:'',surgeries:'',medications:'',allergies:'',smoking:'',previousTreatment:'',familyHistory:'',...Object.fromEntries(MEDICAL_CHOICES.map(k=>[k+'Status','']))}}
function normaliseDigits(v){return String(v).replace(/[٠-٩]/g,c=>'٠١٢٣٤٥٦٧٨٩'.indexOf(c)).replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c)).trim()}

function createModel(){
 let beforeDemo=null;
 const s={view:0,consent:false,patient:emptyPatient(),historyStep:0,historyReached:0,historyComplete:false,task:0,phase:'idle',elapsed:0,recorded:[false,false,false,false],quality:['pending','pending','pending','pending'],attempts:[0,0,0,0],qualityFixed:false,selected:0,playing:false,playTime:0,segment:false,note:'',detailOpen:false,fromAI:false,aiCase:'adld',recordingsOpen:false};
 return {s,
  allClear(){return s.historyComplete&&s.recorded.every(Boolean)},
  updatePatient(key,value){if(!Object.prototype.hasOwnProperty.call(s.patient,key))return false;if(key==='sex'&&!['','female','male'].includes(value))return false;const statusKey=MEDICAL_CHOICES.find(k=>key===k+'Status');if(statusKey&&!['','none','present','unknown'].includes(value))return false;s.patient[key]=String(value).slice(0,1200);s.historyComplete=false;if(statusKey&&value!=='present')s.patient[statusKey]='';if(key==='hasPain'&&value!=='yes'){s.patient.painLocation='';s.patient.painSeverity=''}return true},
  validateHistory(step){const p=s.patient;
   if(step===0){if(!p.fullName.trim())return {key:'fullName',message:'أدخلي اسمًا تجريبيًا للمريض.'};const age=normaliseDigits(p.age);if(!/^\d{1,3}$/.test(age)||Number(age)>120)return {key:'age',message:'أدخلي العمر بالسنوات من ٠ إلى ١٢٠.'}}
   if(step===1){if(!p.chiefComplaint.trim())return {key:'chiefComplaint',message:'دوّني الشكوى الرئيسية أو سبب الزيارة.'};if(p.hasPain==='yes'&&!p.painLocation.trim())return {key:'painLocation',message:'حددي مكان الألم.'};const severity=normaliseDigits(p.painSeverity);if(p.hasPain==='yes'&&severity&&(!/^\d{1,2}$/.test(severity)||Number(severity)>10))return {key:'painSeverity',message:'الشدة تكون من ٠ إلى ١٠، أو اتركيها فارغة.'}}
   if(step===2&&!s.consent)return {key:'consent',message:'أكدي استخدام بيانات افتراضية في هذا النموذج.'};return null},
  historySection(i){if(!Number.isInteger(i)||i<0||i>Math.max(s.historyReached,s.historyComplete?2:0))return false;s.historyStep=i;s.view=0;return true},
  nextHistory(){if(this.validateHistory(s.historyStep))return false;if(s.historyStep<2){s.historyStep++;s.historyReached=Math.max(s.historyReached,s.historyStep);return true}return this.start()},
  start(){if(s.historyStep!==2||[0,1,2].some(i=>this.validateHistory(i)))return false;s.historyComplete=true;s.view=this.allClear()?2:1;return true},
  openTask(i){if(!s.historyComplete)return false;if(!Number.isInteger(i)||i<0||i>3)return false;const pending=s.recorded.findIndex(v=>!v);if(!s.recorded[i]&&i!==pending)return false;s.task=i;s.elapsed=s.recorded[i]?TASKS[i].seconds:0;s.phase=s.quality[i]==='pass'?'pass':s.quality[i]==='fail'?'fail':'idle';s.view=1;return true},
  startRecord(){if(!s.historyComplete||s.view!==1||s.phase==='recording')return false;s.recorded[s.task]=false;s.quality[s.task]='pending';s.phase='recording';s.elapsed=0;s.qualityFixed=s.quality[2]==='pass';return true},
  finishRecord(){if(s.phase!=='recording')return false;s.elapsed=TASKS[s.task].seconds;s.attempts[s.task]+=1;const fail=s.task===2&&s.attempts[2]===1;s.phase=fail?'fail':'pass';s.quality[s.task]=fail?'fail':'pass';s.recorded[s.task]=!fail;s.qualityFixed=s.quality[2]==='pass';if(this.allClear())s.view=2;return !fail},
  nextTask(){if(s.phase!=='pass')return false;const next=s.recorded.findIndex(v=>!v);if(next<0){s.view=2;return true}return this.openTask(next)},
  summary(){if(!this.allClear())return false;s.view=2;return true},
  review(){if(!this.allClear())return false;this.select(1);s.detailOpen=false;s.view=REVIEW_VIEW;s.reviewClip=-1;s.compareTasks=false;return true},
  openDemo(){
   if(beforeDemo)return false;
   beforeDemo={...s,patient:{...s.patient},recorded:s.recorded.slice(),quality:s.quality.slice(),attempts:s.attempts.slice()};
   this.reset();
   Object.assign(s,{demo:true,historyComplete:true,consent:true,historyStep:2,historyReached:2,recorded:[true,true,true,true],quality:['pass','pass','pass','pass'],attempts:[1,1,2,1],qualityFixed:true});
   Object.assign(s.patient,{fullName:'حالة نبرة التجريبية',age:'38',sex:'female',chiefComplaint:'تغيّر في الصوت عند القراءة (مثال افتراضي)'});
   return this.review();
  },
  exitDemo(){if(!beforeDemo)return false;Object.assign(s,beforeDemo,{demo:false});beforeDemo=null;return true},
  report(){if(!this.allClear())return false;s.view=3;s.selected=0;s.playing=false;s.playTime=0;s.segment=false;s.detailOpen=false;s.fromAI=false;return true},
  previousStep(){
   if(s.view===0)return s.historyStep>0&&this.historySection(s.historyStep-1);
   if(s.view===1)return this.historySection(2);
   if(s.view===2)return !s.demo&&this.openTask(s.task);
   if(s.view===REVIEW_VIEW)return !s.demo&&this.summary();
   if(s.view===3)return this.review();
   return false;
  },
  select(i){if(!Number.isInteger(i)||i<0||i>3||!s.recorded[i])return false;s.selected=i;s.playTime=0;s.playing=false;s.segment=false;s.detailOpen=true;s.fromAI=false;return true},
  ai(){return this.report()},
  chooseAI(id){if(!AI_EXAMPLES.some(a=>a.id===id))return false;s.aiCase=id;return true},
  reviewAI(i){if(!this.select(i))return false;s.view=3;s.fromAI=true;s.segment=true;s.playTime=2;return true},
  home(){s.view=0;s.historyStep=0;s.playing=false},
  reset(){s.view=0;s.consent=false;s.patient=emptyPatient();s.historyStep=0;s.historyReached=0;s.historyComplete=false;s.task=0;s.phase='idle';s.elapsed=0;s.recorded=[false,false,false,false];s.quality=['pending','pending','pending','pending'];s.attempts=[0,0,0,0];s.qualityFixed=false;s.selected=0;s.playing=false;s.playTime=0;s.segment=false;s.note='';s.detailOpen=false;s.fromAI=false;s.aiCase='adld';s.recordingsOpen=false}
 };
}

module.exports = { TASKS, AI_EXAMPLES, MEDICAL_CHOICES, REVIEW_VIEW, SAMPLE_SCORES, SAMPLE_CLIPS, normaliseDigits, createModel, emptyPatient };
