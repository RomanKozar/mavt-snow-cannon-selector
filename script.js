// ══════════════════════════════════════
//  Snow canvas
// ══════════════════════════════════════
;(function () {
	const c = document.getElementById('snow-canvas')
	const ctx = c.getContext('2d')
	let W,
		H,
		flakes = []

	function resize() {
		W = c.width = window.innerWidth
		H = c.height = window.innerHeight
	}

	resize()
	window.addEventListener('resize', resize)

	for (let i = 0; i < 130; i++)
		flakes.push({
			x: Math.random() * 2000,
			y: Math.random() * 2000,
			r: Math.random() * 2.5 + 0.5,
			sp: Math.random() * 0.6 + 0.2,
			sw: Math.random() * 0.3 - 0.15,
		})
	;(function loop() {
		ctx.clearRect(0, 0, W, H)
		ctx.fillStyle = 'rgba(200,230,255,0.7)'
		flakes.forEach(f => {
			ctx.beginPath()
			ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
			ctx.fill()
			f.y += f.sp
			f.x += f.sw
			if (f.y > H) {
				f.y = -5
				f.x = Math.random() * W
			}
			if (f.x > W) f.x = 0
			if (f.x < 0) f.x = W
		})
		requestAnimationFrame(loop)
	})()
})()

// ══════════════════════════════════════
//  State
// ══════════════════════════════════════
let alternatives = [
	{ name: 'TechnoAlpin SnowFactory SF9', vals: [1400, 18, 55, 62, 320, 4.2] },
	{ name: 'SMI SuperPolarStar', vals: [1200, 22, 48, 71, 280, 3.8] },
	{ name: 'Demaclenko Expert 7.0', vals: [1550, 16, 60, 58, 350, 4.7] },
	{ name: 'HKD SnowMaker S6E', vals: [1100, 25, 42, 80, 250, 3.5] },
	{ name: 'Bächler Xeno T40', vals: [1680, 14, 65, 55, 380, 5.1] },
]

let criteria = [
	{
		name: 'Продуктивність (м³/год)',
		min: 0,
		max: 2000,
		type: 'max',
		vfType: 'linear',
	},
	{
		name: 'Споживання енергії (кВт)',
		min: 10,
		max: 30,
		type: 'min',
		vfType: 'linear',
	},
	{ name: 'Дальність (м)', min: 20, max: 80, type: 'max', vfType: 'linear' },
	{ name: 'Рівень шуму (дБ)', min: 50, max: 90, type: 'min', vfType: 'linear' },
	{ name: 'Ціна (тис. €)', min: 200, max: 500, type: 'min', vfType: 'linear' },
	{ name: 'Охоплення (га/год)', min: 2, max: 7, type: 'max', vfType: 'linear' },
]

let weights = [0.25, 0.15, 0.2, 0.1, 0.15, 0.15]

