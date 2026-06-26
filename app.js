let PRODUCTS = [];

const CART_TTL_MS = 24 * 60 * 60 * 1000; // артикулите се пазят до 24 часа

// Зарежда количката устойчиво: пропуска повредени данни и изтекли (>24ч) артикули.
function loadCart() {
  let raw;
  try { raw = JSON.parse(localStorage.getItem('kinora_cart') || '[]'); }
  catch (e) { raw = []; }
  if (!Array.isArray(raw)) raw = [];
  const now = Date.now();
  return raw.filter(it => it && (!it.addedAt || (now - it.addedAt) < CART_TTL_MS));
}
let cart = loadCart();
let selSz = {}, selQty = {};

/* SOLD-OUT — кои уникати вече са продадени (от Supabase, без достъп до поръчките) */
const SUPABASE_URL = 'https://owkoprksrvjlebonaehj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93a29wcmtzcnZqbGVib25hZWhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NTIxNzgsImV4cCI6MjA5NjIyODE3OH0.UZdyvXOmEJTZ6r54fSlVgNNBja98qx-dpJqu9yGNlFA';
let soldIds = new Set();
function isSold(id){ return soldIds.has(id); }
async function loadSoldIds(){
  try{
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sold_product_ids`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${SUPABASE_KEY}` },
      body:'{}'
    });
    if(!res.ok) return;
    const ids = await res.json();
    if(Array.isArray(ids)) soldIds = new Set(ids);
  }catch(e){ /* мрежова грешка — показваме всичко като налично */ }
}

function hSVG(bg, ac, w=155) {
  const h = Math.round(w*1.45);
  return `<svg width="${w}" height="${h}" viewBox="0 0 200 290" xmlns="http://www.w3.org/2000/svg"><path d="M76,32 L44,56 L26,130 L24,238 L100,245 L176,238 L174,130 L156,56 L124,32 Z" fill="${bg}"/><path d="M100,32 L88,68 L100,90 L112,68 Z" fill="${ac}" opacity=".76"/><path d="M100,32 L76,32 L44,56 L62,78 L88,68 Z" fill="${ac}" opacity=".45"/><path d="M100,32 L124,32 L156,56 L138,78 L112,68 Z" fill="${ac}" opacity=".45"/><path d="M24,130 L44,56 L4,68 L2,162 L24,168 Z" fill="${bg}" opacity=".78"/><path d="M176,130 L156,56 L196,68 L198,162 L176,168 Z" fill="${bg}" opacity=".78"/><path d="M88,90 Q85,108 83,124" stroke="${ac}" stroke-width="1.5" fill="none" opacity=".6"/><path d="M112,90 Q115,108 117,124" stroke="${ac}" stroke-width="1.5" fill="none" opacity=".6"/><circle cx="100" cy="193" r="18" fill="none" stroke="${ac}" stroke-width=".7" opacity=".46"/><path d="M100,177 L103,188 L114,188 L106,195 L109,206 L100,200 L91,206 L94,195 L86,188 L97,188 Z" fill="${ac}" opacity=".3"/><path d="M24,228 Q62,218 100,224 Q138,230 176,220 L176,245 L24,245 Z" fill="${bg}" opacity=".48"/></svg>`;
}
function kSVG(bg, ac, w=155) {
  const h = Math.round(w*1.5);
  return `<svg width="${w}" height="${h}" viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg"><path d="M68,36 L34,62 L16,140 L14,258 L100,265 L186,258 L184,140 L166,62 L132,36 Z" fill="${bg}"/><path d="M100,36 L88,76 L100,100 L112,76 Z" fill="${ac}" opacity=".8"/><path d="M100,36 L68,36 L34,62 L52,86 L88,76 Z" fill="${bg}" stroke="${ac}" stroke-width=".4" opacity=".62"/><path d="M100,36 L132,36 L166,62 L148,86 L112,76 Z" fill="${bg}" stroke="${ac}" stroke-width=".4" opacity=".62"/><path d="M14,140 L34,62 L-4,74 L-6,165 L14,172 Z" fill="${bg}" opacity=".76"/><path d="M186,140 L166,62 L204,74 L206,165 L186,172 Z" fill="${bg}" opacity=".76"/><rect x="32" y="150" width="136" height="32" fill="#2e3018" opacity=".82"/><ellipse cx="100" cy="166" rx="16" ry="11" fill="#4a4e28"/><path d="M14,245 Q57,234 100,240 Q143,246 186,236 L186,265 L14,265 Z" fill="${bg}" opacity=".5"/></svg>`;
}

