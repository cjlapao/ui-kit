import { chromium } from 'playwright-core';

const row = (icon, title, desc) => `
  <li>
    <button type="button" class="row">
      <span class="gutter">${icon}</span>
      <span class="txt"><span class="title">${title}</span><span class="desc">${desc}</span></span>
    </button>
  </li>`;

const items = [
  ['＋','Add models',"Read api.openai.com (responses)'s model list and file the ones you want under it."],
  ['✎','Add one by hand',"Type one in — the model id, its capabilities and its price. The slug is made from the name."],
  ['⌕','Check catalog',"Compare the server's list with what you have here, without saving anything."],
  ['',''],
  ['✎','Edit api.openai.com (responses)',"Its address, the dialect it speaks and what it is paid for."],
  ['❚❚','Park api.openai.com (responses)',"A parked connection lends nothing: its models leave the pickers, and a loop already using one keeps running."],
];
const rows = items.map(([i,t,d]) => i==='' ? `<li class="sep"></li>` : row(i,t,d)).join('');

const page_css = `
  body { background:#111; color:#eee; font: 14px system-ui; margin:0; }
  .popup { position:fixed; left:20px; top:20px; }
  .panel { border:1px solid #444; border-radius:8px; background:#1b1b1b; }
  .pad { padding:6px; }
  .frame { position:relative; overflow:hidden; max-height:520px; }
  .viewport { position:relative; width:100%; overflow:auto; overflow-x:hidden; }
  .content.table { display:table; min-width:100%; padding-right:10px; }
  .content.block { display:block; min-width:100%; padding-right:10px; }
  ul { margin:0; padding:0; list-style:none; }
  .row { display:flex; width:100%; align-items:center; gap:8px; padding:8px 12px; background:none; border:0; color:inherit; text-align:left; }
  .gutter { width:20px; height:20px; flex-shrink:0; text-align:center; }
  .txt { min-width:0; flex:1; }
  .title { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:500; }
  .desc { display:block; font-size:12px; opacity:.7; }
  .sep { border-top:1px solid #444; margin:6px 0; }
`;

const html = (contentCls) => `<!doctype html><html><head><style>${page_css}</style></head><body>
  <div class="popup" style="width:${WIDTH}px"><div class="panel"><div class="pad"><div class="frame"><div class="viewport"><div class="content ${contentCls}">
    <ul>${rows}</ul>
  </div></div></div></div></div></div>
</body></html>`;

let WIDTH = 256;
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
const out = {};
for (const mode of ['table','block']) {
  const page = await browser.newPage({ viewport:{width:1000,height:700} });
  await page.setContent(html(mode));
  out[mode] = await page.evaluate(() => {
    const vp = document.querySelector('.viewport');
    const ct = document.querySelector('.content');
    const title = document.querySelector('.title');
    const desc = document.querySelector('.desc');
    return { viewportClientWidth: vp.clientWidth, viewportScrollWidth: vp.scrollWidth,
             contentWidth: ct.getBoundingClientRect().width,
             titleLayoutWidth: +title.getBoundingClientRect().width.toFixed(1),
             descLayoutWidth: +desc.getBoundingClientRect().width.toFixed(1),
             popupWidth: document.querySelector('.popup').getBoundingClientRect().width };
  });
  await page.screenshot({ path: new URL(`./${mode}.png`, import.meta.url).pathname });
  await page.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