// ══════════════════════════════════════
//  Navigation
// ══════════════════════════════════════
function goStep(i) {
	document
		.querySelectorAll('.tab-content')
		.forEach((t, j) => t.classList.toggle('active', j === i))
	document
		.querySelectorAll('.step')
		.forEach((s, j) => s.classList.toggle('active', j === i))
	if (i === 1) renderCriteria()
	if (i === 2) renderWeights()
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ══════════════════════════════════════
//  STEP 0 — Alternatives
// ══════════════════════════════════════
function renderAlternatives() {
	const cont = document.getElementById('alt-cards')
	cont.innerHTML = ''
	alternatives.forEach((alt, ai) => {
		const card = document.createElement('div')
		card.className = 'alt-card'
		let rows = criteria
			.map(
				(c, ci) => `
      <div>
        <label>${c.name}</label>
        <input type="number" value="${alt.vals[ci] ?? ''}" oninput="alternatives[${ai}].vals[${ci}]=+this.value">
      </div>`,
			)
			.join('')
		card.innerHTML = `
      <h3>❄ Гармата ${ai + 1}</h3>
      <div style="margin-bottom:8px">
        <label>Назва</label>
        <input type="text" value="${alt.name}" oninput="alternatives[${ai}].name=this.value">
      </div>
      ${rows}
      <button class="btn btn-ghost" style="padding:5px 12px;font-size:.7rem;margin-top:6px"
        onclick="alternatives.splice(${ai},1);renderAlternatives()">✕ Видалити</button>`
		cont.appendChild(card)
	})
}

function addAlternative() {
	alternatives.push({
		name: `Нова гармата ${alternatives.length + 1}`,
		vals: criteria.map(() => 0),
	})
	renderAlternatives()
}

function resetAlternatives() {
	alternatives = [
		{ name: 'TechnoAlpin SnowFactory SF9', vals: [1400, 18, 55, 62, 320, 4.2] },
		{ name: 'SMI SuperPolarStar', vals: [1200, 22, 48, 71, 280, 3.8] },
		{ name: 'Demaclenko Expert 7.0', vals: [1550, 16, 60, 58, 350, 4.7] },
		{ name: 'HKD SnowMaker S6E', vals: [1100, 25, 42, 80, 250, 3.5] },
		{ name: 'Bächler Xeno T40', vals: [1680, 14, 65, 55, 380, 5.1] },
	]
	renderAlternatives()
}

// ══════════════════════════════════════
//  STEP 1 — Criteria
// ══════════════════════════════════════
function renderCriteria() {
	const cont = document.getElementById('crit-list')
	cont.innerHTML = ''
	criteria.forEach((c, ci) => {
		const div = document.createElement('div')
		div.style.cssText =
			'background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:12px;'
		div.innerHTML = `
      <div class="grid-2" style="gap:10px">
        <div>
          <label>Назва критерію</label>
          <input type="text" value="${c.name}" oninput="criteria[${ci}].name=this.value;renderAlternatives()">
        </div>
        <div style="display:flex;gap:8px;align-items:flex-end">
          <div style="flex:1">
            <label>Min</label>
            <input type="number" value="${c.min}" oninput="criteria[${ci}].min=+this.value">
          </div>
          <div style="flex:1">
            <label>Max</label>
            <input type="number" value="${c.max}" oninput="criteria[${ci}].max=+this.value">
          </div>
        </div>
      </div>
      <div style="margin-top:8px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <span style="font-size:.78rem;color:var(--text-dim)">Напрям:</span>
        <label style="display:flex;gap:4px;align-items:center;cursor:pointer;color:var(--text)">
          <input type="radio" name="dir${ci}" value="max" ${c.type === 'max' ? 'checked' : ''} onchange="criteria[${ci}].type='max'"> Максимізація
        </label>
        <label style="display:flex;gap:4px;align-items:center;cursor:pointer;color:var(--text)">
          <input type="radio" name="dir${ci}" value="min" ${c.type === 'min' ? 'checked' : ''} onchange="criteria[${ci}].type='min'"> Мінімізація
        </label>
        <button class="btn btn-ghost" style="padding:4px 12px;font-size:.7rem;margin-left:auto" onclick="criteria.splice(${ci},1);renderCriteria()">✕</button>
      </div>`
		cont.appendChild(div)
	})
}

function addCriterion() {
	criteria.push({
		name: `Критерій ${criteria.length + 1}`,
		min: 0,
		max: 100,
		type: 'max',
		vfType: 'linear',
	})
	alternatives.forEach(a => a.vals.push(0))
	renderCriteria()
}

function resetCriteria() {
	criteria = [
		{
			name: 'Продуктивність (м³/год)',
			min: 0,
			max: 2000,
			type: 'max',
			vfType: 'linear',
		},
		{
			name: 'Споживання енергії (кВт)',
			min: 10,
			max: 30,
			type: 'min',
			vfType: 'linear',
		},
		{ name: 'Дальність (м)', min: 20, max: 80, type: 'max', vfType: 'linear' },
		{
			name: 'Рівень шуму (дБ)',
			min: 50,
			max: 90,
			type: 'min',
			vfType: 'linear',
		},
		{
			name: 'Ціна (тис. €)',
			min: 200,
			max: 500,
			type: 'min',
			vfType: 'linear',
		},
		{
			name: 'Охоплення (га/год)',
			min: 2,
			max: 7,
			type: 'max',
			vfType: 'linear',
		},
	]
	weights = [0.25, 0.15, 0.2, 0.1, 0.15, 0.15]
	renderCriteria()
}

// ══════════════════════════════════════
//  STEP 2 — Weights
// ══════════════════════════════════════
function renderWeights() {
	const cont = document.getElementById('weight-list')
	cont.innerHTML = ''
	criteria.forEach((c, ci) => {
		const w = weights[ci] ?? 1 / criteria.length
		const div = document.createElement('div')
		div.className = 'slider-group'
		div.innerHTML = `
      <label>${c.name}<span id="wlabel-${ci}">${(w * 100).toFixed(1)}%</span></label>
      <input type="range" min="0" max="100" step="1" value="${(w * 100).toFixed(0)}" id="wslider-${ci}">`
		cont.appendChild(div)

		const slider = div.querySelector('input')
		slider.addEventListener('input', function () {
			weights[ci] = +this.value / 100
			document.getElementById(`wlabel-${ci}`).textContent =
				(+this.value).toFixed(1) + '%'
			updateWeightSum()
		})
	})
	updateWeightSum()
}

function updateWeightSum() {
	const s = weights.slice(0, criteria.length).reduce((a, b) => a + b, 0)
	const el = document.getElementById('weight-sum')
	el.textContent = s.toFixed(3)
	el.style.color = Math.abs(s - 1) < 0.001 ? 'var(--accent3)' : 'var(--accent)'
}

// ══════════════════════════════════════
//  MAVT Core
// ══════════════════════════════════════
function valueFunction(x, crit) {
	const { min, max, type } = crit
	if (max === min) return 0
	let v = (x - min) / (max - min)
	v = Math.max(0, Math.min(1, v))
	return type === 'min' ? 1 - v : v
}

function computeMAVT() {
	const wSum = weights.slice(0, criteria.length).reduce((a, b) => a + b, 0) || 1
	const w = criteria.map((_, ci) => (weights[ci] ?? 0) / wSum)

	const results = alternatives.map(alt => {
		const partials = criteria.map((c, ci) =>
			valueFunction(alt.vals[ci] ?? 0, c),
		)
		const score = partials.reduce((acc, v, ci) => acc + w[ci] * v, 0)
		return { name: alt.name, partials, score }
	})

	results.sort((a, b) => b.score - a.score)
	renderResults(results, w)
	goStep(3)
}

function renderResults(results, w) {
	const best = results[0]
	document.getElementById('result-winner').innerHTML = `
    <div class="winner-box">
      <div class="winner-icon">🏆</div>
      <div>
        <h2>Оптимальний вибір: ${best.name}</h2>
        <p>Агрегований показник MAVT: <strong style="color:var(--accent3)">${(best.score * 100).toFixed(2)}%</strong>
           &nbsp;|&nbsp; Ранг #1 з ${results.length} альтернатив</p>
      </div>
    </div>`

	const head = document.getElementById('result-head')
	head.innerHTML =
		'<th>АЛЬТЕРНАТИВА</th>' +
		criteria.map(c => `<th>${c.name}</th>`).join('') +
		'<th>MAVT SCORE</th><th>РАНГ</th>'

	const body = document.getElementById('result-body')
	body.innerHTML = results
		.map(
			(r, i) => `
    <tr class="${i === 0 ? 'rank-1' : ''}">
      <td style="text-align:left;font-weight:600">${r.name}</td>
      ${r.partials.map(v => `<td>${(v * 100).toFixed(1)}%</td>`).join('')}
      <td style="font-weight:700;color:var(--accent)">${(r.score * 100).toFixed(2)}%</td>
      <td>#${i + 1}</td>
    </tr>`,
		)
		.join('')

	const barCont = document.getElementById('bar-chart')
	barCont.innerHTML = results
		.map(
			r => `
    <div class="bar-row">
      <div class="bar-label">${r.name.length > 18 ? r.name.slice(0, 16) + '…' : r.name}</div>
      <div class="bar-outer">
        <div class="bar-inner" style="width:${(r.score * 100).toFixed(1)}%">
          ${r.score > 0.12 ? (r.score * 100).toFixed(1) + '%' : ''}
        </div>
      </div>
      <div class="bar-score">${(r.score * 100).toFixed(2)}%</div>
    </div>`,
		)
		.join('')

	const sCont = document.getElementById('sens-cards')
	sCont.innerHTML = criteria
		.map(
			(c, ci) => `
    <div class="sens-card">
      <strong>${c.name}</strong>
      <span style="color:var(--text-dim);font-size:.72rem">Вага: ${(w[ci] * 100).toFixed(1)}% &nbsp;|&nbsp; ${c.type === 'max' ? '↑ Max' : '↓ Min'}</span>
      <div style="margin-top:8px">
        ${results
					.map(
						r => `
          <div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.04)">
            <span style="font-size:.78rem;color:var(--text)">${r.name.length > 18 ? r.name.slice(0, 16) + '…' : r.name}</span>
            <span style="color:var(--accent);font-size:.78rem">${(r.partials[ci] * 100).toFixed(1)}%</span>
          </div>`,
					)
					.join('')}
      </div>
    </div>`,
		)
		.join('')
}

// Init
renderAlternatives()