function getVisual(p, w) {
  if (p.img) return `<img src="${p.img}" alt="${p.name}" loading="lazy"/>`;
  return p.type === 'haori' ? hSVG(p.bg, p.acc, w) : kSVG(p.bg, p.acc, w);
}

function mkCard(p) {
  const sold = isSold(p.id);
  const badge = sold
    ? `<div class="badge b-sold">Изчерпан</div>`
    : (p.lbl ? `<div class="badge ${p.lbl==='Винтидж'?'b-vtg':'b-new'}">${p.lbl}</div>` : '');
  return `<div class="pc" onclick="openM(${p.id})">
    <div class="pcv" style="background:${p.bg}">
      ${getVisual(p, 155)}
      ${badge}
      <div class="pco"><button class="pco-b">Бърз преглед</button></div>
    </div>
    <div class="pcbody">
      <p class="pc-cat">${p.cat}</p>
      <p class="pc-name">${p.name}</p>
      <p class="pc-sub">${p.sub}</p>
      <div class="pc-bot">
        <span class="pc-price">${p.price.toLocaleString('bg-BG')} €</span>
        <div style="display:flex;gap:4px">${p.colors.map(c=>`<div style="width:9px;height:9px;background:${c};border:1px solid rgba(228,216,192,.16)"></div>`).join('')}</div>
      </div>
    </div>
  </div>`;
}

/* GRID RENDER — работи на всяка страница според наличните елементи */
const HOME_LIMIT = 5;
function fillGrid(id, type, limit){
  const el = document.getElementById(id); if(!el) return;
  let list = PRODUCTS.filter(p=>p.type===type);
  if(limit) list = list.slice(0, limit);
  el.innerHTML = list.map(mkCard).join('');
}
function renderAllGrids(){
  fillGrid('haori-grid','haori',4);            // начална: 4 хаори
  fillGrid('kimono-grid','kimono',HOME_LIMIT); // начална: до 5 кимона
  fillGridPaged('haori-grid-all','haori-pager','haori',{sortId:'haori-sort',countId:'haori-count'});
  fillGridPaged('kimono-grid-all','kimono-pager','kimono',{sortId:'kimono-sort',countId:'kimono-count'});
}

/* PAGINATED GRID — 8 артикула на страница (страници ХАОРИ / КИМОНО) */
const PER_PAGE = 8;
function pageFromHash(){ const m = location.hash.match(/page=(\d+)/); return m ? Math.max(1, parseInt(m[1],10)) : 1; }
function setPageHash(n){ history.replaceState(null,'', n>1 ? '#page='+n : location.pathname + location.search); }

const SORTERS = {
  featured:    (a,b) => 0,
  'price-asc': (a,b) => a.price - b.price,
  'price-desc':(a,b) => b.price - a.price,
  'name-asc':  (a,b) => a.name.localeCompare(b.name, 'bg'),
  new:         (a,b) => (b.lbl==='Ново'?1:0) - (a.lbl==='Ново'?1:0),
};

function fillGridPaged(gridId, pagerId, type, opts={}){
  const grid = document.getElementById(gridId);
  const pager = document.getElementById(pagerId);
  if(!grid) return;
  const base = PRODUCTS.filter(p=>p.type===type);
  const sortEl = opts.sortId ? document.getElementById(opts.sortId) : null;
  const countEl = opts.countId ? document.getElementById(opts.countId) : null;
  let list = base.slice();
  let pages = 1;

  function applySort(){
    const key = (sortEl && SORTERS[sortEl.value]) ? sortEl.value : 'featured';
    list = base.slice().sort(SORTERS[key]);
    pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  }

  function render(page){
    page = Math.min(Math.max(1,page), pages);
    const start = (page-1)*PER_PAGE;
    grid.innerHTML = list.slice(start, start+PER_PAGE).map(mkCard).join('');
    if(countEl) countEl.textContent = list.length + (list.length===1 ? ' артикул' : ' артикула');
    setPageHash(page);
    drawPager(page);
  }

  function drawPager(page){
    if(!pager) return;
    if(pages <= 1){ pager.innerHTML=''; return; }
    const btn = (label, target, o={}) =>
      `<button ${o.disabled?'disabled':''} ${o.active?'class="active"':''} data-page="${target}">${label}</button>`;
    let html = btn('‹', page-1, {disabled: page===1});
    for(let i=1;i<=pages;i++){
      if(i===1 || i===pages || Math.abs(i-page)<=1){
        html += btn(i, i, {active:i===page});
      } else if(i===page-2 || i===page+2){
        html += `<span class="pager-gap">…</span>`;
      }
    }
    html += btn('›', page+1, {disabled: page===pages});
    pager.innerHTML = html;
    pager.querySelectorAll('button[data-page]').forEach(b=>{
      b.onclick = () => {
        render(parseInt(b.dataset.page,10));
        document.getElementById('collection-sec')?.scrollIntoView({behavior:'smooth',block:'start'});
      };
    });
  }

  if(sortEl){
    sortEl.onchange = () => { applySort(); render(1); };
  }
  applySort();
  render(pageFromHash());
}

