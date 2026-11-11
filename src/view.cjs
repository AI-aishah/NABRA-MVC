'use strict';

const { TASKS, AI_EXAMPLES, MEDICAL_CHOICES, REVIEW_VIEW, SAMPLE_SCORES, SAMPLE_CLIPS, normaliseDigits } = require('./model.cjs');

// Renders the model state and localizes the interface.
function createView({ state: s, document, window, getLanguage = () => 'ar', isSpeaking = () => false }) {
 const english=new Map(`
انتقل إلى المحتوى|Skip to content
نبرة|NABRA
نبرة، البداية|NABRA home
واجهة الطبيبة|Clinician view
تحميل نسخة من نموذج الواجهات|Download a copy of the prototype
تحميل النموذج|Download prototype
نموذج تفاعلي · التسجيل والنتائج توضيحية · لا يُستخدم الميكروفون|Interactive prototype · Simulated recordings and results · No microphone access
نبرة · أداة مساعدة للطبيبة|NABRA · Clinician support tool
مراجعة المختص|Specialist review
متابعة إلى مراجعة المختص|Continue to specialist review
راجعي المهام والمقاطع المحددة قبل عرض التقييم الأولي.|Review the tasks and highlighted segments before opening the preliminary assessment.
بيانات محاكاة للعرض فقط. الدرجات والمقاطع لا تنتج عن تحليل صوت فعلي.|Demo data only. Scores and highlighted segments do not come from audio analysis.
المهام العربية|Arabic voice tasks
أُعيد التسجيل واجتاز الفحص|Re-recorded and passed
المقاطع المحددة|Highlighted segments
المقطع|Segment
عرض المقطع|Preview segment
لا توجد مقاطع محددة في هذا المثال لهذه المهمة.|This example has no highlighted segments for this task.
ملاحظات المختص|Specialist notes
اكتبي ملاحظة اختيارية لإضافتها إلى التقرير.|Enter an optional note to include in the report.
مقارنة القراءتين|Compare the two readings
عرض جميع المهام|Show all tasks
طباعة / حفظ PDF|Print / save as PDF
الخطوة السابقة|Previous step
ليش ظهر هذا النمط؟|Why did this pattern appear?
درجات توضيحية للمقارنة|Illustrative comparison scores
في المثال، درجة القراءة الأولى أعلى من الثانية. هذا الفرق يستحق مراجعة المختص.|In this example, the first reading scores higher than the second. The difference is a cue for specialist review.
التاريخ المرضي معروض كسياق للمختص، ولا يغيّر النتيجة في هذه المحاكاة.|Patient history provides context for the specialist and does not change the simulated result.
مثال توضيحي، ليس تشخيصًا.|Illustrative example, not a diagnosis.
اسمعي المقطع المرتبط|Listen to linked segment
افتحي المقطع المرتبط|Open linked segment
نصوص المقاطع المرتبطة|Linked segment excerpts
نبرة · Medathon Track 3|NABRA · Medathon Track 3
تجربة لأداة تساعد المختص على مقارنة مهام الصوت العربي. التسجيل والتحليل محاكاة، والصوت في الحالة الجاهزة مولّد من النص.|A prototype for reviewing Arabic voice tasks side by side. Recording and analysis are simulated; the sample case reads its text aloud using generated speech.
مقارنة مهام المريض|Within-speaker task comparison
درجات توضيحية لشدة اضطراب الصوت. الدرجة الأعلى تعني شدة أكبر في هذا المثال.|Illustrative voice severity scores. A higher score represents greater severity in this example.
اختلاف بين القراءتين|Difference between reading tasks
في هذا المثال، درجة القراءة الأولى أعلى من الثانية. يراجع المختص المقاطع لتفسير الفرق.|In this example, the first reading scores higher than the second. The specialist reviews the segments to interpret the difference.
تسجيلات اجتازت الفحص|Recordings passed
مرات إعادة التسجيل|Repeat attempts
للمراجعة فقط. يبقى التشخيص بعد التقييم السريري الكامل مسؤولية المختص.|For review only. Diagnosis remains with the specialist after a full clinical assessment.
مراحل التقييم|Assessment steps
التاريخ المرضي|Patient history
التسجيل|Recording
الجودة|Quality
التقييم الأولي|Preliminary assessment
فحص الجودة|Quality check
بيانات المريض|Patient details
الشكوى والأعراض|Complaint and symptoms
التاريخ الطبي|Medical history
ملف المريض · تعبّئه الطبيبة|Patient record · Completed by the clinician
التاريخ المرضي للمريض|Patient history
المعلومات الأساسية أولًا، ثم تفاصيل الزيارة قبل تسجيل الصوت.|Enter the patient details and reason for the visit before recording.
بيانات افتراضية للتجربة فقط؛ لا يُحفظ الملف بعد تحديث الصفحة.|Use fictional data only. Refreshing the page clears the visit.
أقسام التاريخ المرضي|Patient history sections
الحقول المعلّمة * مطلوبة|Fields marked * are required
أفهم أن هذا نموذج تجريبي وسأستخدم بيانات افتراضية.|I understand this is a prototype and will use fictional data.
متابعة إلى الشكوى والأعراض|Continue to complaint and symptoms
متابعة إلى التاريخ الطبي|Continue to medical history
متابعة إلى تسجيل الصوت|Continue to recording
مطلوب|Required
اختاري الجنس|Select gender
اختاري|Select an option
اسم المريض|Patient name
اسم افتراضي للتجربة|Fictional name for the demo
العمر بالسنوات|Age in years
مثال: ٣٥|Example: 35
الجنس|Gender
جرّبي حالة جاهزة|Try a sample case
عرض سريع للمحكّمين|Quick demo for judges
افتحي حالة افتراضية مكتملة لمراجعة المقاطع ومقارنة القراءتين.|Open a completed sample case to explore the segments and compare the two readings.
حالة تجريبية جاهزة|Sample case
العودة إلى مسار التقييم|Return to assessment flow
حالة نبرة التجريبية|Nabra sample case
التشغيل بصوت مولّد. اختاري مقطعًا لسماع نصه فقط. الموجة والتوقيت توضيحيان.|Playback uses a generated voice. Select a segment to hear only its text. The waveform and timings are illustrative.
تشغيل المقطع|Play segment
الصوت مولّد من النص. الموجة والتوقيت توضيحيان.|Speech is generated from the text. The waveform and timing are illustrative.
معاينة المقطع بدون صوت|Preview segment without sound
الصوت المولّد غير مدعوم في هذا المتصفح.|Generated speech is not supported in this browser.
لم يتوفر صوت عربي في هذا المتصفح.|No Arabic voice is available in this browser.
تعذّر تشغيل الصوت المولّد. جرّبي متصفحًا آخر.|Generated speech could not play. Try another browser.
تغيّر في الصوت عند القراءة (مثال افتراضي)|Voice changes during reading (fictional example)
أنثى|Female
ذكر|Male
المهنة وطبيعة استخدام الصوت|Occupation and voice use
اختياري؛ مثل التدريس أو عمل يتطلب الكلام لفترات طويلة|Optional; e.g., teaching or other work that involves prolonged speaking
الشكوى الرئيسية / سبب الزيارة|Main complaint / reason for visit
ما الذي يشتكي منه المريض؟|What symptoms does the patient report?
متى بدأت الأعراض؟|When did the symptoms start?
مثال: منذ أسبوعين|Example: two weeks ago
ما نمط الأعراض؟|What is the pattern of the symptoms?
مستمرة|Continuous
تظهر وتختفي|Intermittent
هل يوجد ألم؟|Is there pain?
لا|No
نعم|Yes
عند وجود ألم، دوّني مكانه وشدته إن كانت معروفة.|If there is pain, record its location and severity if known.
مكان الألم|Pain location
حددي مكان الألم|Specify where the pain is
شدة الألم من ٠ إلى ١٠|Pain severity from 0 to 10
اختياري|Optional
ما الذي يزيد الأعراض أو يخففها؟|What makes the symptoms better or worse?
مثل الكلام لفترة طويلة أو الراحة|For example, prolonged speaking or rest
أعراض مصاحبة وتأثيرها على المريض|Other symptoms and their impact
دوّني أي أعراض أخرى أو تأثير على الحياة والعمل|Note any other symptoms or effects on daily life and work
أمراض سابقة أو مزمنة|Past or chronic conditions
اذكري الأمراض المعروفة|List known conditions
عمليات سابقة أو تنويم بالمستشفى|Previous surgeries or hospital stays
اذكري الإجراءات أو التنويم السابق|List previous procedures or hospital stays
الأدوية الحالية|Current medications
اسم الدواء والجرعة إذا كانت معروفة|Medication name and dose, if known
الحساسيات المعروفة|Known allergies
اذكري نوع الحساسية|Specify the allergy
التدخين|Smoking
لم يسبق له التدخين|Never smoked
مدخن سابق|Former smoker
مدخن حالي|Current smoker
تقييم أو علاج سابق لمشكلة الصوت|Previous voice assessment or treatment
اذكري التقييم أو العلاج السابق|Describe the previous assessment or treatment
تاريخ عائلي ذو صلة|Relevant family history
اذكري التاريخ العائلي المرتبط بالحالة|Describe relevant family history
لا توجد|None
توجد|Present
غير معروف|Unknown
التفاصيل (اختياري)|Details (optional)
ملف المريض|Patient record
سبب الزيارة|Reason for visit
عرض التاريخ المرضي|View patient history
المهنة|Occupation
الشكوى الرئيسية|Main complaint
بداية الأعراض|Symptom onset
ظهور الأعراض|Symptom pattern
وجود ألم|Pain present
شدة الألم|Pain severity
ما يزيد الأعراض أو يخففها|Aggravating or relieving factors
أعراض مصاحبة وتأثيرها|Other symptoms and impact
الأمراض السابقة والمزمنة|Past and chronic conditions
العمليات والتنويم|Surgeries and hospital stays
الأدوية|Medications
الحساسيات|Allergies
علاج الصوت سابقًا|Previous voice assessment or treatment
التاريخ العائلي|Family history
لم يدوّن|Not recorded
أدخلي اسمًا تجريبيًا للمريض.|Enter a fictional patient name.
أدخلي العمر بالسنوات من ٠ إلى ١٢٠.|Enter an age between 0 and 120 years.
دوّني الشكوى الرئيسية أو سبب الزيارة.|Enter the main complaint or reason for the visit.
حددي مكان الألم.|Specify the pain location.
الشدة تكون من ٠ إلى ١٠، أو اتركيها فارغة.|Enter a severity from 0 to 10 or leave it blank.
أكدي استخدام بيانات افتراضية في هذا النموذج.|Confirm that you will use fictional data.
صوت ممدود|Sustained vowel
القراءة الأولى|First reading
القراءة الثانية|Second reading
كلام طبيعي|Natural speech
اطلبي من المريض مدّ صوت «آ» بطبقة مريحة.|Ask the patient to sustain the Arabic “aa” sound at a comfortable pitch.
يقرأ المريض الجملة بصوته المعتاد، دون استعجال.|Ask the patient to read the Arabic sentence at a natural pace.
يقرأ المريض الجملة التالية بصوته المعتاد.|Ask the patient to read the Arabic sentence in their usual voice.
اطلبي من المريض التحدث باختصار عن يومه بطريقته المعتادة.|Ask the patient to speak briefly in Arabic about their day.
مهمة توضيحية.|Example task.
نص توضيحي يراجعه المختص.|Example Arabic prompt for specialist review.
مثال توضيحي للكلام الطبيعي.|Example prompt for natural speech.
التسجيل واضح|Recording is clear
يمكنك الانتقال للمهمة التالية.|You can continue to the next task.
التسجيل غير واضح|Recording is unclear
ضوضاء في الخلفية. جرّبي مكانًا أهدأ وأعيدي هذه المهمة.|Background noise. Try a quieter spot and repeat this task.
جارٍ عرض محاكاة التسجيل…|Simulating recording…
اضغطي لبدء التسجيل|Press to start recording
تسجيل صوت المريض|Patient voice recordings
وجّهي المريض لكل مهمة، ثم تحققي من وضوح التسجيل.|Guide the patient through each task and check that the recording is clear.
مهام التسجيل|Recording tasks
مهام التقييم|Assessment tasks
أعد التسجيل|Re-record
واضح|Clear
المهمة الحالية|Current task
بانتظار دورها|Pending
مدّ صوت «آ»|Sustain the “aa” sound
تحدث بطريقتك المعتادة|Speak naturally
اقرأ الجملة التالية|Read the sentence below
مؤقت التسجيل|Recording timer
التسجيل وفحص الوضوح محاكاة في هذا النموذج.|Recording and clarity checks are simulated in this prototype.
إنهاء التسجيل|Stop recording
إعادة التسجيل|Re-record
المهمة التالية|Next task
بدء التسجيل|Start recording
اكتملت التسجيلات|Recordings complete
المهام الأربع واضحة وجاهزة للمتابعة.|All four recordings are clear and ready for review.
ملخص فحص الجودة|Recording quality summary
٤ من ٤ تسجيلات واضحة|4 of 4 recordings clear
عرض التقييم الأولي|View preliminary assessment
إغلاق تفاصيل التسجيل|Close recording details
جودة هذا المثال تحتاج إعادة|This example needs to be re-recorded
موجة صوتية توضيحية|Illustrative waveform
إيقاف المعاينة|Pause preview
معاينة التشغيل|Play preview
محاكاة مرئية دون صوت حقيقي|Visual simulation without audio
الموضع المرتبط بالملاحظة|Segment linked to the observation
قياسات صوتية للمختص|Acoustic measurements
مدة المقطع|Clip duration
طبقة الصوت التقديرية|Estimated pitch
قيم توضيحية لوصف التسجيل؛ لا تحدد الحالة وحدها.|Illustrative values describing the recording. They do not determine the condition.
تقييم أولي توضيحي · مثال معدّ مسبقًا، دون تسجيل أو تحليل فعلي|Illustrative preliminary assessment · Preset example without actual recording or analysis
خلاصة واحدة، مع المقاطع المرتبطة بها.|An overview with the relevant segments.
مثال توضيحي لتقييم مدعوم بالذكاء الاصطناعي؛ لا يوجد تحليل فعلي في هذا النموذج.|Illustrative AI-assisted assessment. This prototype does not analyze recordings.
خلاصة التقييم التوضيحي|Illustrative assessment summary
الخلاصة التوضيحية|Illustrative summary
يميل إلى خلل التوتر الحنجري المُقرِّب|Pattern favors adductor laryngeal dystonia
يعرض هذا المثال ترجيحًا أوليًا، ويربطه بمقاطع من مهمتي القراءة ليقيّمها المختص.|This example links a preliminary finding to segments from the two reading tasks for specialist review.
تحتاج مراجعة المختص|Specialist review required
المواضع المرتبطة بالملاحظة|Segments for review
افتح المقطع للوصول إلى موضع المراجعة مباشرة.|Open a segment to jump to the highlighted point.
استعراض|Review
تفاصيل التسجيلات الأربعة|All four recordings
التسجيلات الأربعة وجودتها|The four recordings and their quality
المهمة|Task
جودة التسجيل|Recording quality
فتح التسجيل|Open recording
الترجيح المعروض مثال للواجهة، ولا يثبت التشخيص أو يستبعد أسبابًا أخرى لاضطراب الصوت.|This example illustrates the interface. It does not establish a diagnosis or rule out other causes of voice disorders.
تم تجهيز نسخة فارغة من النموذج، دون بيانات الجلسة.|A fresh copy of the prototype was downloaded without visit data.
تم تحديد المقطع التوضيحي من الثانية ٢ إلى ٣.|Illustrative segment selected from 2 to 3 seconds.
أُلغي تحديد المقطع.|Segment deselected.
`.trim().split('\n').map(line=>line.split('|')));
 function tr(value){
  if(getLanguage()==='ar')return value;
  const fixed=english.get(value);if(fixed)return fixed;
  const n=normaliseDigits(value);
  return n.replace(/^الجزء (\d+) من 3$/,'Section $1 of 3')
   .replace(/^المهمة (\d+) من 4$/,'Task $1 of 4')
   .replace(/^(\d+) مهام واضحة من أربع$/,'$1 of 4 tasks clear')
   .replace(/^(\d+) سنة$/,'$1 years')
   .replace(/^(\d+) ثوانٍ( · رسم توضيحي)?$/,(_,seconds,wave)=>seconds+' sec'+(wave?' · Illustrative waveform':''))
   .replace(/^تفاصيل (.+)$/,(_,name)=>'Details: '+(english.get(name)||name));
 }
 function translateView(root){
  if(getLanguage()==='ar')return;
  const visit=node=>{
   if(node.nodeType===3){const str=node.nodeValue.trim();if(str&&/[\u0600-\u06ff]/.test(str))node.nodeValue=node.nodeValue.replace(str,tr(str));return}
   if(node.nodeType!==1||node.hasAttribute('data-verbatim')||node.tagName==='TEXTAREA') {
    if(node.nodeType===1&&node.tagName==='TEXTAREA'&&node.hasAttribute('placeholder'))node.setAttribute('placeholder',tr(node.getAttribute('placeholder')));
    return;
   }
   for(const attr of ['aria-label','placeholder'])if(node.hasAttribute(attr))node.setAttribute(attr,tr(node.getAttribute(attr)));
   for(const child of node.childNodes)visit(child);
  };
  visit(root);
 }
 function segmentLabel(i,start,end){
  const name=tr(TASKS[i].name);
  return getLanguage()==='en'?`${name}: segment ${start} to ${end} seconds`:`${name}: مقطع من الثانية ${ar(start)} إلى ${ar(end)}`;
 }
 function previousControl(){
  if((s.view===0&&s.historyStep===0)||(s.demo&&s.view!==3))return '';
  return '<div class="workflow-back no-print"><button type="button" class="btn btn-light" data-action="previous-step">الخطوة السابقة</button></div>';
 }
 function translateChrome(){
  const root=document.documentElement;root.lang=getLanguage();root.dir=getLanguage()==='ar'?'rtl':'ltr';
  const set=(selector,ar)=>{document.querySelector(selector).textContent=tr(ar)};
  const attr=(selector,label)=>document.querySelector(selector).setAttribute('aria-label',tr(label));
  set('.skip','انتقل إلى المحتوى');set('.brand-name','نبرة');
  document.querySelector('.brand-en').hidden=getLanguage()==='en';
  set('.demo-pill','واجهة الطبيبة');set('.download-label','تحميل النموذج');
  set('.demo-note span','نموذج تفاعلي · التسجيل والنتائج توضيحية · لا يُستخدم الميكروفون');
  set('.site-footer span','نبرة · أداة مساعدة للطبيبة');
  attr('.brand','نبرة، البداية');attr('[data-action="download"]','تحميل نسخة من نموذج الواجهات');attr('#stepper','مراحل التقييم');
  const button=document.querySelector('[data-action="language"]');button.lang=getLanguage()==='ar'?'en':'ar';button.textContent=getLanguage()==='ar'?'English':'العربية';
 }

 const icons={
  arrow:'<path d="m14 6-6 6 6 6M8 12h12"/>',back:'<path d="m10 6 6 6-6 6M16 12H4"/>',
  mic:'<rect x="8" y="3" width="8" height="12" rx="4"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  book:'<path d="M12 5v15M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1Z"/>',
  chat:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-3 2 1.6-5A8.5 8.5 0 1 1 21 11.5Z"/>',
  check:'<path d="m5 12 4 4L19 6"/>',shield:'<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  play:'<path d="m9 5 10 7-10 7Z"/>',pause:'<path d="M8 5v14M16 5v14"/>',repeat:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9h.01"/>',
  alert:'<path d="M10.3 4.1a2 2 0 0 1 3.4 0L22 19H2Z"/><path d="M12 9v4m0 3h.01"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  print:'<path d="M7 7V3h10v4M7 17H4V8h16v9h-3M7 14h10v7H7Zm10-3h.01"/>',
  volume:'<path d="m11 4-6 5H2v6h3l6 5Zm5 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
  pointer:'<path d="m4 3 7 17 2-7 7-2Z"/>'
 };
 const icon=(name,extra='')=>`<svg class="icon ${extra}${name==='arrow'||name==='back'?' icon-directional':''}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.info}</svg>`;
 const ar=n=>getLanguage()==='en'?String(n):String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
 const time=n=>'00:'+String(Math.min(59,Math.floor(n))).padStart(2,'0');
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const main=document.getElementById('main');

 function reviewPlayLabel(clip){return s.playing||isSpeaking()?'إيقاف المعاينة':clip?(s.demo?'تشغيل المقطع':'معاينة المقطع بدون صوت'):'معاينة التشغيل'}

 function assessmentClip(){return SAMPLE_CLIPS[s.selected].find(([start,end])=>start===2&&end===3)}

 function stepper(){const names=['التاريخ المرضي','التسجيل','الجودة','مراجعة المختص','التقييم الأولي'],step=[0,1,2,REVIEW_VIEW,3].indexOf(s.view);document.getElementById('stepper').innerHTML=names.map((n,i)=>`<li class="${i===step?'active':i<step?'done':''}" ${i===step?'aria-current="step"':''}><span class="step-index">${i<step?icon('check'):i+1}</span><span>${n}</span></li>`).join('')}
 function waveBars(mini=false,seed=0){return Array.from({length:mini?44:100},(_,i)=>{const env=Math.sin((i+seed)*.63)*Math.sin((i+seed)*.19);const h=Math.round(8+Math.abs(env)*(mini?56:67));return mini?`<span style="height:${h}px"></span>`:`<line x1="${10+i*5.75}" y1="${51-h/2}" x2="${10+i*5.75}" y2="${51+h/2}" stroke="${i>35&&i<50?'#8da99b':'#29826b'}" stroke-width="2.7" stroke-linecap="round"/>`}).join('')}

 function historyField(key,label,opts={}){const id='patient-'+key,required=opts.required?'required':'';return `<div class="history-field ${opts.wide?'wide':''}"><label for="${id}">${label}${opts.required?'<span class="required-mark" aria-label="مطلوب">*</span>':''}</label><input id="${id}" data-patient="${key}" name="${key}" type="text" ${opts.numeric?'inputmode="numeric"':''} value="${esc(s.patient[key])}" placeholder="${esc(opts.placeholder||'')}" maxlength="${opts.numeric?3:160}" autocomplete="off" ${required}>${opts.hint?`<span class="field-hint">${opts.hint}</span>`:''}</div>`}
 function historyText(key,label,opts={}){return `<div class="history-field ${opts.wide?'wide':''}"><label for="patient-${key}">${label}${opts.required?'<span class="required-mark" aria-label="مطلوب">*</span>':''}</label><textarea id="patient-${key}" data-patient="${key}" name="${key}" rows="2" maxlength="1200" placeholder="${esc(opts.placeholder||'')}" ${opts.required?'required':''}>${esc(s.patient[key])}</textarea></div>`}
 function historySelect(key,label,options){return `<div class="history-field"><label for="patient-${key}">${label}</label><select id="patient-${key}" data-patient="${key}" name="${key}"><option value="" ${key==='sex'?'disabled':''} ${!s.patient[key]?'selected':''}>${key==='sex'?'اختاري الجنس':'اختاري'}</option>${options.map(([v,t])=>`<option value="${v}" ${s.patient[key]===v?'selected':''}>${t}</option>`).join('')}</select></div>`}
 function historyBasics(){return historyField('fullName','اسم المريض',{required:true,placeholder:'اسم افتراضي للتجربة',wide:true})+historyField('age','العمر بالسنوات',{required:true,numeric:true,placeholder:'مثال: ٣٥'})+historySelect('sex','الجنس',[['female','أنثى'],['male','ذكر']])+historyField('occupation','المهنة وطبيعة استخدام الصوت',{wide:true,placeholder:'اختياري؛ مثل التدريس أو عمل يتطلب الكلام لفترات طويلة'})}
 function historySymptoms(){return historyText('chiefComplaint','الشكوى الرئيسية / سبب الزيارة',{required:true,wide:true,placeholder:'ما الذي يشتكي منه المريض؟'})+historyField('onset','متى بدأت الأعراض؟',{placeholder:'مثال: منذ أسبوعين'})+historySelect('course','ما نمط الأعراض؟',[['continuous','مستمرة'],['intermittent','تظهر وتختفي']])+historySelect('hasPain','هل يوجد ألم؟',[['no','لا'],['yes','نعم']])+`<div class="history-field pain-placeholder"><span class="field-hint">عند وجود ألم، دوّني مكانه وشدته إن كانت معروفة.</span></div><div id="pain-details" class="history-grid wide pain-details" ${s.patient.hasPain==='yes'?'':'hidden'}>${historyField('painLocation','مكان الألم',{required:s.patient.hasPain==='yes',placeholder:'حددي مكان الألم'})}${historyField('painSeverity','شدة الألم من ٠ إلى ١٠',{numeric:true,placeholder:'اختياري'})}</div>`+historyText('triggers','ما الذي يزيد الأعراض أو يخففها؟',{placeholder:'مثل الكلام لفترة طويلة أو الراحة'})+historyText('associatedSymptoms','أعراض مصاحبة وتأثيرها على المريض',{placeholder:'دوّني أي أعراض أخرى أو تأثير على الحياة والعمل'})}
 function medicalEntry(key,label,placeholder){return `<div class="medical-entry">${historySelect(key+'Status',label,[['none','لا توجد'],['present','توجد'],['unknown','غير معروف']])}<div id="details-${key}" ${s.patient[key+'Status']==='present'?'':'hidden'}>${historyText(key,'التفاصيل (اختياري)',{placeholder})}</div></div>`}
 function historyMedical(){return medicalEntry('medicalHistory','أمراض سابقة أو مزمنة','اذكري الأمراض المعروفة')+medicalEntry('surgeries','عمليات سابقة أو تنويم بالمستشفى','اذكري الإجراءات أو التنويم السابق')+medicalEntry('medications','الأدوية الحالية','اسم الدواء والجرعة إذا كانت معروفة')+medicalEntry('allergies','الحساسيات المعروفة','اذكري نوع الحساسية')+historySelect('smoking','التدخين',[['never','لم يسبق له التدخين'],['former','مدخن سابق'],['current','مدخن حالي'],['unknown','غير معروف']])+medicalEntry('previousTreatment','تقييم أو علاج سابق لمشكلة الصوت','اذكري التقييم أو العلاج السابق')+medicalEntry('familyHistory','تاريخ عائلي ذو صلة','اذكري التاريخ العائلي المرتبط بالحالة')}
 function syncMedicalField(key){const group=document.getElementById('details-'+key);if(!group)return;group.hidden=s.patient[key+'Status']!=='present';const field=group.querySelector('textarea');field.disabled=group.hidden;field.value=s.patient[key]}
 function welcome(){const titles=['بيانات المريض','الشكوى والأعراض','التاريخ الطبي'];return `<section class="view history-wrap" aria-labelledby="view-title"><div class="history-intro"><span class="kicker">ملف المريض · تعبّئه الطبيبة</span><h1 id="view-title">التاريخ المرضي للمريض</h1><p class="subheading">المعلومات الأساسية أولًا، ثم تفاصيل الزيارة قبل تسجيل الصوت.</p></div><div class="history-demo-notice">بيانات افتراضية للتجربة فقط؛ لا يُحفظ الملف بعد تحديث الصفحة.</div>${s.historyStep===0?'<section class="card demo-entry"><div><strong>نبرة · Medathon Track 3</strong><p class="judge-intro">تجربة لأداة تساعد المختص على مقارنة مهام الصوت العربي. التسجيل والتحليل محاكاة، والصوت في الحالة الجاهزة مولّد من النص.</p></div><button type="button" class="btn btn-secondary" data-action="open-demo">جرّبي حالة جاهزة</button></section>':''}<nav class="history-sections" aria-label="أقسام التاريخ المرضي">${titles.map((title,i)=>`<button data-action="history-section" data-index="${i}" class="${i===s.historyStep?'active':''}" ${i>s.historyReached&&!s.historyComplete?'disabled':''} ${i===s.historyStep?'aria-current="step"':''}><span>${ar(i+1)}</span>${title}</button>`).join('')}</nav><form id="history-form" class="card history-card" novalidate><div class="history-card-heading"><h2>${titles[s.historyStep]}</h2><span>الحقول المعلّمة * مطلوبة</span></div><div class="history-grid">${[historyBasics,historySymptoms,historyMedical][s.historyStep]()}</div>${s.historyStep===2?`<label class="check-label history-consent"><input id="notice-consent" type="checkbox" ${s.consent?'checked':''} required><span>أفهم أن هذا نموذج تجريبي وسأستخدم بيانات افتراضية.</span></label>`:''}<div class="history-actions"><button type="submit" class="btn btn-primary">${s.historyStep===0?'متابعة إلى الشكوى والأعراض':s.historyStep===1?'متابعة إلى التاريخ الطبي':'متابعة إلى تسجيل الصوت'} ${icon('arrow')}</button><span>الجزء ${ar(s.historyStep+1)} من ٣</span></div></form></section>`}
 function patientContext(){return `<div class="patient-context"><span class="patient-context-icon">${icon('shield')}</span><div><span class="patient-context-label">ملف المريض</span><strong dir="auto" data-verbatim>${esc(s.demo?tr(s.patient.fullName):s.patient.fullName)}</strong></div><span class="patient-context-age">${ar(Number(normaliseDigits(s.patient.age)))} سنة</span></div>`}
 function patientValue(p,key,labels){const status=p[key+'Status'],value=p[key],verbatim=v=>`<span dir="auto" data-verbatim>${esc(v)}</span>`;if(status){const label={none:'لا توجد',present:'توجد',unknown:'غير معروف'}[status];return label+(status==='present'&&value?verbatim(' — '+value):'')}if(!value)return 'لم يدوّن';if(labels[key]?.[value])return labels[key][value];return key==='painSeverity'?ar(normaliseDigits(value))+' / '+ar(10):verbatim(value)}
 function patientHistory(){const p=s.patient,labels={sex:{female:'أنثى',male:'ذكر'},course:{continuous:'مستمرة',intermittent:'تظهر وتختفي'},hasPain:{yes:'نعم',no:'لا'},smoking:{never:'لم يسبق له التدخين',former:'مدخن سابق',current:'مدخن حالي',unknown:'غير معروف'}};const fields=[['sex','الجنس'],['occupation','المهنة'],['chiefComplaint','الشكوى الرئيسية'],['onset','بداية الأعراض'],['course','ظهور الأعراض'],['hasPain','وجود ألم'],...(p.hasPain==='yes'?[['painLocation','مكان الألم'],['painSeverity','شدة الألم']]:[]),['triggers','ما يزيد الأعراض أو يخففها'],['associatedSymptoms','أعراض مصاحبة وتأثيرها'],['medicalHistory','الأمراض السابقة والمزمنة'],['surgeries','العمليات والتنويم'],['medications','الأدوية'],['allergies','الحساسيات'],['smoking','التدخين'],['previousTreatment','علاج الصوت سابقًا'],['familyHistory','التاريخ العائلي']];return `<section class="patient-visit"><span class="patient-visit-label">سبب الزيارة</span><p dir="auto" data-verbatim>${esc(s.demo?tr(p.chiefComplaint):p.chiefComplaint)}</p><details class="patient-history"><summary>عرض التاريخ المرضي</summary><dl>${fields.map(([key,label])=>`<div><dt>${label}</dt><dd dir="auto">${patientValue(p,key,labels)}</dd></div>`).join('')}</dl></details></section>`}
 function syncPainFields(){const group=document.getElementById('pain-details');if(!group)return;const yes=s.patient.hasPain==='yes';group.hidden=!yes;for(const input of group.querySelectorAll('input')){input.disabled=!yes;input.required=yes&&input.dataset.patient==='painLocation';if(!yes){input.value='';input.setCustomValidity('')}}}
 function qualityFeedback(){
  if(s.phase==='pass')return `<div class="task-quality pass" role="status">${icon('check')}<div><strong>التسجيل واضح</strong><span>يمكنك الانتقال للمهمة التالية.</span></div></div>`;
  if(s.phase==='fail')return `<div class="task-quality fail" role="alert">${icon('alert')}<div><strong>التسجيل غير واضح</strong><span>ضوضاء في الخلفية. جرّبي مكانًا أهدأ وأعيدي هذه المهمة.</span></div></div>`;
  return `<div class="record-state-label" role="status">${s.phase==='recording'?'جارٍ عرض محاكاة التسجيل…':'اضغطي لبدء التسجيل'}</div>`;
 }
 function record(){const t=TASKS[s.task],count=s.recorded.filter(Boolean).length,pending=s.recorded.findIndex(v=>!v);return `<section class="view" aria-labelledby="view-title">
  <div class="main-heading"><h1 id="view-title">تسجيل صوت المريض</h1><p class="subheading">وجّهي المريض لكل مهمة، ثم تحققي من وضوح التسجيل.</p></div>
  <div class="record-layout"><aside class="card task-sidebar" aria-label="مهام التسجيل"><div class="section-label">مهام التقييم</div>
   ${TASKS.map((a,i)=>`<button class="task-button ${i===s.task?'selected':''} ${s.recorded[i]?'complete':''}" data-action="task" data-index="${i}" ${!s.recorded[i]&&i!==pending?'disabled':''} aria-pressed="${i===s.task}"><span class="task-icon">${icon(s.recorded[i]?'check':a.icon)}</span><span class="task-label">${a.name}<span class="task-state">${s.quality[i]==='fail'?'أعد التسجيل':s.recorded[i]?'واضح':i===s.task?'المهمة الحالية':'بانتظار دورها'}</span></span></button>`).join('')}
  </aside><div class="card record-card">
   <div class="task-heading"><span class="badge">${icon(t.icon)}${t.name}</span><span class="small muted">المهمة ${ar(s.task+1)} من ٤</span></div>
   <div class="record-progress" aria-label="${ar(count)} مهام واضحة من أربع"><span style="width:${count*25}%"></span></div>
   <h2>${s.task===0?'مدّ صوت «آ»':s.task===3?'تحدث بطريقتك المعتادة':'اقرأ الجملة التالية'}</h2><p class="subheading">${t.hint}</p>
   <div class="prompt-box ${s.task===0?'vowel':''}"><p class="prompt" lang="ar" data-verbatim>${t.prompt}</p><span class="prompt-caption">${t.caption}</span></div>
   <div class="mic-stage ${s.phase==='recording'?'recording':''}"><span class="mic-orb">${icon(s.phase==='pass'?'check':'mic')}</span><span id="record-timer" class="timer" aria-label="مؤقت التسجيل">${time(s.elapsed)}</span></div>
   ${qualityFeedback()}
   <div class="record-controls">${recordControls()}</div><div class="micro-note">التسجيل وفحص الوضوح محاكاة في هذا النموذج.</div>
  </div></div>
  
 </section>`}
 function recordControls(){
  if(s.phase==='recording')return `<button class="btn btn-secondary" data-action="stop-record"><span class="stop-square"></span>إنهاء التسجيل</button>`;
  if(s.phase==='fail')return `<button class="btn btn-warning" data-action="record">${icon('repeat')}إعادة التسجيل</button>`;
  if(s.phase==='pass')return `<button class="btn btn-primary" data-action="next-task">المهمة التالية ${icon('arrow')}</button><button class="btn btn-secondary" data-action="record">${icon('repeat')}إعادة التسجيل</button>`;
  return `<button class="btn btn-primary" data-action="record">${icon('mic')}بدء التسجيل</button>`;
 }
 function quality(){return `<section class="view quality-wrap" aria-labelledby="view-title">
  <h1 id="view-title">اكتملت التسجيلات</h1><p class="subheading">المهام الأربع واضحة وجاهزة للمتابعة.</p>
  <div class="card quality-card"><div class="quality-summary"><span class="summary-icon">${icon('check')}</span><div><h2>ملخص فحص الجودة</h2><p>٤ من ٤ تسجيلات واضحة</p></div></div>
   ${TASKS.map(t=>`<div class="quality-row"><span class="row-icon">${icon(t.icon)}</span><span class="row-title">${t.name}<span class="row-detail">${ar(t.seconds)} ثوانٍ</span></span><span class="badge">${icon('check')}واضح</span></div>`).join('')}
  </div><div class="bottom-actions"><button class="btn btn-primary" data-action="review">متابعة إلى مراجعة المختص ${icon('arrow')}</button></div>
 </section>`}
 function specialistReview(){
  const t=TASKS[s.selected],clips=SAMPLE_CLIPS[s.selected],x=second=>10+second/t.seconds*570,selectedClip=clips[s.reviewClip],repeats=s.attempts.reduce((total,n)=>total+Math.max(0,n-1),0);
  return `<section class="view review-wrap" aria-labelledby="view-title">
   <h1 id="view-title">مراجعة المختص</h1><p class="subheading">راجعي المهام والمقاطع المحددة قبل عرض التقييم الأولي.</p>
   <p class="assessment-demo">بيانات محاكاة للعرض فقط. الدرجات والمقاطع لا تنتج عن تحليل صوت فعلي.</p>
   <div class="review-grid">
    <aside class="card review-panel" aria-labelledby="review-tasks-title"><h2 id="review-tasks-title">المهام العربية</h2><div class="review-task-list">
     ${TASKS.map((task,i)=>`<button class="review-task" data-action="review-task" data-index="${i}" aria-pressed="${i===s.selected}"><strong>${ar(i+1)}. <span>${task.name}</span></strong><span lang="ar" dir="rtl" data-verbatim>${task.prompt}</span><small class="${s.attempts[i]>1?'repeated':''}">${s.attempts[i]>1?'أُعيد التسجيل واجتاز الفحص':'واضح'}</small></button>`).join('')}
    </div></aside>
    <div class="review-center"><section class="card review-panel review-wave" aria-labelledby="review-wave-title">
     <h2 id="review-wave-title">${t.name}</h2><span class="playback-hint">${s.demo?'التشغيل بصوت مولّد. اختاري مقطعًا لسماع نصه فقط. الموجة والتوقيت توضيحيان.':'محاكاة مرئية دون صوت حقيقي'}</span>
     <div class="wave-box"><svg viewBox="0 0 590 102" role="img" aria-label="موجة صوتية توضيحية">
      ${clips.map(([a,b],i)=>`<rect x="${x(a)}" y="2" width="${x(b)-x(a)}" height="98" rx="5" fill="${i===s.reviewClip?'#edaa98':'#f5c8bd'}"/>`).join('')}
      <path d="M5 51h580" stroke="#e0ebe5" stroke-width="1"/>${waveBars(false,s.selected*7)}
      <line id="playhead" x1="${x(s.playTime)}" y1="4" x2="${x(s.playTime)}" y2="98" stroke="#123c34" stroke-width="1.7"/></svg>
      <div class="wave-axis"><span>00:00</span><span id="play-time">${time(s.playTime)} / ${time(t.seconds)}</span><span>${time(t.seconds)}</span></div></div>
     ${clips.length?`<div class="review-legend">المقاطع المحددة</div><div class="review-clips-inline">${clips.map(([a,b],i)=>`<button data-action="review-clip" data-index="${i}" aria-pressed="${i===s.reviewClip}" aria-label="${esc(segmentLabel(s.selected,a,b))}"><span>المقطع</span> ${ar(i+1)}<time>${a.toFixed(1)}–${b.toFixed(1)} s</time></button>`).join('')}</div>`:'<p class="playback-hint">لا توجد مقاطع محددة في هذا المثال لهذه المهمة.</p>'}
     <div class="review-actions"><button id="review-play" class="btn btn-light" data-action="review-play">${icon(s.playing||isSpeaking()?'pause':'play')}<span>${reviewPlayLabel(selectedClip)}</span></button></div>
    </section>
    <section class="card review-panel review-note" aria-labelledby="review-note-title"><h2 id="review-note-title">ملاحظات المختص</h2><textarea id="review-note" dir="auto" aria-labelledby="review-note-title" maxlength="1200" placeholder="اكتبي ملاحظة اختيارية لإضافتها إلى التقرير.">${esc(s.note)}</textarea>
     <div class="review-actions"><button class="btn btn-light" data-action="review-compare" aria-pressed="${s.compareTasks}">${s.compareTasks?'عرض جميع المهام':'مقارنة القراءتين'}</button><button class="btn btn-secondary" data-action="review-export">${icon('print')}طباعة / حفظ PDF</button></div>
    </section></div>
    <section id="review-comparison" class="card review-panel review-comparison" tabindex="-1" aria-labelledby="review-comparison-title">
     <h2 id="review-comparison-title">${s.compareTasks?'مقارنة القراءتين':'مقارنة مهام المريض'}</h2><p class="playback-hint">درجات توضيحية لشدة اضطراب الصوت. الدرجة الأعلى تعني شدة أكبر في هذا المثال.</p>
     ${TASKS.map((task,i)=>s.compareTasks&&i!==1&&i!==2?'':`<div class="review-score ${i===s.selected||s.compareTasks?'emphasis':''} ${i===1?'high':''}"><span>${task.name}</span><span class="review-track" aria-hidden="true"><span style="width:${SAMPLE_SCORES[i]*10}%"></span></span><strong dir="ltr">${SAMPLE_SCORES[i].toFixed(1)}</strong></div>`).join('')}
     <div class="review-pattern"><strong>اختلاف بين القراءتين</strong><p>في هذا المثال، درجة القراءة الأولى أعلى من الثانية. يراجع المختص المقاطع لتفسير الفرق.</p></div>
     <div class="review-quality"><h2>جودة التسجيل</h2><dl><div><dt>تسجيلات اجتازت الفحص</dt><dd>${ar(s.recorded.filter(Boolean).length)} / ${ar(4)}</dd></div><div><dt>مرات إعادة التسجيل</dt><dd>${ar(repeats)}</dd></div></dl></div>
     <p class="ai-footer-note">للمراجعة فقط. يبقى التشخيص بعد التقييم السريري الكامل مسؤولية المختص.</p>
    </section>
   </div>
   <div class="review-end"><button class="btn btn-primary" data-action="report">عرض التقييم الأولي ${icon('arrow')}</button></div>
  </section>`;
 }
 function taskDetail(){
  const i=s.selected,t=TASKS[i],bad=i===2&&!s.qualityFixed,clip=s.demo&&s.segment?assessmentClip():null;
  return `<section id="task-detail" class="card task-detail" tabindex="-1" aria-label="تفاصيل ${t.name}">
   <div class="report-panel-head"><div><h2>${t.name}</h2><span class="small muted">${ar(t.seconds)} ثوانٍ · رسم توضيحي</span></div><button class="close-detail" data-action="close-detail" aria-label="إغلاق تفاصيل التسجيل">×</button></div>
   
   ${bad?`<span class="badge amber">${icon('alert')}جودة هذا المثال تحتاج إعادة</span>`:''}
   <div class="wave-box"><svg viewBox="0 0 590 102" role="img" aria-label="موجة صوتية توضيحية">
    <rect id="segment-highlight" x="${10+2/t.seconds*570}" y="2" width="${570/t.seconds}" height="98" rx="5" fill="#d8eade" opacity="${s.segment?1:0}"/>
    <path d="M5 51h580" stroke="#e0ebe5" stroke-width="1"/>${waveBars(false,i*7)}
    <line id="playhead" x1="${10+s.playTime/t.seconds*570}" y1="4" x2="${10+s.playTime/t.seconds*570}" y2="98" stroke="#123c34" stroke-width="1.7"/></svg>
    <div class="wave-axis"><span>00:00</span><span>${time(t.seconds/2)}</span><span>${time(t.seconds)}</span></div></div>
   <div class="playback-row"><button id="play-button" class="btn btn-light" data-action="play">${icon(s.playing||isSpeaking()?'pause':'play')}<span>${reviewPlayLabel(clip)}</span></button><span class="playback-hint">${s.demo?'الصوت مولّد من النص. الموجة والتوقيت توضيحيان.':'محاكاة مرئية دون صوت حقيقي'}</span><span id="play-time" class="time">${time(s.playTime)} / ${time(t.seconds)}</span></div>
   ${!s.demo||assessmentClip()?`<button id="segment-button" class="segment-button ${s.segment?'selected':''}" data-action="segment" aria-pressed="${s.segment}">${icon('pointer')}الموضع المرتبط بالملاحظة <time>00:02 – 00:03</time></button>`:''}
   <details class="acoustic-fold"><summary>قياسات صوتية للمختص</summary><div class="acoustic-values"><span>مدة المقطع <strong>${ar(t.seconds)} ثوانٍ</strong></span><span>طبقة الصوت التقديرية <strong dir="ltr">${t.pitch} Hz</strong></span></div><p>قيم توضيحية لوصف التسجيل؛ لا تحدد الحالة وحدها.</p></details>
  </section>`;
 }

 function report(){const a=AI_EXAMPLES[0];return `<section class="view assessment-wrap" aria-labelledby="view-title">
  <p class="print-only">تقييم أولي توضيحي · مثال معدّ مسبقًا، دون تسجيل أو تحليل فعلي</p>
  <div class="report-header"><div><h1 id="view-title">التقييم الأولي</h1><p class="subheading">خلاصة واحدة، مع المقاطع المرتبطة بها.</p></div><button class="btn btn-secondary" data-action="print">${icon('print')}طباعة / حفظ PDF</button></div>
  ${patientHistory()}<div class="assessment-demo">مثال توضيحي لتقييم مدعوم بالذكاء الاصطناعي؛ لا يوجد تحليل فعلي في هذا النموذج.</div>
  <section class="card ai-result-card" aria-label="خلاصة التقييم التوضيحي"><div class="ai-result-label">${icon('layers')}الخلاصة التوضيحية</div><h2>${a.title}</h2><p class="condition-en" dir="ltr">${a.english}</p><span class="badge neutral">مثال توضيحي، ليس تشخيصًا.</span></section>
  <section class="card why-card" aria-labelledby="evidence-title"><h2 id="evidence-title">ليش ظهر هذا النمط؟</h2><p>في المثال، درجة القراءة الأولى أعلى من الثانية. هذا الفرق يستحق مراجعة المختص.</p>
   <div class="why-scores" role="group" aria-label="درجات توضيحية للمقارنة">${a.tasks.map(i=>`<span class="why-score"><span>${TASKS[i].name}</span><strong dir="ltr">${SAMPLE_SCORES[i].toFixed(1)}</strong></span>`).join('')}</div>
   <p>التاريخ المرضي معروض كسياق للمختص، ولا يغيّر النتيجة في هذه المحاكاة.</p>
   <div class="evidence-list">${a.tasks.map(i=>`<button class="evidence-card" data-action="ai-evidence" data-index="${i}" aria-label="${esc(segmentLabel(i,2,3))}"><span class="evidence-icon">${icon(TASKS[i].icon)}</span><span><strong>${TASKS[i].name}</strong><time>00:02 – 00:03</time></span><span class="evidence-action">${s.demo?'اسمعي المقطع المرتبط':'افتحي المقطع المرتبط'} ${icon('play')}</span></button>`).join('')}</div>
   <div class="print-only print-segments"><strong>نصوص المقاطع المرتبطة</strong><ul>${a.tasks.map(i=>`<li><span>${TASKS[i].name}</span> <time dir="ltr">00:02 – 00:03</time>: <span lang="ar" dir="rtl" data-verbatim>${esc(SAMPLE_CLIPS[i].find(([start,end])=>start===2&&end===3)[2])}</span></li>`).join('')}</ul></div>
  </section>
  ${s.detailOpen?taskDetail():''}
  <details id="all-recordings" class="recordings-fold" ${s.recordingsOpen?'open':''}><summary>تفاصيل التسجيلات الأربعة</summary><div class="recordings-table-wrap"><table class="assessment-recordings"><caption class="sr-only">التسجيلات الأربعة وجودتها</caption><thead><tr><th scope="col">المهمة</th><th scope="col">جودة التسجيل</th><th scope="col"><span class="sr-only">فتح التسجيل</span></th></tr></thead><tbody>${TASKS.map((t,i)=>`<tr><th scope="row">${t.name}</th><td><span class="badge">${icon('check')}واضح</span></td><td><button class="table-review" data-action="select-report" data-index="${i}" aria-controls="task-detail" aria-expanded="${s.detailOpen&&s.selected===i}">${icon('play')}استعراض</button></td></tr>`).join('')}</tbody></table></div></details>
  ${s.note.trim()?`<section class="card review-saved-note"><h2>ملاحظات المختص</h2><p dir="auto" data-verbatim>${esc(s.note)}</p></section>`:''}
  <p class="ai-footer-note">الترجيح المعروض مثال للواجهة، ولا يثبت التشخيص أو يستبعد أسبابًا أخرى لاضطراب الصوت.</p>
 </section>`}
 function aiResult(){return report()}
 function render(focus=true){stepper();main.innerHTML=previousControl()+(s.demo?`<div class="card demo-entry demo-active"><strong>حالة تجريبية جاهزة</strong><button type="button" class="btn btn-light" data-action="exit-demo">العودة إلى مسار التقييم</button></div><p class="print-only demo-label">حالة تجريبية جاهزة</p>`:'')+(s.view>0?patientContext():'')+[welcome,record,quality,report,specialistReview][s.view]();if(s.view===0){syncPainFields();if(s.historyStep===2)MEDICAL_CHOICES.forEach(syncMedicalField)}translateView(main);translateView(document.getElementById('stepper'));if(focus){main.focus({preventScroll:true});window.scrollTo({top:0,behavior:'auto'})}document.title=tr(['التاريخ المرضي','التسجيل','فحص الجودة','التقييم الأولي','مراجعة المختص'][s.view])+' | '+tr('نبرة')}

 return { render, tr, translateChrome, time, icons, reviewPlayLabel, assessmentClip, syncPainFields, syncMedicalField, welcome, historySymptoms, patientHistory, record, recordControls, quality, specialistReview, report };
}

module.exports = { createView };
