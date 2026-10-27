const fs=require('fs'),vm=require('vm'),assert=require('assert');
const original=[['Timestamp','Nexus ID','First Name','Last Name'],['date','VAR–626–TESTA','Aurora','Tester'],['date','VAR–626–TESTB','Orion','Test Family'],['date','VAR–626–TESTC','Nova','Example']];
const rows=[Array(13).fill('HEADER')];
function sheet(data){return {getMaxColumns:()=>13,getMaxRows:()=>200,getLastRow:()=>data.length,getRange:(r,c,n=1,w=1)=>({getValues:()=>data.slice(r-1,r-1+n).map(row=>Array.from({length:w},(_,i)=>row[c-1+i]??'')),clearDataValidations(){},getValue:()=>data[r-1]?.[c-1],setValue:v=>data[r-1][c-1]=v,createTextFinder:id=>({matchEntireCell(){return this},findNext:()=>data.slice(1).some(row=>row[c-1]===id)})}),appendRow:r=>data.push(r)}}
const target=sheet(rows),source=sheet(original);let sequence=10000000;
const sandbox={PropertiesService:{getScriptProperties:()=>({getProperty:()=>'MOCK'})},SpreadsheetApp:{openById:()=>({getSheetByName:n=>n==='Nexus Access Registry'?source:target}),flush(){}},Utilities:{getUuid:()=>String(sequence++)+'-0000-0000-0000-000000000000'},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},ContentService:{MimeType:{JSON:'json',JAVASCRIPT:'js'},createTextOutput:s=>({setMimeType:()=>s})}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(__dirname+'/Phase2Registry.gs','utf8'),sandbox);
let req=0;const submit=(firstName,lastName,patch={})=>JSON.parse(sandbox.doPost({postData:{contents:JSON.stringify({requestId:'TEST_IDENTITY_'+String(++req).padStart(8,'0'),firstName,lastName,crossingStatus:'I WILL CONVERGE',finalPartySize:1,variantStatus:'PRIME',nexusId:'BROWSER-WRONG-ID',...patch})}}));
assert(submit('Aurora','Tester').ok);assert.equal(rows.at(-1)[10],'VAR–626–TESTA');
assert(submit('  ORION ',' Test   Family ').ok);assert.equal(rows.at(-1)[10],'VAR–626–TESTB');
assert(submit('Nova','Example',{variantStatus:'DECLARED',variantDesignation:'Fairy',variantDeclaration:'A test description',species:'Fairy'}).ok);assert.equal(rows.at(-1)[10],'VAR–626–TESTC');
assert(submit('Aurora','Different').ok);const newId=rows.at(-1)[10];assert(newId.startsWith('VAR-626-'));assert.notEqual(newId,'VAR–626–TESTA');
assert(submit('AURORA','Different',{nexusId:'SECOND-DEVICE-WRONG'}).ok);assert.equal(rows.at(-1)[10],newId);
assert(submit('Aurora','Tester',{crossingStatus:'I WILL NOT CONVERGE'}).ok);assert.equal(rows.at(-1)[10],'');
original.push(['date','CONFLICT','Aurora','Tester']);const count=rows.length;assert.equal(submit('Aurora','Tester').ok,false);assert.equal(rows.length,count);original.pop();
const p={requestId:'TEST_DUPLICATE_123456',crossingStatus:'I WILL NOT CONVERGE'};assert(submit('Test','Retry',p).ok);const before=rows.length;assert(submit('Test','Retry',p).duplicate);assert.equal(rows.length,before);
console.log('PASS: Phase 1 IDs reused for Prime and Variant; case/spacing normalized; browser IDs ignored; new guests reused across devices; decline blank; ambiguity rejected; retry idempotent.');