/* PRODUCTS — заредени от Supabase (единствен източник) */
async function loadProducts(){
  const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&is_active=eq.true&order=sort_order`, {
    headers:{ 'apikey':SUPABASE_KEY, 'Authorization':`Bearer ${SUPABASE_KEY}` }
  });
  if(!res.ok) throw new Error('products fetch failed: '+res.status);
  const rows = await res.json();
  PRODUCTS = rows.map(r => ({
    id:r.id, type:r.type, lbl:r.lbl||'', cat:r.cat, name:r.name, sub:r.sub,
    price:Number(r.price)||0, colors:r.colors||[], desc:r.description||'',
    sizes:r.sizes||[], measure:r.measure||null, details:r.details||[],
    bg:r.bg||'#0c0608', acc:r.acc||'#c4a464', img:r.img||''
  }));
}
function renderProductsError(){
  ['haori-grid','kimono-grid','haori-grid-all','kimono-grid-all'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:4rem 1rem;color:rgba(228,216,192,.4);font-size:13px;letter-spacing:.04em">Продуктите не могат да се заредят в момента. Моля, опитайте отново по-късно.</p>';
  });
}

async function boot(){
  try {
    await loadProducts();
    await loadSoldIds().catch(()=>{}); // изчерпани — по желание; не блокира
    renderAllGrids();
    revalidateCart(); // сверявай количката с каталога след зареждане
  } catch(e){
    renderProductsError();
  }
}
boot();

/* MENU */
let menuOpen = false;
function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('burger').classList.toggle('open', menuOpen);
  document.getElementById('fmenu').classList.toggle('open', menuOpen);
  document.body.classList.toggle('no-scroll', menuOpen);
}
function goTo(id) {
  toggleMenu();
  setTimeout(() => { const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); }, 500);
}
function openCartFromMenu() { toggleMenu(); setTimeout(() => toggleCart(), 500); }

/* MODAL */
// Измервания: добави към продукта  measure:{back:58,length:95,sleeve:35}  (в см)
function measureBlock(p){
  if(!p.measure) return '';
  const m = p.measure, row = (lbl,v)=> v==null ? '' :
    `<div><dt>${lbl}</dt><dd>${v}<span>см</span></dd></div>`;
  const inner = row('Дължина на ръкава',m.sleeve)+row('Дължина',m.length)+row('Ширина на гърба с ръкави',m.back);
  return inner ? `<p class="m-lbl" style="margin-top:1.6rem">Мерки</p><dl class="m-measure">${inner}</dl>` : '';
}
// Скрий незапълнените плейсхолдъри ("— попълни" / "— fill" / празна стойност).
// Реда „Инструкции за грижа" става линк към страницата за грижа.
function detailsBlock(p){
  const isPlaceholder = d => {
    if(!d) return true;
    if(/—\s*(попълни|fill)\s*$/i.test(d)) return true; // незапълнена стойност
    return false;
  };
  const real = (p.details||[]).filter(d => !isPlaceholder(d));
  if(!real.length) return '';
  const render = d => /^\s*Инструкции за грижа/i.test(d)
    ? `<li><a href="care.html">Инструкции за грижа</a></li>`
    : `<li>${d}</li>`;
  return `<ul class="detl">${real.map(render).join('')}</ul>`;
}

function openM(id) {
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  selSz[id] = selSz[id] || p.sizes[0];
  selQty[id] = selQty[id] || 1;
  const vis = p.img
    ? `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;min-height:520px"/>`
    : `<div class="m-vis-svg" style="background:${p.bg}">${p.type==='haori'?hSVG(p.bg,p.acc,200):kSVG(p.bg,p.acc,200)}</div>`;
  document.getElementById('mvis').innerHTML = `<button class="mx" onclick="cMD()">×</button>${vis}`;
  document.getElementById('mbod').innerHTML = `
    <p class="m-cat">${p.cat}</p>
    <h2 class="m-name">${p.name}</h2>
    <p class="m-sub">${p.sub}</p>
    <p class="m-price">${p.price.toLocaleString('bg-BG')} €</p>
    <p class="m-desc">${p.desc}</p>
    <p class="m-lbl">Размер</p>
    <div class="szr">${p.sizes.map(s=>`<button class="sz ${selSz[id]===s?'sel':''}" onclick="setSz(${id},'${s}',this)">${s}</button>`).join('')}</div>
    <p class="m-unique">✦ Уникат — само 1 наличен брой</p>
    ${isSold(id)
      ? `<button class="abtn sold-out" disabled>ИЗЧЕРПАН</button>`
      : `<button class="abtn" onclick="addC(${id})">ДОБАВИ — ${p.price.toLocaleString('bg-BG')} €</button>
         <button class="bnow" onclick="buyNow(${id})">Купи сега</button>`}
    ${measureBlock(p)}
    ${detailsBlock(p)}`;
  document.getElementById('mw').classList.add('on');
  document.body.classList.add('no-scroll');
}
function setSz(id,s,btn){selSz[id]=s;btn.closest('.szr').querySelectorAll('.sz').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel')}
function chQ(id,d){selQty[id]=Math.max(1,(selQty[id]||1)+d);const e=document.getElementById(`qd${id}`);if(e)e.textContent=selQty[id]}
function cMW(e){if(e.target===document.getElementById('mw'))cMD()}
function cMD(){document.getElementById('mw').classList.remove('on');document.body.classList.remove('no-scroll')}

/* VOUCHER */
let voucherAmt = 50;
function openVoucher(){ if(menuOpen){ toggleMenu(); setTimeout(showVoucher,500); } else showVoucher(); }
function showVoucher(){ document.getElementById('vw').classList.add('on'); document.body.classList.add('no-scroll'); }
function closeVoucher(){ document.getElementById('vw').classList.remove('on'); document.body.classList.remove('no-scroll'); }
function cVW(e){ if(e.target===document.getElementById('vw')) closeVoucher(); }
function updVTotal(){ document.getElementById('v-total').textContent = (voucherAmt||0).toLocaleString('bg-BG')+' €'; }
function selVoucher(a,btn){ voucherAmt=a; document.getElementById('v-custom').value=''; document.querySelectorAll('.v-amt').forEach(b=>b.classList.remove('sel')); btn.classList.add('sel'); updVTotal(); }
function customVoucher(v){ const n=parseInt(v,10); if(n>0){ voucherAmt=n; document.querySelectorAll('.v-amt').forEach(b=>b.classList.remove('sel')); } updVTotal(); }
function addVoucher(){
  const a = voucherAmt||0;
  if(a < 10){ showToast('Минимална сума 10 €'); return; }
  const id = 'voucher-'+a;
  const ex = cart.find(c=>c.id===id);
  if(ex) ex.qty += 1;
  else cart.push({id, type:'voucher', name:'Подаръчен ваучер', sub:a.toLocaleString('bg-BG')+' €', qty:1, price:a, addedAt:Date.now()});
  saveCart(); upC(); closeVoucher(); showToast('Добавено — ваучер '+a+' €'); toggleCart();
}

/* CART */
function addC(id) {
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  if(isSold(id)){ showToast(`${p.name} е изчерпан`); cMD(); return; }
  const sz = selSz[id]||p.sizes[0];
  // Всеки артикул е уникат (1/1) — не може да се добави повече от веднъж.
  if(cart.find(c=>c.id===id)){ showToast(`${p.name} вече е в количката — уникат`); cMD(); return; }
  cart.push({id,name:p.name,sub:p.sub,sz,qty:1,price:p.price,bg:p.bg,acc:p.acc,type:p.type,img:p.img||'',addedAt:Date.now()});
  saveCart(); upC(); cMD(); showToast(`Добавено — ${p.name}`);
  return true;
}
function buyNow(id) {
  // Добавя (ако е валиден) и отива директно към плащане.
  const already = cart.find(c=>c.id===id);
  if (already || addC(id)) goCheckout();
}
function rmC(i){cart.splice(i,1);saveCart();upC()}
function saveCart(){localStorage.setItem('kinora_cart',JSON.stringify(cart))}

// Сверява количката спрямо текущия каталог: маха продадени/изтрити артикули и
// обновява цените. Изисква заредени PRODUCTS. Връща броя премахнати артикули.
function revalidateCart(){
  if(!PRODUCTS.length) return 0;
  const removed = [];
  cart = cart.filter(it => {
    if(it.type === 'voucher') return true;               // ваучерите винаги са валидни
    const p = PRODUCTS.find(x=>x.id===it.id);
    if(!p || isSold(it.id)){ removed.push(it.name); return false; } // изтрит или продаден
    if(typeof p.price === 'number') it.price = p.price;   // синхронизирай цената
    if(p.img!=null) it.img = p.img;                       // и снимката
    return true;
  });
  if(removed.length){
    saveCart();
    showToast(removed.length===1
      ? `${removed[0]} вече не е наличен и беше премахнат`
      : `${removed.length} артикула вече не са налични и бяха премахнати`);
  } else {
    saveCart(); // запази обновените цени
  }
  upC();
  return removed.length;
}
function upC(){
  const ct = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById('bct').textContent = ct;
  const cb = document.getElementById('cbod'), cf = document.getElementById('cft');
  if(!cart.length){cb.innerHTML='<p class="empty-cart">Количката ви е празна</p>';cf.style.display='none';return}
  cf.style.display='block';
  cb.innerHTML = cart.map((it,i) => {
    const thumb = it.type==='voucher'
      ? `<div class="ci-gift">🎁</div>`
      : (it.img ? `<img src="${it.img}" alt="${it.name}"/>` : (it.type==='haori'?hSVG(it.bg,it.acc,44):kSVG(it.bg,it.acc,44)));
    const meta = it.type==='voucher' ? `Дигитален · Бр: ${it.qty}` : `Размер: ${it.sz} · Уникат`;
    return `<div class="ci">
      <div class="ci-img" style="background:${it.bg||'var(--B)'}">${thumb}</div>
      <div><p class="ci-nm">${it.name}</p><p class="ci-mt">${meta}</p></div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
        <span class="ci-pr">${(it.price*it.qty).toLocaleString('bg-BG')} €</span>
        <button class="cirm" onclick="rmC(${i})">×</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('ctot').textContent = cart.reduce((s,i)=>s+i.price*i.qty,0).toLocaleString('bg-BG')+' €';
}
function toggleCart(){document.getElementById('cdrw').classList.toggle('on')}
function goCheckout(){
  localStorage.setItem('kinora_cart',JSON.stringify(cart));
  window.location.href='checkout.html';
}

let tT;
function showToast(msg){const t=document.getElementById('tst');t.textContent=msg;t.classList.add('on');clearTimeout(tT);tT=setTimeout(()=>t.classList.remove('on'),2800)}
function ss(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth'})}

/* CURSOR */
const CUR=document.getElementById('CUR'),CUR2=document.getElementById('CUR2');
document.addEventListener('mousemove',e=>{
  CUR.style.left=e.clientX+'px';CUR.style.top=e.clientY+'px';
  setTimeout(()=>{CUR2.style.left=e.clientX+'px';CUR2.style.top=e.clientY+'px'},55);
});
document.addEventListener('mousedown',()=>{CUR.style.transform='translate(-50%,-50%) scale(2)';CUR2.style.transform='translate(-50%,-50%) scale(.5)'});
document.addEventListener('mouseup',()=>{CUR.style.transform='translate(-50%,-50%)';CUR2.style.transform='translate(-50%,-50%)'});
document.querySelectorAll('button,a').forEach(el=>{
  el.addEventListener('mouseenter',()=>{CUR.classList.add('big');CUR2.classList.add('big')});
  el.addEventListener('mouseleave',()=>{CUR.classList.remove('big');CUR2.classList.remove('big')});
});

upC();
