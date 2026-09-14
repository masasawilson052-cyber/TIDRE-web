import {TODAY, money, RULE_VERSION, totals} from './core.js';
const scripts=new Map();
export function loadScript(name){if(scripts.has(name))return scripts.get(name);const p=new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=new URL('./vendor/'+name,import.meta.url).href;s.onload=resolve;s.onerror=()=>{scripts.delete(name);s.remove();reject(Error('The document tool could not load. Reconnect and try again.'));};document.head.append(s);});scripts.set(name,p);return p;}
export function download(data,filename,type='text/plain'){const blob=data instanceof Blob?data:new Blob([data],{type});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);}
let currentWorker=null;
export async function cancelExtraction(){if(currentWorker){const w=currentWorker;currentWorker=null;await w.terminate();}}
export async function extractDocument(file,onProgress){
 if(file.size>8*1024*1024)throw Error('Use a receipt image or one-page PDF smaller than 8 MB.');
 if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type))throw Error('Choose a JPG, PNG, WebP or one-page PDF.');
 onProgress('Preparing your receipt',.02);
 const bytes=await file.arrayBuffer();
 const sourceHash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))).map(b=>b.toString(16).padStart(2,'0')).join('');
 let imageBlob=file,text='',confidence=null,method='ocr';
 if(file.type==='application/pdf'){
   const pdfjs=await import('./vendor/pdf.min.mjs');pdfjs.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdf.worker.min.mjs',import.meta.url).href;
   const loadingTask=pdfjs.getDocument({data:new Uint8Array(bytes),isEvalSupported:false,stopAtErrors:true,disableFontFace:true});
   const pdf=await loadingTask.promise;
   try{
    if(pdf.numPages!==1)throw Error('Upload one receipt page at a time. This PDF contains '+pdf.numPages+' pages.');
    const page=await pdf.getPage(1),content=await page.getTextContent();
    let lastY=null;for(const item of content.items){if(!('str'in item))continue;const y=item.transform?.[5];if(lastY!==null&&Math.abs(y-lastY)>3)text+='\n';text+=item.str+' ';if(item.hasEOL)text+='\n';lastY=y;}
    const natural=page.getViewport({scale:1});const viewport=page.getViewport({scale:Math.min(2,2200/Math.max(natural.width,natural.height))});
    const canvas=document.createElement('canvas');canvas.width=viewport.width;canvas.height=viewport.height;
    await page.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    imageBlob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
    if(!imageBlob)throw Error('This PDF could not be previewed. Try a photograph instead.');
    if(text.trim().length>=30){method='pdf-text';return {text,confidence,sourceHash,imageBlob,method};}
   }finally{if(typeof loadingTask.destroy==='function')await loadingTask.destroy();}
 }
 await loadScript('tesseract.min.js');onProgress('Loading the on-device reader',.06);
 const root=new URL('./vendor/',import.meta.url).href;
 const worker=await window.Tesseract.createWorker('eng',1,{workerPath:root+'worker.min.js',corePath:root+'tesseract-core-lstm.wasm.js',langPath:root,workerBlobURL:false,logger:m=>{onProgress(m.status==='recognizing text'?'Reading your receipt':'Loading the on-device reader',m.status==='recognizing text'?.25+m.progress*.7:.1);}});
 currentWorker=worker;
 try{const result=await worker.recognize(imageBlob);text=result.data.text;confidence=result.data.confidence;if(!text.trim())throw Error('No readable text was found. Retake the photo in better light or enter the record manually.');return {text,confidence,sourceHash,imageBlob,method};}
 finally{if(currentWorker===worker)currentWorker=null;await worker.terminate();}
}
function cleanPdfText(s){return String(s??'').normalize('NFKD').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/[–—→−]/g,'-').replace(/[×]/g,'x').replace(/[^\x20-\x7E\n]/g,'');}
let pdfFonts=null;
async function newPDF(){await loadScript('jspdf.umd.min.js');if(!pdfFonts)pdfFonts=Promise.all(['Inter-Regular','Inter-Bold'].map(async name=>{const response=await fetch(new URL('./vendor/'+name+'.ttf',import.meta.url));if(!response.ok)throw Error('Report font could not load. Please reconnect and try again.');const bytes=new Uint8Array(await response.arrayBuffer());let binary='';for(const byte of bytes)binary+=String.fromCharCode(byte);return {name,data:btoa(binary)};})).catch(error=>{pdfFonts=null;throw error;});const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true});const fonts=await pdfFonts;for(const font of fonts){doc.addFileToVFS(font.name+'.ttf',font.data);doc.addFont(font.name+'.ttf','Inter',font.name.endsWith('Bold')?'bold':'normal');}doc.setFont('Inter','normal');return doc;}
function pageHeader(doc,title,subtitle){doc.setFillColor(36,76,230);doc.rect(0,0,210,4,'F');doc.setTextColor(23,33,60);doc.setFont('Inter','bold');doc.setFontSize(20);doc.text('TIDRE',17,21);doc.setFontSize(9);doc.setFont('Inter','normal');doc.setTextColor(101,114,139);doc.text('INDEPENDENT PROTOTYPE',17,28);doc.setTextColor(23,33,60);doc.setFont('Inter','bold');doc.setFontSize(16);doc.text(cleanPdfText(title),17,43);doc.setFont('Inter','normal');doc.setFontSize(9);doc.setTextColor(101,114,139);doc.text(cleanPdfText(subtitle),17,50);}
function finishPDF(doc){const count=doc.getNumberOfPages();for(let i=1;i<=count;i++){doc.setPage(i);doc.setDrawColor(225,230,239);doc.line(17,279,193,279);doc.setFontSize(8);doc.setTextColor(101,114,139);doc.text('SAMPLE / USER-ENTERED DEMO DATA - NOT FILED WITH TRA',17,286);doc.text(i+' / '+count,193,286,{align:'right'});}return doc;}
export async function reportPDF(state,month){const doc=await newPDF();const records=state.records.filter(r=>r.date.startsWith(month));const sum=totals(records);pageHeader(doc,'Monthly business summary',state.profile.name+' | '+month+' | Generated '+TODAY);
 const cells=[['CONFIRMED SALES','TZS '+money(sum.sales)],['CONFIRMED EXPENSES','TZS '+money(sum.expenses)],['NET RECORDED MOVEMENT','TZS '+money(sum.balance)]];
 cells.forEach((c,i)=>{const x=17+i*60;doc.setFillColor(243,246,251);doc.roundedRect(x,59,56,23,3,3,'F');doc.setTextColor(101,114,139);doc.setFontSize(7);doc.text(c[0],x+4,66);doc.setTextColor(23,33,60);doc.setFontSize(12);doc.setFont('Inter','bold');doc.text(c[1],x+4,75);doc.setFont('Inter','normal');});
 doc.setFontSize(9);doc.text(sum.pending+' records awaiting review are excluded from totals. Voided records are also excluded.',17,92);doc.setTextColor(101,114,139);doc.text('Net movement is not taxable profit. This report is a preparation aid, not a TRA return.',17,99);
 let y=112;const header=()=>{doc.setFillColor(237,241,255);doc.rect(17,y-5,176,9,'F');doc.setTextColor(23,33,60);doc.setFont('Inter','bold');doc.setFontSize(8);[['DATE',19],['DESCRIPTION / REFERENCE',43],['TYPE',121],['STATUS',143],['TZS',191]].forEach(([v,x])=>doc.text(v,x,y,{align:v==='TZS'?'right':'left'}));doc.setFont('Inter','normal');y+=12;};header();
 for(const r of records.sort((a,b)=>a.date.localeCompare(b.date))){if(y>258){doc.addPage();pageHeader(doc,'Monthly business summary (continued)',state.profile.name+' | '+month);y=65;header();}doc.setTextColor(23,33,60);doc.setFontSize(8);const description=doc.splitTextToSize(cleanPdfText(r.description+(r.reference?' / '+r.reference:'')),72).slice(0,2);doc.text(r.date,19,y);doc.text(description,43,y);doc.text(r.type,121,y);doc.text(r.status,143,y);doc.text(money(r.amount),191,y,{align:'right'});y+=Math.max(11,description.length*4+6);doc.setDrawColor(230,234,243);doc.line(17,y-4,193,y-4);}
 if(!records.length){doc.text('No records for this period.',19,y);}
 finishPDF(doc).save('TIDRE-Summary-'+month+'.pdf');}
