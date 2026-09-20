const KEY = 'tea-break-records-v1';
const $ = (id) => document.getElementById(id);
const today = new Date();
const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const state = { records: JSON.parse(localStorage.getItem(KEY) || '[]'), filter: 'all' };
const flavors = {
  '喜茶': ['多肉葡萄', '芝芝莓莓', '芝芝芒芒', '多肉桃桃', '多肉桃李', '满杯红柚', '多肉葡萄冻', '轻芝多肉青提', '多肉芒芒甘露', '满杯芒芒', '满杯桃桃', '满杯橙橙', '满杯红柚', '超级杯四季春', '青提冰茶', '莓莓冰茶', '橙香四季春', '葡萄柚绿妍', '清爽铁观音', '纯绿妍茶', '绿妍冷泡茶', '茉莉绿茶', '烤黑糖波波牛乳', '黑糖波波牛乳', '黑糖珍珠奶茶', '茉莉奶绿', '芝芝抹茶', '芝芝莓莓蛋糕', '芝芝芒芒蛋糕', '多肉葡萄蛋糕', '抹茶波波冰', '喜茶冰淇淋', '黑糖波波冰', '芋泥波波牛乳', '草莓奶冻', '蜜桃乌龙茶', '鸭屎香柠檬茶', '喜茶气泡水', '喜茶纯茶', '芝芝金凤茶王', '芝芝玉露'],
  '霸王茶姬': ['伯牙绝弦', '桂馥兰香', '花田乌龙', '春日桃桃', '橙香桂花乌龙', '青青糯山', '万里木兰'],
  '奈雪的茶': ['霸气玉油柑', '霸气橙子', '多肉葡萄', '茉莉初雪', '霸气芝士草莓', '宝藏茶', '鸭屎香宝藏茶'],
  '茶百道': ['杨枝甘露', '超级杯水果茶', '豆乳玉麒麟', '芋泥紫米', '茉莉奶绿', '西瓜啵啵', '草莓奶冻'],
  '古茗': ['超A芝士葡萄', '云岭茉莉白', '杨枝甘露', '青提香茉', '芝芝莓莓', '超A山茶花', '芋泥奶茶'],
  '沪上阿姨': ['血糯米奶茶', '杨枝甘露', '桃桃西打', '莓莓酸奶', '芋泥波波奶茶', '桂花酒酿', '草莓熊'],
  '一点点': ['波霸奶茶', '四季奶青', '阿华田奶茶', '柠檬养乐多', '冰淇淋红茶', '乌龙奶茶', '葡萄柚绿'],
  '蜜雪冰城': ['珍珠奶茶', '柠檬水', '蜜桃四季春', '草莓摇摇奶昔', '冰鲜柠檬水', '芝芝莓莓', '茉莉奶绿'],
  '瑞幸咖啡': ['生椰拿铁', '厚乳拿铁', '椰云拿铁', '冰吸生椰拿铁', '丝绒拿铁', '橙C美式', '陨石拿铁'],
  '星巴克': ['拿铁', '焦糖玛奇朵', '抹茶星冰乐', '摩卡', '美式咖啡', '冷萃咖啡', '馥芮白']
};
const generalFlavors = ['珍珠奶茶', '奶茶', '果茶', '奶绿', '杨枝甘露', '柠檬茶'];
const flavorGroups = {
  '喜茶': [
    { label: '多肉果茶', items: ['多肉葡萄', '芝芝莓莓', '芝芝芒芒', '多肉桃桃', '多肉桃李', '满杯红柚', '多肉葡萄冻', '轻芝多肉青提', '多肉芒芒甘露', '满杯芒芒', '满杯桃桃', '满杯橙橙'] },
    { label: '清爽茶饮', items: ['超级杯四季春', '青提冰茶', '莓莓冰茶', '橙香四季春', '葡萄柚绿妍', '清爽铁观音', '纯绿妍茶', '绿妍冷泡茶', '茉莉绿茶', '蜜桃乌龙茶', '鸭屎香柠檬茶'] },
    { label: '奶茶与芝芝', items: ['烤黑糖波波牛乳', '黑糖波波牛乳', '黑糖珍珠奶茶', '茉莉奶绿', '芝芝抹茶', '芝芝金凤茶王', '芝芝玉露', '芋泥波波牛乳'] },
    { label: '甜品与特别款', items: ['芝芝莓莓蛋糕', '芝芝芒芒蛋糕', '多肉葡萄蛋糕', '抹茶波波冰', '喜茶冰淇淋', '黑糖波波冰', '草莓奶冻', '喜茶气泡水', '喜茶纯茶'] }
  ]
};
const dailyQuotes = [
  '今天也要好好生活，顺便等一个想和你一起喝奶茶的人。',
  '奶茶要加珍珠，你要不要也给我一点偏爱？',
  '今天的甜度刚刚好，像你看过来的那一眼。',
  '先记下这一杯，至于下一杯，留给有缘的人陪你喝。',
  '生活有点苦没关系，靠近你就会甜一点。',
  '听说认真记录奶茶的人，值得被认真喜欢。',
  '今天适合喝奶茶，也适合偷偷想一个人。'
];

