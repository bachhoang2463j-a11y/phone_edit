#!/usr/bin/env node
/**
 * patch_comfyui.js
 * 在作者原版 8.0 phone_index.js 基础上移植 ComfyUI 本地生图支持。
 * 全部为文本级精确替换，每个替换断言"恰好出现 1 次"。
 * 输入: ../phone_index.js  输出: ../phone_index_fixed.js
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'phone_index.js');
const OUT = path.join(__dirname, '..', 'phone_index_fixed.js');

// ---------------------------------------------------------------- 替换表
const replacements = [
  // ============ Module 920 配置中心 ============
  {
    name: 'P1_920_apiFormat合法值加comfyui',
    from: "function b(e,n){const t=String(e??'').trim();return'novelai'===t||'openai'===t||'gemini'===t||'pollinations'===t?t:n}",
    to: "function b(e,n){const t=String(e??'').trim();return'novelai'===t||'openai'===t||'gemini'===t||'pollinations'===t||'comfyui'===t?t:n}",
  },
  {
    name: 'P2_920默认配置加comfyui对象',
    from: "d={url:'https://gen.pollinations.ai/image',key:'',model:'',promptPrefix:'',promptSuffix:''};function p(){return{apiFormat:i,promptComposeMode:s,novelai:{...l},openai:{...c},gemini:{...A},pollinations:{...d}}}",
    to: "d={url:'https://gen.pollinations.ai/image',key:'',model:'',promptPrefix:'',promptSuffix:''},q={url:'http://127.0.0.1:8188',key:'',model:'',workflowJson:'',positivePromptNodeId:'6',negativePromptNodeId:'7',samplerNodeId:'3',promptPrefix:'',promptSuffix:'',negativePrompt:''};function p(){return{apiFormat:i,promptComposeMode:s,novelai:{...l},openai:{...c},gemini:{...A},pollinations:{...d},comfyui:{...q}}}",
  },
  {
    name: 'P3_920新增sanitizeComfyUi函数',
    from: "promptSuffix:'string'==typeof t.promptSuffix?t.promptSuffix:n.promptSuffix}}function w(){",
    to: "promptSuffix:'string'==typeof t.promptSuffix?t.promptSuffix:n.promptSuffix}}function J(e,n){const t=e&&'object'==typeof e?e:{};return{url:'string'==typeof t.url&&t.url?t.url:n.url,key:'string'==typeof t.key?t.key:n.key,model:'string'==typeof t.model?t.model:n.model,workflowJson:'string'==typeof t.workflowJson?t.workflowJson:n.workflowJson,positivePromptNodeId:'string'==typeof t.positivePromptNodeId&&t.positivePromptNodeId?t.positivePromptNodeId:n.positivePromptNodeId,negativePromptNodeId:'string'==typeof t.negativePromptNodeId&&t.negativePromptNodeId?t.negativePromptNodeId:n.negativePromptNodeId,samplerNodeId:'string'==typeof t.samplerNodeId&&t.samplerNodeId?t.samplerNodeId:n.samplerNodeId,promptPrefix:'string'==typeof t.promptPrefix?t.promptPrefix:n.promptPrefix,promptSuffix:'string'==typeof t.promptSuffix?t.promptSuffix:n.promptSuffix,negativePrompt:'string'==typeof t.negativePrompt?t.negativePrompt:n.negativePrompt}}function w(){",
  },
  {
    name: 'P4_920_load分区分支加comfyui',
    from: "if(n.novelai&&'object'==typeof n.novelai||n.openai&&'object'==typeof n.openai||n.gemini&&'object'==typeof n.gemini||n.pollinations&&'object'==typeof n.pollinations)return{apiFormat:t,promptComposeMode:a,novelai:B(n.novelai,l),openai:y(n.openai,c),gemini:k(n.gemini,A),pollinations:E(n.pollinations,d)};",
    to: "if(n.novelai&&'object'==typeof n.novelai||n.openai&&'object'==typeof n.openai||n.gemini&&'object'==typeof n.gemini||n.pollinations&&'object'==typeof n.pollinations||n.comfyui&&'object'==typeof n.comfyui)return{apiFormat:t,promptComposeMode:a,novelai:B(n.novelai,l),openai:y(n.openai,c),gemini:k(n.gemini,A),pollinations:E(n.pollinations,d),comfyui:J(n.comfyui,q)};",
  },
  {
    name: 'P5_920_load旧格式分支加comfyui',
    from: "const o=n,C=B(o,l),m=y(o,c),g=k(o,A),u=E(o,d);return'novelai'!==t&&(C.url=l.url,C.key=l.key,C.model=l.model,C.promptPrefix=l.promptPrefix,C.promptSuffix=l.promptSuffix),'openai'!==t&&(m.url=c.url,m.key=c.key,m.model=c.model,m.promptPrefix=c.promptPrefix,m.promptSuffix=c.promptSuffix),'gemini'!==t&&(g.url=A.url,g.key=A.key,g.model=A.model,g.promptPrefix=A.promptPrefix,g.promptSuffix=A.promptSuffix),'pollinations'!==t&&(u.url=d.url,u.key=d.key,u.model=d.model,u.promptPrefix=d.promptPrefix,u.promptSuffix=d.promptSuffix),{apiFormat:t,promptComposeMode:a,novelai:C,openai:m,gemini:g,pollinations:u}",
    to: "const o=n,C=B(o,l),m=y(o,c),g=k(o,A),u=E(o,d),P=J(o,q);return'novelai'!==t&&(C.url=l.url,C.key=l.key,C.model=l.model,C.promptPrefix=l.promptPrefix,C.promptSuffix=l.promptSuffix),'openai'!==t&&(m.url=c.url,m.key=c.key,m.model=c.model,m.promptPrefix=c.promptPrefix,m.promptSuffix=c.promptSuffix),'gemini'!==t&&(g.url=A.url,g.key=A.key,g.model=A.model,g.promptPrefix=A.promptPrefix,g.promptSuffix=A.promptSuffix),'pollinations'!==t&&(u.url=d.url,u.key=d.key,u.model=d.model,u.promptPrefix=d.promptPrefix,u.promptSuffix=d.promptSuffix),'comfyui'!==t&&(P.url=q.url,P.key=q.key,P.model=q.model,P.workflowJson=q.workflowJson,P.positivePromptNodeId=q.positivePromptNodeId,P.negativePromptNodeId=q.negativePromptNodeId,P.samplerNodeId=q.samplerNodeId,P.promptPrefix=q.promptPrefix,P.promptSuffix=q.promptSuffix,P.negativePrompt=q.negativePrompt),{apiFormat:t,promptComposeMode:a,novelai:C,openai:m,gemini:g,pollinations:u,comfyui:P}",
  },
  {
    name: 'P6_920_save升级:try/catch+配额降级+返回标志',
    from: "function N(e){const n={apiFormat:b(e?.apiFormat,i),promptComposeMode:v(e?.promptComposeMode,s),novelai:B(e?.novelai,l),openai:y(e?.openai,c),gemini:k(e?.gemini,A),pollinations:E(e?.pollinations,d)};localStorage.setItem(r,JSON.stringify(n))}",
    to: "function N(e){try{const n={apiFormat:b(e?.apiFormat,i),promptComposeMode:v(e?.promptComposeMode,s),novelai:B(e?.novelai,l),openai:y(e?.openai,c),gemini:k(e?.gemini,A),pollinations:E(e?.pollinations,d),comfyui:J(e?.comfyui,q)};localStorage.setItem(r,JSON.stringify(n));return!0}catch(n){if('QuotaExceededError'===n?.name||22===n?.code||'NS_ERROR_DOM_QUOTA_REACHED'===String(n?.code)){try{const t={apiFormat:b(e?.apiFormat,i),promptComposeMode:v(e?.promptComposeMode,s),novelai:B(e?.novelai,l),openai:y(e?.openai,c),gemini:k(e?.gemini,A),pollinations:E(e?.pollinations,d),comfyui:J(e?.comfyui,q)};t.comfyui&&delete t.comfyui.workflowJson;localStorage.setItem(r,JSON.stringify(t));console.warn('[ConfigService] 配置超出存储配额，已剔除 ComfyUI 工作流 JSON 后保存');return'trimmed'}catch(t){return console.warn('[ConfigService] 保存绘图配置失败（配额降级后仍失败）:',t),!1}}return console.warn('[ConfigService] 保存绘图配置失败:',n),!1}}",
  },

  // ============ Module 685 生图引擎 ============
  {
    name: 'P7_685_插入comfyui分发分支',
    from: "if('pollinations'===t.apiFormat){const n=t.pollinations",
    to: "if('comfyui'===t.apiFormat){const cfu=t.comfyui||{},cfuUrl=String(cfu.url||'').trim();if(!cfuUrl)throw new Error('未配置 ComfyUI URL');const cfPrompt='natural'===r||'natural_en'===r?v(cfu.promptPrefix,e,cfu.promptSuffix):b(cfu.promptPrefix,e,cfu.promptSuffix),cfNeg=b(cfu.negativePrompt),cfPos=String(cfu.positivePromptNodeId||'').trim()||'6',cfNegN=String(cfu.negativePromptNodeId||'').trim()||'7',cfSampler=String(cfu.samplerNodeId||'').trim()||'3',cfSeed=Math.floor(4294967295*Math.random()),cfRaw=String(cfu.workflowJson||'').trim();let cfWf;if(cfRaw){try{cfWf=JSON.parse(cfRaw)}catch(cfE){throw new Error('ComfyUI 工作流 JSON 解析失败：'+String(cfE instanceof Error?cfE.message:cfE))}if(!cfWf||'object'!=typeof cfWf||Array.isArray(cfWf))throw new Error('ComfyUI 工作流 JSON 格式无效')}else{cfWf={'4':{class_type:'CheckpointLoaderSimple',inputs:{ckpt_name:''}},'6':{class_type:'CLIPTextEncode',inputs:{text:String(cfPrompt||''),clip:['4',1]}},'7':{class_type:'CLIPTextEncode',inputs:{text:String(cfNeg||''),clip:['4',1]}},'3':{class_type:'KSampler',inputs:{seed:cfSeed,steps:20,cfg:8,sampler_name:'euler',scheduler:'normal',denoise:1,model:['4',0],positive:['6',0],negative:['7',0]}},'8':{class_type:'VAEDecode',inputs:{samples:['3',0],vae:['4',2]}},'9':{class_type:'SaveImage',inputs:{filename_prefix:'improved_phone',images:['8',0]}}};const cfCk=cfWf['4'];if(cfCk&&'object'==typeof cfCk&&'inputs'in cfCk){const cfM=String(cfu.model||'').trim();cfM&&(cfCk.inputs.ckpt_name=cfM)}}const cfPT=cfWf[cfPos];if(cfPT&&'object'==typeof cfPT&&cfPT.inputs&&'object'==typeof cfPT.inputs&&'text'in cfPT.inputs)cfPT.inputs.text=String(cfPrompt||'');const cfNT=cfWf[cfNegN];if(cfNT&&'object'==typeof cfNT&&cfNT.inputs&&'object'==typeof cfNT.inputs&&'text'in cfNT.inputs)cfNT.inputs.text=String(cfNeg||'');if(cfSampler in cfWf&&cfWf[cfSampler]&&'object'==typeof cfWf[cfSampler]){const cfS=cfWf[cfSampler];if('inputs'in cfS&&cfS.inputs&&'object'==typeof cfS.inputs){const cfO=cfS.inputs.seed;if(!('number'==typeof cfO&&cfO>=0))cfS.inputs.seed=cfSeed}else cfS.seed=cfSeed}const cfBase=cfuUrl.replace(/\\/+$/,'');let cfRes;try{cfRes=await fetch(cfBase+'/prompt',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:cfWf,client_id:'improved-phone-'+Math.random().toString(36).slice(2)}),signal:n?.signal})}catch(cfE){throw new Error('ComfyUI 请求失败（请确认本地服务已启动且允许跨域 --enable-cors-header \"*\"）：'+String(cfE instanceof Error?cfE.message:cfE))}if(!cfRes.ok){const cfTxt=await cfRes.text().catch(()=>'');throw new Error('ComfyUI 提交失败 HTTP '+cfRes.status+': '+(cfTxt?cfTxt:'未知错误'))}const cfBody=await cfRes.json().catch(()=>null),cfId=cfBody?.prompt_id;if(!cfId)throw new Error('ComfyUI 响应缺少 prompt_id');const cfDeadline=Date.now()+120000;let cfHis=null;for(;;){if(n?.signal?.aborted)throw new Error('生成已取消');if(Date.now()>cfDeadline)throw new Error('ComfyUI 生成超时（120 秒）');await new Promise(cfE=>setTimeout(cfE,1000));const cfHr=await fetch(cfBase+'/history/'+cfId,{signal:n?.signal});if(!cfHr.ok)continue;const cfH=await cfHr.json().catch(()=>null),cfEntry=cfH?.[cfId];if(!cfEntry)continue;if(cfEntry.status?.status_str==='error'||cfEntry.status?.error){const cfMsg=cfEntry.status?.messages?.find(e=>e&&'object'==typeof e&&'error'===e[0]&&e[1]?.message);throw new Error('ComfyUI 生成失败：'+String(cfMsg?.[1]?.message||'未知错误'))}if(cfEntry.status?.completed||cfEntry.outputs){cfHis=cfEntry;break}}const cfOut=cfHis?.outputs||{};let cfFile='',cfSub='';for(const cfK in cfOut){const cfImg=cfOut[cfK]?.images?.[0];if(cfImg&&cfImg.filename){cfFile=cfImg.filename;cfSub=cfImg.subfolder||'';break}}if(!cfFile)throw new Error('ComfyUI 输出中未找到图片');const cfVr=await fetch(cfBase+'/view?filename='+encodeURIComponent(cfFile)+(cfSub?'&subfolder='+encodeURIComponent(cfSub):'')+'&type=output',{signal:n?.signal});if(!cfVr.ok)throw new Error('ComfyUI 获取图片失败 HTTP '+cfVr.status);const cfUrl=await x(await cfVr.blob());return console.info('[AI] image result',{url:i(cfUrl),length:cfUrl.length}),{dataUrl:cfUrl}}if('pollinations'===t.apiFormat){const n=t.pollinations",
  },

  // ============ ImageGenSettings 设置页 script ============
  {
    name: 'P8_script_computed_w加comfyui',
    from: "w=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return n.value.pollinations;case'openai':return n.value.openai;case'gemini':return n.value.gemini;default:return n.value.novelai}})",
    to: "w=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return n.value.pollinations;case'openai':return n.value.openai;case'gemini':return n.value.gemini;case'comfyui':return n.value.comfyui;default:return n.value.novelai}})",
  },
  {
    name: 'P9_script_key getter/setter加comfyui',
    from: "N=(0,i.computed)({get:()=>{switch(n.value.apiFormat){case'pollinations':return n.value.pollinations.key;case'openai':return n.value.openai.key;case'gemini':return n.value.gemini.key;default:return n.value.novelai.key}},set:e=>{'pollinations'!==n.value.apiFormat?'openai'!==n.value.apiFormat?'gemini'!==n.value.apiFormat?n.value.novelai.key=e:n.value.gemini.key=e:n.value.openai.key=e:n.value.pollinations.key=e}})",
    to: "N=(0,i.computed)({get:()=>{switch(n.value.apiFormat){case'pollinations':return n.value.pollinations.key;case'openai':return n.value.openai.key;case'gemini':return n.value.gemini.key;case'comfyui':return n.value.comfyui.key;default:return n.value.novelai.key}},set:e=>{'comfyui'===n.value.apiFormat?n.value.comfyui.key=e:'pollinations'!==n.value.apiFormat?'openai'!==n.value.apiFormat?'gemini'!==n.value.apiFormat?n.value.novelai.key=e:n.value.gemini.key=e:n.value.openai.key=e:n.value.pollinations.key=e}})",
  },
  {
    name: 'P10_script_格式名computed加comfyui',
    from: "F=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return'Pollinations（URL）';case'openai':return'OpenAI（兼容）';case'gemini':return'Gemini（原生）';default:return'NovelAI'}})",
    to: "F=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return'Pollinations（URL）';case'openai':return'OpenAI（兼容）';case'gemini':return'Gemini（原生）';case'comfyui':return'ComfyUI（本地）';default:return'NovelAI'}})",
  },
  {
    name: 'P11_script_URL占位computed加comfyui',
    from: "V=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return'例如：https://gen.pollinations.ai/image';case'openai':return'例如：https://api.openai.com';case'gemini':return'例如：https://generativelanguage.googleapis.com';default:return'例如：https://image.novelai.net'}})",
    to: "V=(0,i.computed)(()=>{switch(n.value.apiFormat){case'pollinations':return'例如：https://gen.pollinations.ai/image';case'openai':return'例如：https://api.openai.com';case'gemini':return'例如：https://generativelanguage.googleapis.com';case'comfyui':return'例如：http://127.0.0.1:8188';default:return'例如：https://image.novelai.net'}})",
  },
  {
    name: 'P12_script_fetchModels加comfyui特判',
    from: "if('novelai'===e)return void Se.warning('NovelAI 无需在线获取模型列表');",
    to: "if('novelai'===e)return void Se.warning('NovelAI 无需在线获取模型列表');if('comfyui'===e)return void Se.warning('ComfyUI 模型由工作流内的检查点节点决定，无需在线获取');",
  },
  {
    name: 'P13_script_保存函数Q升级',
    from: "Q=()=>{(0,Hr.saveNovelAiConfig)(n.value),Se.success('绘图配置已保存')}",
    to: "cfSaving=(0,i.ref)(!1),Q=()=>{if(cfSaving.value)return;cfSaving.value=!0;const cfCfg={...n.value,novelai:{...n.value.novelai},openai:{...n.value.openai},gemini:{...n.value.gemini},pollinations:{...n.value.pollinations},comfyui:{...n.value.comfyui}};setTimeout(()=>{let t;try{t=(0,Hr.saveNovelAiConfig)(cfCfg)}catch(cfE){console.error('[ImageGenSettings] 保存绘图配置失败:',cfE),t=!1}cfSaving.value=!1,t===!0?Se.success('绘图配置已保存'):'trimmed'===t?(console.warn('[ImageGenSettings] ComfyUI 工作流 JSON 超出存储配额，已自动剔除后保存'),Se.error('ComfyUI 工作流 JSON 过大，已自动剔除该字段后保存（其余配置已保存）')):(console.warn('[ImageGenSettings] 保存失败，请检查浏览器存储空间'),Se.error('绘图配置保存失败（可能超出浏览器存储限制）'))},0)}",
  },
  {
    name: 'P14_script_重置函数a加comfyui',
    from: "a={novelai:{url:n.value.novelai.url,key:n.value.novelai.key,model:n.value.novelai.model},openai:{url:n.value.openai.url,key:n.value.openai.key,model:n.value.openai.model},gemini:{url:n.value.gemini.url,key:n.value.gemini.key,model:n.value.gemini.model},pollinations:{url:n.value.pollinations.url,key:n.value.pollinations.key,model:n.value.pollinations.model}}",
    to: "a={novelai:{url:n.value.novelai.url,key:n.value.novelai.key,model:n.value.novelai.model},openai:{url:n.value.openai.url,key:n.value.openai.key,model:n.value.openai.model},gemini:{url:n.value.gemini.url,key:n.value.gemini.key,model:n.value.gemini.model},pollinations:{url:n.value.pollinations.url,key:n.value.pollinations.key,model:n.value.pollinations.model},comfyui:{url:n.value.comfyui?.url,key:n.value.comfyui?.key,model:n.value.comfyui?.model}}",
  },
  {
    name: 'P15_script_重置函数应用comfyui',
    from: "o.pollinations.url=a.pollinations.url,o.pollinations.key=a.pollinations.key,o.pollinations.model=a.pollinations.model,n.value=o",
    to: "o.pollinations.url=a.pollinations.url,o.pollinations.key=a.pollinations.key,o.pollinations.model=a.pollinations.model,o.comfyui.url=a.comfyui.url||'http://127.0.0.1:8188',o.comfyui.key=a.comfyui.key,o.comfyui.model=a.comfyui.model,n.value=o",
  },

  // ============ ImageGenSettings 设置页 render ============
  {
        name: 'P16_render_apiFormat按钮加ComfyUI(最左+d149)',
    from: "(0,i.createElementVNode)('button',{type:'button',class:(0,i.normalizeClass)(['format-btn',{active:'novelai'===n.value.apiFormat}]),onClick:d[5]||(d[5]=e=>n.value.apiFormat='novelai')},' NovelAI ',2)",
    to: "(0,i.createElementVNode)('button',{type:'button',class:(0,i.normalizeClass)(['format-btn',{active:'comfyui'===n.value.apiFormat}]),onClick:d[149]||(d[149]=e=>n.value.apiFormat='comfyui')},' ComfyUI ',2),(0,i.createElementVNode)('button',{type:'button',class:(0,i.normalizeClass)(['format-btn',{active:'novelai'===n.value.apiFormat}]),onClick:d[5]||(d[5]=e=>n.value.apiFormat='novelai')},' NovelAI ',2)",
  },
  {
    name: 'P17_render_模型与参数区加ComfyUI配置区块',
    from: ",d[127]||(d[127]=(0,i.createElementVNode)('div',{class:'section-divider-line'},[(0,i.createElementVNode)('span',null,'模型与参数')],-1)),'pollinations'===n.value.apiFormat?((0,i.openBlock)(),(0,i.createElementBlock)('div',pj,[",
    to: ",d[127]||(d[127]=(0,i.createElementVNode)('div',{class:'section-divider-line'},[(0,i.createElementVNode)('span',null,'模型与参数')],-1)),'comfyui'===n.value.apiFormat?((0,i.openBlock)(),(0,i.createElementBlock)('div',{class:'settings-section',style:{'margin-top':'12px'}},[d[150]||(d[150]=(0,i.createElementVNode)('div',{class:'section-title'},'ComfyUI 节点设置',-1)),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'正向提示词节点 ID（默认 6）',-1),(0,i.withDirectives)((0,i.createElementVNode)('input',{'onUpdate:modelValue':d[151]||(d[151]=e=>n.value.comfyui.positivePromptNodeId=e),type:'text',class:'input-field',placeholder:'例如：6'},null,8),[[i.vModelText,n.value.comfyui.positivePromptNodeId]])]),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'反向提示词节点 ID（默认 7）',-1),(0,i.withDirectives)((0,i.createElementVNode)('input',{'onUpdate:modelValue':d[152]||(d[152]=e=>n.value.comfyui.negativePromptNodeId=e),type:'text',class:'input-field',placeholder:'例如：7'},null,8),[[i.vModelText,n.value.comfyui.negativePromptNodeId]])]),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'采样器/种子节点 ID（默认 3）',-1),(0,i.withDirectives)((0,i.createElementVNode)('input',{'onUpdate:modelValue':d[153]||(d[153]=e=>n.value.comfyui.samplerNodeId=e),type:'text',class:'input-field',placeholder:'例如：3'},null,8),[[i.vModelText,n.value.comfyui.samplerNodeId]])]),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'反向提示词（Negative Prompt）',-1),(0,i.withDirectives)((0,i.createElementVNode)('input',{'onUpdate:modelValue':d[154]||(d[154]=e=>n.value.comfyui.negativePrompt=e),type:'text',class:'input-field',placeholder:'例如：nsfw, low quality, bad anatomy'},null,8),[[i.vModelText,n.value.comfyui.negativePrompt]])]),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'模型（可选，写入 CheckpointLoaderSimple 节点）',-1),(0,i.withDirectives)((0,i.createElementVNode)('input',{'onUpdate:modelValue':d[155]||(d[155]=e=>n.value.comfyui.model=e),type:'text',class:'input-field',placeholder:'例如：v1-5-pruned-emaonly.safetensors'},null,8),[[i.vModelText,n.value.comfyui.model]])]),(0,i.createElementVNode)('div',{class:'input-group'},[(0,i.createElementVNode)('label',{class:'input-label'},'工作流 API JSON（留空则使用内置默认文生图工作流）',-1),(0,i.withDirectives)((0,i.createElementVNode)('textarea',{'onUpdate:modelValue':d[156]||(d[156]=e=>n.value.comfyui.workflowJson=e),class:'textarea-field',style:{'min-height':'120px','font-family':'monospace','font-size':'11px'},placeholder:'在 ComfyUI 网页勾选 Enable Dev mode Options → Save (API Format) 导出后粘贴此处'},null,8),[[i.vModelText,n.value.comfyui.workflowJson]])]),(0,i.createElementVNode)('div',{class:'input-hint',style:{'margin-top':'6px'}},' 本地 ComfyUI 需以 --enable-cors-header \"*\" 参数启动以允许跨域请求。 ',-1)])):(0,i.createCommentVNode)('v-if',!0),'pollinations'===n.value.apiFormat?((0,i.openBlock)(),(0,i.createElementBlock)('div',pj,[",
  },
  {
    name: 'P18_boot_禁用旧初始化资源弹窗',
    from: "}catch{return!1}}()&&!function(){try{const e=getVariables({type:'character'})||{},n=r().get(e,'phone_data');return!(!n||!Array.isArray(n.characters)&&!n.user)}catch{return!1}}())",
    to: "}catch{return!1}}()&&!1&&!function(){try{const e=getVariables({type:'character'})||{},n=r().get(e,'phone_data');return!(!n||!Array.isArray(n.characters)&&!n.user)}catch{return!1}}())",
  },
  {
    name: 'P21_render_ComfyUI按钮禁用手工缓存',
    from: "onClick:d[149]||(d[149]=e=>n.value.apiFormat='comfyui')",
    to: "onClick:e=>n.value.apiFormat='comfyui'",
  },
  {
    name: 'P22_render_ComfyUI分支稳定key并禁用标题缓存',
    from: "(0,i.createElementBlock)('div',{class:'settings-section',style:{'margin-top':'12px'}},[d[150]||(d[150]=(0,i.createElementVNode)('div',{class:'section-title'},'ComfyUI 节点设置',-1))",
    to: "(0,i.createElementBlock)('div',{key:'comfyui',class:'settings-section',style:{'margin-top':'12px'}},[(0,i.createElementVNode)('div',{class:'section-title'},'ComfyUI 节点设置',-1)",
  },
  ...[
    ['151', 'positivePromptNodeId'],
    ['152', 'negativePromptNodeId'],
    ['153', 'samplerNodeId'],
    ['154', 'negativePrompt'],
    ['155', 'model'],
    ['156', 'workflowJson'],
  ].map(([index, field]) => ({
    name: `P23_render_ComfyUI_${field}禁用手工缓存`,
    from: `d[${index}]||(d[${index}]=e=>n.value.comfyui.${field}=e)`,
    to: `e=>n.value.comfyui.${field}=e`,
  })),
  ...[
    'positivePromptNodeId',
    'negativePromptNodeId',
    'samplerNodeId',
    'negativePrompt',
    'model',
    'workflowJson',
  ].map(field => ({
    name: `P24_render_ComfyUI_${field}修正vModel标志`,
    from: `},null,8),[[i.vModelText,n.value.comfyui.${field}]])`,
    to: `},null,512),[[i.vModelText,n.value.comfyui.${field}]])`,
  })),
  {
    name: 'P25_boot_preset_loader',
    from: "async function y5(){",
    to: "async function __improvedPhoneLoadPresetResources(e){const n=e&&'object'==typeof e?e:{},a=!1!==n.loadData,o=!1!==n.loadStickers,s=!1!==n.importRegex,t={data:!a,stickers:!o,regex:!s};if(a||o)try{const e=getVariables({type:'character'})||{};if(a){const n={...r().get(e,'phone_data')||{},user:r5.kQ,characters:r5.hg,randomAvatars:r5.I1,backgrounds:r5.sQ,music:r5.Og,map:r5.Tj,groups:r5.TN,fonts:r5.lG};r().set(e,'phone_data',n)}o&&r().set(e,'phone_stickers',Yl),await replaceVariables(e,{type:'character'}),a&&(t.data=!0),o&&(t.stickers=!0)}catch(e){console.error('[Improved Phone] preset character resources load failed:',e)}if(s)try{await b5(),t.regex=!0}catch(e){console.error('[Improved Phone] preset regex import failed:',e)}return t}globalThis.__improvedPhoneLoadPresetResources=__improvedPhoneLoadPresetResources;async function y5(){",
  },
  {
    name: 'P26_other_settings_preset_action',
    from: "b=(0,i.ref)(!1),{otherSettings:v,saveToStorage:x}=uN();",
    to: "b=(0,i.ref)(!1),P=(0,i.ref)(!1),O=(0,i.ref)(!0),R=(0,i.ref)(!0),X=(0,i.ref)(!0),Q=async()=>{if(P.value||!O.value&&!R.value&&!X.value)return;P.value=!0;try{const e=globalThis.__improvedPhoneLoadPresetResources;if('function'!=typeof e)throw new Error('预置资源加载函数不可用');const n=await e({loadData:O.value,loadStickers:R.value,importRegex:X.value});if(!((!O.value||n.data)&&(!R.value||n.stickers)&&(!X.value||n.regex)))throw new Error('部分预置资源载入失败');window.location.reload()}catch(e){console.error('[OtherSettings] 载入预置资源失败:',e),toastr.error('载入预置资源失败，请查看控制台')}finally{P.value=!1}},{otherSettings:v,saveToStorage:x}=uN();",
  },
  {
    name: 'P27_other_settings_preset_button',
    from: ",(0,i.createCommentVNode)(' 时间设置 '),(0,i.createElementVNode)('div',fO,[",
    to: ",(0,i.createCommentVNode)(' 预置资源 '),(0,i.createElementVNode)('div',fO,[(0,i.createElementVNode)('div',{class:'section-title'},'预置资源',-1),(0,i.createElementVNode)('div',{class:'info-note'},[(0,i.createElementVNode)('i',{class:'fas fa-database'},null,-1),(0,i.createElementVNode)('span',null,'选择要为当前角色卡载入的内置资源',-1)]),(0,i.createElementVNode)('div',{class:'config-item'},[(0,i.createElementVNode)('div',{class:'config-text'},[(0,i.createElementVNode)('span',{class:'config-name'},'加载默认数据',-1),(0,i.createElementVNode)('span',{class:'config-desc'},'用户、角色、背景、头像、音乐、地图、群组和字体',-1)]),(0,i.createElementVNode)('label',{class:'toggle-switch'},[(0,i.createElementVNode)('input',{type:'checkbox',checked:O.value,onChange:e=>O.value=e.target.checked},null,40,['checked']),(0,i.createElementVNode)('span',{class:'toggle-slider'},null,-1)])]),(0,i.createElementVNode)('div',{class:'config-item'},[(0,i.createElementVNode)('div',{class:'config-text'},[(0,i.createElementVNode)('span',{class:'config-name'},'加载默认表情包',-1),(0,i.createElementVNode)('span',{class:'config-desc'},'写入当前角色卡的表情包库',-1)]),(0,i.createElementVNode)('label',{class:'toggle-switch'},[(0,i.createElementVNode)('input',{type:'checkbox',checked:R.value,onChange:e=>R.value=e.target.checked},null,40,['checked']),(0,i.createElementVNode)('span',{class:'toggle-slider'},null,-1)])]),(0,i.createElementVNode)('div',{class:'config-item'},[(0,i.createElementVNode)('div',{class:'config-text'},[(0,i.createElementVNode)('span',{class:'config-name'},'导入默认正则',-1),(0,i.createElementVNode)('span',{class:'config-desc'},'导入为酒馆全局正则',-1)]),(0,i.createElementVNode)('label',{class:'toggle-switch'},[(0,i.createElementVNode)('input',{type:'checkbox',checked:X.value,onChange:e=>X.value=e.target.checked},null,40,['checked']),(0,i.createElementVNode)('span',{class:'toggle-slider'},null,-1)])]),(0,i.createElementVNode)('button',{type:'button',class:'binding-btn',disabled:P.value||!O.value&&!R.value&&!X.value,onClick:Q},[(0,i.createElementVNode)('i',{class:'fas fa-download'},null,-1),(0,i.createElementVNode)('span',null,(0,i.toDisplayString)(P.value?'载入中...':'载入所选资源'),1)],8,['disabled'])]),(0,i.createCommentVNode)(' 时间设置 '),(0,i.createElementVNode)('div',fO,[",
  },
  {
    name: 'P28_boot_hide_ready_notification',
    from: "}else Q_(e);const t=ke(),",
    to: "}else $_(e);const t=ke(),",
  },
  {
    name: 'P29_boot_disable_automatic_regex_import',
    from: "function(){try{const e=localStorage.getItem('improved_phone_import_regex');return null===e||'true'===e}catch{return!0}}()&&await b5(),await B5(),",
    to: "!1&&await b5(),await B5(),",
  },
];

// ---------------------------------------------------------------- 执行
let src = fs.readFileSync(SRC, 'utf8');
const log = [];
let failed = false;

for (const r of replacements) {
  const count = src.split(r.from).length - 1;
  if (count !== 1) {
    failed = true;
    log.push(`FAIL  ${r.name}: 期望出现 1 次，实际 ${count} 次`);
  } else {
    src = src.split(r.from).join(r.to);
    log.push(`OK    ${r.name}`);
  }
}

if (failed) {
  console.error(log.join('\n'));
  console.error('\n存在失败项，未写出任何文件。');
  process.exit(1);
}

fs.writeFileSync(OUT, src, 'utf8');
console.log(log.join('\n'));
console.log(`\n已写出: ${OUT} (${src.length} 字节)`);

// 导出替换表供验证脚本复用
module.exports = { replacements };
