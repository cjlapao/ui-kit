import { chromium } from 'playwright-core';

const mk = (items, mode) => {
  const rows = items.map(([i,t,d]) => !t ? `<li class="sep"></li>` : `
    <li><button type="button" class="row">
      <span class="gutter">${i}</span>
      <span class="txt"><span class="title">${t}</span><span class="desc">${d}</span></span>
    </button></li>`).join('');
  return `<!doctype html><html><head><style>${css}</style></head><body>
    <div class="popup" style="width:${WIDTH}px"><div class="panel"><div class="pad"><div class="frame"><div class="viewport"><div class="content-${mode}">
      <ul>${rows}</ul>
    </div></div></div></div></div></div>
  </body></html>`;
};

const css = `
  *,::before,::after { box-sizing: border-box; } body { background:#111; color:#eee; font: 14px system-ui; margin:0; }
  .popup { position:fixed; left:20px; top:20px; }
  .panel { border:1px solid #444; border-radius:8px; background:#1b1b1b; }
  .pad { padding:6px; }
  .frame { position:relative; overflow:hidden; max-height:520px; }
  .viewport { position:relative; width:100%; overflow:auto; overflow-x:hidden; }
  .content-table { display:table; min-width:100%; padding-right:10px; }
  .content-block { display:block; min-width:100%; padding-right:10px; }
  ul { margin:0; padding:0; list-style:none; }
  .row { display:flex; width:100%; align-items:center; gap:8px; padding:8px 12px; background:none; border:0; color:inherit; text-align:left; }
  .gutter { width:20px; height:20px; flex-shrink:0; text-align:center; }
  .txt { min-width:0; flex:1; }
  .title { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500; }
  .desc { display:block; font-size:12px; opacity:.7; }
  .sep { border-top:1px solid #444; margin:6px 0; }
`;

const items = [
  ['＋','Add models',"Read api.openai.com (responses)'s model list and file the ones you want under it."],
  ['✎','Add one by hand',"Type one in — the model id, its capabilities and its price. The slug is made from the name."],
  ['⌕','Check catalog',"Compare the server's list with what you have here, without saving anything."],
  ['',''],
  ['✎','Edit api.openai.com (responses)',"Its address, the dialect it speaks and what it is paid for."],
  ['❚❚','Park api.openai.com (responses)',"A parked connection lends nothing: its models leave the pickers, and a loop already using one keeps running."],
];

let WIDTH = 240;   // popup narrower than the longest title's one-line width
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = {};
for (const mode of ['table','block']) {
  const page = await browser.newPage({ viewport:{width:1000,height:640} });
  await page.setContent(mk(items, mode));
  out[mode] = await page.evaluate(() => {
    const vp=document.querySelector('.viewport'), ct=document.querySelector('[class^=content-]');
    const title=document.querySelector('.title'), desc=document.querySelector('.desc');
    const r=e=>+e.getBoundingClientRect().width.toFixed(1);
    return { viewportClient:vp.clientWidth, viewportScroll:vp.scrollWidth, contentW:r(ct),
             titleW:r(title), titleScroll:title.scrollWidth, descW:r(desc) };
  });
  await page.screenshot({ path: new URL(`./bb-${mode}.png`, import.meta.url).pathname });
  await page.close();
}
console.log(JSON.stringify(out,null,1));
await browser.close();
