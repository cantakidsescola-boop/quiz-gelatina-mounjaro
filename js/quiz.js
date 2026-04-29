
let currentStep = 0;
let userName = 'você';
let currentWeight = 75;
let targetWeight = 60;
let currentHeight = 165;
const TOTAL_STEPS = 25;

const steps = [
  'splash','idade','corpo','areas','famosas','nome','impacto','aparencia',
  'barreiras','objetivos','mecanismo','peso-atual','altura','peso-desejado',
  'gestacoes','rotina','sono','agua','analise','como-usar','sonhos','confirmacao',
  'historias','loading','resultado'
];

function updateProgress(stepIdx) {
  const pct = Math.round((stepIdx / TOTAL_STEPS) * 100);
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-pct').textContent = pct + '%';
  document.getElementById('progress-label').textContent = `Etapa ${stepIdx + 1} de ${TOTAL_STEPS}`;
}

function calcularIMC() {
  const peso = Number(document.getElementById('input-peso-atual')?.value || currentWeight);
  const altCm = Number(document.getElementById('input-altura')?.value || currentHeight);
  if (!peso || !altCm) return;
  const altM = altCm / 100;
  const imc = (peso / (altM * altM)).toFixed(1);
  const displayEl = document.getElementById('imc-display');
  const statusEl = document.getElementById('imc-status');
  if (displayEl) displayEl.textContent = imc;
  if (statusEl) {
    let status = '';
    if (imc < 18.5) status = 'Seu IMC: Abaixo do Peso';
    else if (imc < 25) status = 'Seu IMC: Peso Normal';
    else if (imc < 30) status = 'Seu IMC: Sobrepeso';
    else status = 'Seu IMC: Obesidade';
    statusEl.textContent = status;
  }
}

function showStep(idx) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.loading-screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('step-' + steps[idx]);
  if (target) {
    target.classList.add('active');
    updateProgress(idx);
    window.scrollTo(0, 0);
    if (steps[idx] === 'analise') calcularIMC();
  }
  currentStep = idx;
}

function goNext() {
  if (currentStep < steps.length - 1) showStep(currentStep + 1);
}

// Single choice
document.querySelectorAll('.option-item').forEach(item => {
  item.addEventListener('click', function() {
    const group = this.closest('.options-list');
    group.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
    this.classList.add('selected');
    setTimeout(() => goNext(), 300);
  });
});

// Body type grid
document.querySelectorAll('.option-card').forEach(card => {
  card.addEventListener('click', function() {
    const group = this.closest('.options-grid');
    group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    this.classList.add('selected');
    setTimeout(() => goNext(), 300);
  });
});

// Multi-checkbox (list)
document.querySelectorAll('.check-item').forEach(item => {
  item.addEventListener('click', function() {
    this.classList.toggle('selected');
    const box = this.querySelector('.check-box');
    if (this.classList.contains('selected')) box.innerHTML = '✓';
    else box.innerHTML = '';
    const group = this.closest('.check-list, .check-grid');
    const hasSelected = group.querySelector('.selected');
    const btn = group.closest('.screen').querySelector('.btn-primary');
    if (btn) btn.disabled = !hasSelected;
  });
});

// Goals grid
document.querySelectorAll('.goals-card').forEach(card => {
  card.addEventListener('click', function() {
    this.classList.toggle('selected');
    const check = this.querySelector('.g-check');
    if (this.classList.contains('selected')) check.innerHTML = '✓';
    else check.innerHTML = '';
    const group = this.closest('.options-grid');
    const hasSelected = group.querySelector('.selected');
    const btn = group.closest('.screen').querySelector('.btn-primary');
    if (btn) btn.disabled = !hasSelected;
  });
});

// Grid checkboxes (areas)
document.querySelectorAll('.check-grid-item').forEach(item => {
  item.addEventListener('click', function() {
    this.classList.toggle('selected');
    const box = this.querySelector('.cg-box');
    if (this.classList.contains('selected')) box.innerHTML = '✓';
    else box.innerHTML = '';
    const group = this.closest('.check-grid');
    const hasSelected = group.querySelector('.selected');
    const btn = group.closest('.screen').querySelector('.btn-primary');
    if (btn) btn.disabled = !hasSelected;
  });
});

// Name input
const nameInput = document.getElementById('name-input');
const nameBtn = document.getElementById('name-btn');
if (nameInput) {
  nameInput.addEventListener('input', function() {
    nameBtn.disabled = this.value.trim().length < 2;
  });
  nameBtn.addEventListener('click', function() {
    userName = nameInput.value.trim() || 'você';
    document.querySelectorAll('.user-name').forEach(el => el.textContent = userName);
    goNext();
  });
}

// ─── NUMBER PICKERS ───────────────────────────────────────────
const pickerConfig = {
  'peso-atual':    { val: 75,  min: 45,  max: 150, displayId: 'val-peso-atual' },
  'altura':        { val: 165, min: 140, max: 200, displayId: 'val-altura' },
  'peso-desejado': { val: 60,  min: 40,  max: 149, displayId: 'val-peso-desejado' },
};

function changePicker(key, delta) {
  const cfg = pickerConfig[key];
  cfg.val = Math.min(cfg.max, Math.max(cfg.min, cfg.val + delta));
  document.getElementById(cfg.displayId).textContent = cfg.val;

  if (key === 'peso-atual')    currentWeight = cfg.val;
  if (key === 'altura')        currentHeight = cfg.val;
  if (key === 'peso-desejado') {
    targetWeight = cfg.val;
    updateGoalTag();
  }
  // also keep peso-desejado max = currentWeight - 1
  if (key === 'peso-atual') {
    pickerConfig['peso-desejado'].max = cfg.val - 1;
    updateGoalTag();
  }
}

function updateGoalTag() {
  const diff = currentWeight - targetWeight;
  const tag = document.getElementById('goal-tag');
  if (tag) {
    if (diff > 0) tag.textContent = `Meta: perder ${diff} kg 🎯`;
    else tag.textContent = 'Meta: manter o peso 🎯';
  }
}

// Loading animation
function runLoading(callback) {
  const items = document.querySelectorAll('#step-loading .loading-item');
  items.forEach(i => i.classList.remove('done'));
  let i = 0;
  function tick() {
    if (i < items.length) {
      items[i].classList.add('done');
      i++;
      setTimeout(tick, 700);
    } else {
      setTimeout(callback, 500);
    }
  }
  tick();
}

// CTA buttons (generic)
document.querySelectorAll('[data-next]').forEach(btn => {
  btn.addEventListener('click', function() {
    const target = this.dataset.next;
    if (target === 'loading') {
      showStep(steps.indexOf('loading'));
      runLoading(() => showStep(steps.indexOf('resultado')));
    } else {
      const idx = steps.indexOf(target);
      if (idx >= 0) showStep(idx);
      else goNext();
    }
  });
});

// Init
showStep(0);
