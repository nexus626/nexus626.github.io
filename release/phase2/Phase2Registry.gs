/* Phase 2 registry. Update the existing web app deployment with a new version.
   Execute as owner; access Anyone. Preserve REGISTRY_ID in Script properties. */
function registryId_(){const id=PropertiesService.getScriptProperties().getProperty('REGISTRY_ID');if(!id)throw Error('Registry configuration missing');return id;}
const REGISTRY_TAB = 'Variant Recognition Registry';
const HEADERS = ['Timestamp','First Name','Last Name','Full Name','Final Crossing Status','Final Party Size','Variant Status','Variant Designation','Variant Declaration','Species / Nature','Nexus ID','Passport Status','Request ID'];
function registry_(){const s=SpreadsheetApp.openById(registryId_()).getSheetByName(REGISTRY_TAB);if(!s)throw Error('Registry tab missing');if(s.getMaxColumns()<13)s.insertColumnAfter(s.getMaxColumns());if(s.getRange(1,13).getValue()!=='Request ID')s.getRange(1,13).setValue('Request ID');s.getRange(2,13,s.getMaxRows()-1,1).clearDataValidations();return s;}
function text_(v,max){return String(v==null?'':v).trim().slice(0,max);}
function safe_(v){return /^[=+\-@]/.test(v)?"'"+v:v;}
function normalize_(d){const firstName=text_(d.firstName,80),lastName=text_(d.lastName,80),requestId=text_(d.requestId,80);if(!firstName||!lastName)throw Error('First and last names are required');if(!/^[a-zA-Z0-9_-]{16,80}$/.test(requestId))throw Error('Invalid request identifier');const crossingStatus=d.crossingStatus;if(!['I WILL CONVERGE','I WILL NOT CONVERGE'].includes(crossingStatus))throw Error('Invalid crossing status');const attending=crossingStatus==='I WILL CONVERGE',finalPartySize=attending?Number(d.finalPartySize):0;if(attending&&(!Number.isInteger(finalPartySize)||finalPartySize<1||finalPartySize>99))throw Error('Invalid party size');const variantStatus=attending?d.variantStatus:'NOT ATTENDING';if(attending&&!['PRIME','DECLARED'].includes(variantStatus))throw Error('Choose Prime or Variant');const declared=attending&&variantStatus==='DECLARED';const designation=declared?text_(d.variantDesignation,150):attending?'PRIME':'';const declaration=declared?text_(d.variantDeclaration,2000):attending?'Prime human identity of this universe.':'';const species=declared?text_(d.species,120):attending?'Human':'';if(declared&&(!designation||!declaration||!species))throw Error('Complete all three Variant fields');return {firstName,lastName,requestId,crossingStatus,finalPartySize,variantStatus,designation,declaration,species,nexusId:'',passportStatus:attending?'PENDING':''};}
// The server owns identity assignment. Browser storage and submitted IDs are not authoritative.
function nameKey_(first,last){return (String(first||'')+' '+String(last||'')).normalize('NFKC').replace(/[‘’]/g,"'").trim().replace(/\s+/g,' ').toLowerCase();}
function idsForName_(rows,firstColumn,lastColumn,idColumn,key){return [...new Set(rows.filter(r=>nameKey_(r[firstColumn],r[lastColumn])===key).map(r=>String(r[idColumn]||'').trim()).filter(Boolean))];}
function resolveNexusId_(s,d){
  if(d.crossingStatus!=='I WILL CONVERGE')return '';
  const source=SpreadsheetApp.openById(registryId_()).getSheetByName('Nexus Access Registry');
  if(!source)throw Error('Phase 1 registry missing');
  const header=source.getRange(1,2,1,3).getValues()[0];
  if(header.join('|')!=='Nexus ID|First Name|Last Name')throw Error('Phase 1 identity columns changed');
  const original=source.getLastRow()>1?source.getRange(2,2,source.getLastRow()-1,3).getValues():[];
  const key=nameKey_(d.firstName,d.lastName),matches=idsForName_(original,1,2,0,key);
  if(matches.length>1)throw Error('Multiple Phase 1 identities match this name. Please contact the organizer.');
  if(matches.length===1)return matches[0];
  const existing=s.getLastRow()>1?s.getRange(2,2,s.getLastRow()-1,10).getValues():[];
  const prior=idsForName_(existing,0,1,9,key);
  if(prior.length>1)throw Error('Multiple identities match this name. Please contact the organizer.');
  if(prior.length===1)return prior[0];
  // A genuinely new guest gets a server-generated ID, reused on later submissions.
  const used=new Set(original.map(r=>String(r[0]||'' )).concat(existing.map(r=>String(r[9]||''))));
  for(let attempt=0;attempt<10;attempt++){const id='VAR-626-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();if(!used.has(id))return id;}
  throw Error('Could not allocate an identity. Please retry.');
}
function doPost(e){let lock;try{const d=normalize_(JSON.parse(e.postData.contents));lock=LockService.getScriptLock();lock.waitLock(20000);const s=registry_();const found=find_(s,d.requestId);if(found)return json_({ok:true,requestId:d.requestId,duplicate:true});d.nexusId=resolveNexusId_(s,d);s.appendRow([new Date().toISOString(),safe_(d.firstName),safe_(d.lastName),safe_(d.firstName+' '+d.lastName),d.crossingStatus,d.finalPartySize,d.variantStatus,safe_(d.designation),safe_(d.declaration),safe_(d.species),safe_(d.nexusId),d.passportStatus,d.requestId]);SpreadsheetApp.flush();return json_({ok:true,requestId:d.requestId});}catch(err){return json_({ok:false,error:String(err.message||err)});}finally{if(lock)lock.releaseLock();}}
function find_(s,id){const n=s.getLastRow();if(n<2)return false;return !!s.getRange(2,13,n-1,1).createTextFinder(id).matchEntireCell(true).findNext();}
function doGet(e){const q=e.parameter||{},id=text_(q.requestId,80),callback=text_(q.callback,100);if(q.action==='health')return json_({ok:true,service:'NEXUS_PHASE2',version:3});if(q.action!=='status'||!/^[a-zA-Z0-9_-]{16,80}$/.test(id))return json_({ok:false,error:'Invalid status request'});if(!/^nexusAck_[a-zA-Z0-9_]+$/.test(callback))return json_({ok:false,error:'Invalid callback'});const result={ok:true,saved:find_(registry_(),id),requestId:id};return ContentService.createTextOutput(callback+'('+JSON.stringify(result)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);}
function json_(v){return ContentService.createTextOutput(JSON.stringify(v)).setMimeType(ContentService.MimeType.JSON);}