const formatDate = (value) => new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(`${value}T00:00:00`));
const isThisMonth = (value) => value.slice(0, 7) === isoToday.slice(0, 7);
const formatMoney = (value) => `¥${Number(value).toFixed(2).replace(/\.?(0+)$/, '')}`;
const dayNumber = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
document.getElementById('dailyQuote').textContent = dailyQuotes[dayNumber % dailyQuotes.length];
function render() {
  const visible = state.records.filter((record) => state.filter === 'all' || isThisMonth(record.date)).sort((a,b) => b.date.localeCompare(a.date) || b.created - a.created);
  const month = state.records.filter((record) => isThisMonth(record.date));
  $('monthCount').textContent = month.length;
  const monthCents = month.reduce((sum, item) => sum + Math.round(Number(item.price) * 100), 0);
  $('monthSpend').textContent = formatMoney(monthCents / 100);
  $('drinkList').innerHTML = visible.map((item) => `<article class="drink-card"><div><h3>${escapeHtml(item.brand)}</h3><div class="flavor">${escapeHtml(item.flavor)}</div></div><div class="price">${formatMoney(item.price)}</div><div class="meta">${formatDate(item.date)} · ${item.sweetness} · ${item.ice}</div>${item.note ? `<p class="note">“${escapeHtml(item.note)}”</p>` : ''}<button class="delete-button" data-delete="${item.id}" type="button">删除</button></article>`).join('');
  $('emptyState').classList.toggle('hidden', visible.length > 0);
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char])); }
document.querySelectorAll('.choice-group').forEach((group) => group.addEventListener('click', (event) => { if (event.target.tagName !== 'BUTTON') return; group.querySelectorAll('button').forEach((button) => button.classList.remove('selected')); event.target.classList.add('selected'); }));
function flavorOptions(brand) { const groups = flavorGroups[brand]; if (groups) return `<option value="">请选择口味</option>${groups.map((group) => `<optgroup label="${group.label}">${group.items.map((item) => `<option>${item}</option>`).join('')}</optgroup>`).join('')}<option value="other">其他</option>`; const options = flavors[brand] || (brand === 'other' ? generalFlavors : []); return options.length ? `<option value="">请选择口味</option>${options.map((item) => `<option>${item}</option>`).join('')}<option value="other">其他</option>` : '<option value="">先选择品牌</option>'; }
 $('brand').addEventListener('change', (event) => { const isOtherBrand = event.target.value === 'other'; const hasOptions = Boolean(flavors[event.target.value] || flavorGroups[event.target.value] || isOtherBrand); $('customBrandLabel').classList.toggle('hidden', !isOtherBrand); $('customBrand').required = isOtherBrand; $('flavor').innerHTML = flavorOptions(event.target.value); $('flavor').disabled = !hasOptions; $('customFlavorLabel').classList.add('hidden'); $('customFlavor').required = false; });
$('flavor').addEventListener('change', (event) => { const isOther = event.target.value === 'other'; $('customFlavorLabel').classList.toggle('hidden', !isOther); $('customFlavor').required = isOther; if (isOther) $('customFlavor').focus(); });
 $('drinkForm').addEventListener('submit', (event) => { event.preventDefault(); const selected = (field) => document.querySelector(`[data-field="${field}"] .selected`).dataset.value; const brand = $('brand').value === 'other' ? $('customBrand').value.trim() : $('brand').value.trim(); const flavor = $('flavor').value === 'other' ? $('customFlavor').value.trim() : $('flavor').value.trim(); state.records.push({ id: crypto.randomUUID(), created: Date.now(), brand, flavor, price: $('price').value, date: $('drinkDate').value, sweetness: selected('sweetness'), ice: selected('ice'), note: $('note').value.trim() }); localStorage.setItem(KEY, JSON.stringify(state.records)); event.target.reset(); $('flavor').innerHTML = '<option value="">先选择品牌</option>'; $('flavor').disabled = true; $('customBrandLabel').classList.add('hidden'); $('customBrand').required = false; $('customFlavorLabel').classList.add('hidden'); $('customFlavor').required = false; $('drinkDate').value = isoToday; render(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); });
$('drinkList').addEventListener('click', (event) => { const id = event.target.dataset.delete; if (!id) return; state.records = state.records.filter((record) => record.id !== id); localStorage.setItem(KEY, JSON.stringify(state.records)); render(); });
$('filter').addEventListener('change', (event) => { state.filter = event.target.value; render(); });
$('todayLabel').textContent = formatDate(isoToday); $('drinkDate').value = isoToday; render();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('sw.js'));
