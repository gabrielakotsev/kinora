const PRODUCTS = [
  {id:1,type:'haori',lbl:'',cat:'Хаори яке',name:'ТЕРНА',sub:'Хаори',price:85,colors:['#0c0608','#2e3018','#4a0c1a'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],measure:{back:58,length:95,sleeve:35},details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#7c8240',img:''},
  {id:2,type:'haori',lbl:'',cat:'Хаори яке',name:'ГЕОНА',sub:'Хаори',price:110,colors:['#2e3018','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#1e2010',acc:'#e4d8c0',img:''},
  {id:3,type:'haori',lbl:'',cat:'Хаори яке',name:'КАРЕ',sub:'Хаори',price:99,colors:['#2e3018','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#c4a464',img:''},

  /* ====================================================================
     ХАОРИ — ПОЗИЦИИ ЗА ПОПЪЛВАНЕ (05–36)
     За всяка позиция смени: name, price, desc, details и по желание colors/bg/acc.
     Когато имаш снимка — сложи пътя в img:'assets/haori-05.jpg' (тогава SVG-то се скрива).
     lbl: '' = без етикет | 'Ново' | 'Винтидж'
     ==================================================================== */
  {id:9,type:'haori',lbl:'',cat:'Хаори яке',name:'МРАК',sub:'Хаори',price:135,colors:['#0c0608','#2e3018','#4a0c1a'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#c4a464',img:''},
  {id:10,type:'haori',lbl:'',cat:'Хаори яке',name:'СИГИЛ',sub:'Хаори',price:130,colors:['#3a0814','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#3a0814',acc:'#e4d8c0',img:''},
  {id:11,type:'haori',lbl:'',cat:'Хаори яке',name:'ШЕПОТ',sub:'Хаори',price:120,colors:['#2e3018','#1e2010','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#1e2010',acc:'#7c8240',img:''},
  {id:12,type:'haori',lbl:'',cat:'Хаори яке',name:'ПРАСКОВА',sub:'Хаори',price:99,colors:['#2e0810','#4a0c1a','#140a04'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e0810',acc:'#c4a464',img:''},
  {id:13,type:'haori',lbl:'',cat:'Хаори яке',name:'ПРИЛИВ',sub:'Хаори',price:90,colors:['#0a1020','#2e3018','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0a1020',acc:'#e4d8c0',img:''},
  {id:14,type:'haori',lbl:'',cat:'Хаори яке',name:'ОБСИДИАН',sub:'Хаори',price:150,colors:['#140a04','#2e0810','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#140a04',acc:'#c4a464',img:''},
  {id:15,type:'haori',lbl:'',cat:'Хаори яке',name:'КАДАНС',sub:'Хаори',price:99,colors:['#2e3018','#4a4e28','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e3018',acc:'#e4d8c0',img:''},
  {id:16,type:'haori',lbl:'',cat:'Хаори яке',name:'МОЗАЙКА',sub:'Хаори',price:120,colors:['#4a0c1a','#3a0814','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#4a0c1a',acc:'#dfc090',img:''},
  {id:17,type:'haori',lbl:'',cat:'Хаори яке',name:'БУРЯ',sub:'Хаори',price:130,colors:['#0c0608','#2e3018','#4a0c1a'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#c4a464',img:''},
  {id:18,type:'haori',lbl:'',cat:'Хаори яке',name:'МАРГАРИТКА',sub:'Хаори',price:95,colors:['#3a0814','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#3a0814',acc:'#e4d8c0',img:''},
  {id:19,type:'haori',lbl:'',cat:'Хаори яке',name:'КАКИ',sub:'Хаори',price:140,colors:['#2e3018','#1e2010','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#1e2010',acc:'#7c8240',img:''},
  {id:20,type:'haori',lbl:'',cat:'Хаори яке',name:'СЯНКА',sub:'Хаори',price:110,colors:['#2e0810','#4a0c1a','#140a04'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e0810',acc:'#c4a464',img:''},
  {id:21,type:'haori',lbl:'',cat:'Хаори яке',name:'ТИШИНА',sub:'Хаори',price:110,colors:['#0a1020','#2e3018','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0a1020',acc:'#e4d8c0',img:''},
  {id:22,type:'haori',lbl:'',cat:'Хаори яке',name:'НОЩ',sub:'Хаори',price:110,colors:['#140a04','#2e0810','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#140a04',acc:'#c4a464',img:''},
  {id:23,type:'haori',lbl:'',cat:'Хаори яке',name:'ПЛАМ',sub:'Хаори',price:140,colors:['#2e3018','#4a4e28','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e3018',acc:'#e4d8c0',img:''},
  {id:24,type:'haori',lbl:'',cat:'Хаори яке',name:'ВОАЛ',sub:'Хаори',price:115,colors:['#4a0c1a','#3a0814','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#4a0c1a',acc:'#dfc090',img:''},
  {id:25,type:'haori',lbl:'',cat:'Хаори яке',name:'МЪЛНИЯ',sub:'Хаори',price:90,colors:['#0c0608','#2e3018','#4a0c1a'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#c4a464',img:''},
  {id:26,type:'haori',lbl:'',cat:'Хаори яке',name:'ФЕНИКС',sub:'Хаори',price:90,colors:['#3a0814','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#3a0814',acc:'#e4d8c0',img:''},
  {id:27,type:'haori',lbl:'',cat:'Хаори яке',name:'ПОЛЕ',sub:'Хаори',price:140,colors:['#2e3018','#1e2010','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#1e2010',acc:'#7c8240',img:''},
  {id:28,type:'haori',lbl:'',cat:'Хаори яке',name:'ПРОЛЕТ',sub:'Хаори',price:120,colors:['#2e0810','#4a0c1a','#140a04'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e0810',acc:'#c4a464',img:''},
  {id:29,type:'haori',lbl:'',cat:'Хаори яке',name:'ТЕРА',sub:'Хаори',price:110,colors:['#0a1020','#2e3018','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0a1020',acc:'#e4d8c0',img:''},
  {id:30,type:'haori',lbl:'',cat:'Хаори яке',name:'ФЛАШ',sub:'Хаори',price:130,colors:['#140a04','#2e0810','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#140a04',acc:'#c4a464',img:''},
  {id:31,type:'haori',lbl:'',cat:'Хаори яке',name:'ПРЪСКИ',sub:'Хаори',price:99,colors:['#2e3018','#4a4e28','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e3018',acc:'#e4d8c0',img:''},
  {id:32,type:'haori',lbl:'',cat:'Хаори яке',name:'БАЛАНС',sub:'Хаори',price:125,colors:['#4a0c1a','#3a0814','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#4a0c1a',acc:'#dfc090',img:''},
  {id:33,type:'haori',lbl:'',cat:'Хаори яке',name:'БЪРГЪНДИ',sub:'Хаори',price:110,colors:['#0c0608','#2e3018','#4a0c1a'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0c0608',acc:'#c4a464',img:''},
  {id:34,type:'haori',lbl:'',cat:'Хаори яке',name:'АРТ',sub:'Хаори',price:80,colors:['#3a0814','#4a0c1a','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#3a0814',acc:'#e4d8c0',img:''},
  {id:35,type:'haori',lbl:'',cat:'Хаори яке',name:'РЕЯ',sub:'Хаори',price:99,colors:['#2e3018','#1e2010','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#1e2010',acc:'#7c8240',img:''},
  {id:36,type:'haori',lbl:'',cat:'Хаори яке',name:'РУЖА',sub:'Хаори',price:140,colors:['#2e0810','#4a0c1a','#140a04'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e0810',acc:'#c4a464',img:''},
  {id:37,type:'haori',lbl:'',cat:'Хаори яке',name:'БОДРА',sub:'Хаори',price:115,colors:['#0a1020','#2e3018','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#0a1020',acc:'#e4d8c0',img:''},
  {id:38,type:'haori',lbl:'',cat:'Хаори яке',name:'ЗЕМРА',sub:'Хаори',price:125,colors:['#140a04','#2e0810','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#140a04',acc:'#c4a464',img:''},
  {id:39,type:'haori',lbl:'',cat:'Хаори яке',name:'ТЪМИРА',sub:'Хаори',price:130,colors:['#2e3018','#4a4e28','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#2e3018',acc:'#e4d8c0',img:''},
  {id:40,type:'haori',lbl:'',cat:'Хаори яке',name:'МАГРА',sub:'Хаори',price:110,colors:['#4a0c1a','#3a0814','#0c0608'],desc:'Описанието за това хаори ще бъде добавено скоро.',sizes:['Универсален (XS–XL)'],details:['Материал — попълни','Подплата — попълни','Произход — попълни','Инструкции за грижа — попълни'],bg:'#4a0c1a',acc:'#dfc090',img:''},
  {id:5,type:'kimono',lbl:'Ново',cat:'Официално кимоно',name:'ПУРПУРНА ХРИЗАНТЕМА',sub:'Фурисоде',price:1280,colors:['#4a0c1a','#2e3018','#0c0608'],desc:'Шедьовър на Ниши-джин брокат — с ръчно бродирани хризантемени клъстери върху дълбоко бордо основа.',sizes:['XS','S','M','L','XL'],details:['100% Ниши-джин копринен брокат','Ръчно бродирани детайли','Придружен с подходящ оби','Сертификат за произход','Само химическо чистене'],bg:'#3a0814',acc:'#e4d8c0',img:''},
  {id:6,type:'kimono',lbl:'',cat:'Ежедневно кимоно',name:'ВЪЛНА ИНДИГО',sub:'Комон',price:740,colors:['#0c1428','#4a0c1a','#2e3018'],desc:'Боядисано с натурално индиго по 400-годишния метод „катазоме". Повтарящият се вълнов мотив е традиционен „seigaiha".',sizes:['XS','S','M','L','XL','XXL'],details:['100% Хаката коприна','Естествено индиго','Техника катазоме','Ръчно пране при студено'],bg:'#0a1020',acc:'#e4d8c0',img:''},
  {id:7,type:'kimono',lbl:'Ново',cat:'Ново пристигане',name:'САКУРА ЗДРАЧ',sub:'Томесоде',price:1640,colors:['#5c1222','#2e3018','#0c0608'],desc:'Новото произведение на семейство Мори — официален томесоде с ръчно бродирани черешови цветове. Само 12 парчета в света.',sizes:['XS','S','M','L'],details:['Лимитирано — 12 парчета в света','Ръчно бродирани черешови цветя','5 фамилни герба'],bg:'#2e0810',acc:'#e4d8c0',img:''},
  {id:8,type:'kimono',lbl:'Винтидж',cat:'Винтидж кимоно',name:'ПЕОНИЯ ОТ МЕЙДЖИ',sub:'Учикаке',price:2400,colors:['#2e3018','#4a0c1a','#0c0608'],desc:'Автентично церемониално учикаке от периода Мейджи, около 1895 г. Бродерия от злато с пиони и феникси.',sizes:['Един размер'],details:['Автентично от периода Мейджи (ок.1895)','Бродерия от злато и сребро','Сертификат за автентичност'],bg:'#140a04',acc:'#c4a464',img:''},
];

let cart = JSON.parse(localStorage.getItem('kinora_cart') || '[]');
let selSz = {}, selQty = {};

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
  return `<div class="pc" onclick="openM(${p.id})">
    <div class="pcv" style="background:${p.bg}">
      ${getVisual(p, 155)}
      ${p.lbl ? `<div class="badge ${p.lbl==='Винтидж'?'b-vtg':'b-new'}">${p.lbl}</div>` : ''}
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
fillGrid('haori-grid','haori',4);            // начална: 4 хаори
fillGrid('kimono-grid','kimono',HOME_LIMIT); // начална: до 5 кимона

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
fillGridPaged('haori-grid-all','haori-pager','haori',{sortId:'haori-sort',countId:'haori-count'});
fillGridPaged('kimono-grid-all','kimono-pager','kimono',{sortId:'kimono-sort',countId:'kimono-count'});

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
  const inner = row('Гръб',m.back)+row('Дължина',m.length)+row('Ръкав',m.sleeve);
  return inner ? `<p class="m-lbl" style="margin-top:1.6rem">Мерки</p><dl class="m-measure">${inner}</dl>` : '';
}
// Скрий списъка с детайли, докато все още са незапълнени плейсхолдъри ("— попълни").
function detailsBlock(p){
  const real = (p.details||[]).filter(d => d && !/попълни/i.test(d));
  if(!real.length) return '';
  return `<ul class="detl">${real.map(d=>`<li>${d}</li>`).join('')}</ul>`;
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
    <button class="abtn" onclick="addC(${id})">ДОБАВИ — ${p.price.toLocaleString('bg-BG')} €</button>
    <button class="wbtn">Запази в любими</button>
    <button class="wbtn tryon-btn" onclick="tryOnSoon()">Виртуална проба <span class="soon">скоро</span></button>
    ${measureBlock(p)}
    ${detailsBlock(p)}`;
  document.getElementById('mw').classList.add('on');
  document.body.classList.add('no-scroll');
}
function setSz(id,s,btn){selSz[id]=s;btn.closest('.szr').querySelectorAll('.sz').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel')}
function chQ(id,d){selQty[id]=Math.max(1,(selQty[id]||1)+d);const e=document.getElementById(`qd${id}`);if(e)e.textContent=selQty[id]}
function cMW(e){if(e.target===document.getElementById('mw'))cMD()}
function cMD(){document.getElementById('mw').classList.remove('on');document.body.classList.remove('no-scroll')}
function tryOnSoon(){showToast('Виртуалната проба идва скоро ✦')}

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
  else cart.push({id, type:'voucher', name:'Подаръчен ваучер', sub:a.toLocaleString('bg-BG')+' €', qty:1, price:a});
  saveCart(); upC(); closeVoucher(); showToast('Добавено — ваучер '+a+' €'); toggleCart();
}

/* CART */
function addC(id) {
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const sz = selSz[id]||p.sizes[0];
  // Всеки артикул е уникат (1/1) — не може да се добави повече от веднъж.
  if(cart.find(c=>c.id===id)){ showToast(`${p.name} вече е в количката — уникат`); cMD(); return; }
  cart.push({id,name:p.name,sub:p.sub,sz,qty:1,price:p.price,bg:p.bg,acc:p.acc,type:p.type,img:p.img||''});
  saveCart(); upC(); cMD(); showToast(`Добавено — ${p.name}`);
}
function rmC(i){cart.splice(i,1);saveCart();upC()}
function saveCart(){localStorage.setItem('kinora_cart',JSON.stringify(cart))}
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