export async function businessReceiptPDF(profile,r){const doc=await newPDF();pageHeader(doc,'Business transaction record',profile.name+' | '+r.id);doc.setFillColor(255,243,216);doc.roundedRect(17,60,176,17,3,3,'F');doc.setTextColor(135,85,20);doc.setFont('Inter','bold');doc.setFontSize(11);doc.text('NOT A FISCAL RECEIPT - NOT AN EFD / VFD DOCUMENT',22,70);doc.setFont('Inter','normal');let y=93;for(const [label,value] of [['Date',r.date],['Type',r.type],['Party',r.seller||'Not specified'],['Description',r.description],['Reference',r.reference||'None'],['Category',r.category],['Payment',r.payment],['Status',r.status],['Amount','TZS '+money(r.amount)]]){doc.setTextColor(101,114,139);doc.setFontSize(10);doc.text(label,17,y);doc.setTextColor(23,33,60);const lines=doc.splitTextToSize(cleanPdfText(value),125);doc.text(lines,63,y);y+=Math.max(13,lines.length*5+7);}finishPDF(doc).save('TIDRE-Record-'+r.id+'.pdf');}
export async function estimatePDF(result,inputs){const doc=await newPDF();pageHeader(doc,'Tax planning worksheet','2026 | '+RULE_VERSION+' | Prepared '+TODAY);let y=66;const blocks=[['STATUS',result.status==='estimate'?'Planning estimate: TZS '+money(result.amount):'Estimate withheld - verification required'],['INPUTS','Annual turnover: TZS '+money(inputs.turnover)+'; complete records: '+(inputs.completeRecords?'yes':'no')],['CALCULATION',result.formula||result.reason],['ASSUMPTIONS',result.assumptions.join('\n')],['SOURCE',result.source.url],['REVIEWED','8 September 2026. Public-source snapshot, not a TRA-approved rule pack.'],['NEXT STEP','Confirm your situation and the applicable rules through the official TRA Taxpayer Portal. No assessment, filing or payment has been made.']];if(result.conflictSource)blocks.push(['CONFLICTING SOURCE',result.conflictSource.url]);for(const [label,content]of blocks){doc.setFont('Inter','bold');doc.setFontSize(8);doc.setTextColor(101,114,139);doc.text(label,17,y);y+=7;doc.setFont('Inter','normal');doc.setFontSize(10);doc.setTextColor(23,33,60);const lines=doc.splitTextToSize(cleanPdfText(content),175);doc.text(lines,17,y);y+=lines.length*5+12;}finishPDF(doc).save('TIDRE-Tax-Worksheet.pdf');}
