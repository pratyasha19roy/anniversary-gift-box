// ============================================
// Gift Box Anniversary Website - Main Script
// ============================================

// Configuration
const CONFIG = {
    totalGifts: 10,
    giftSize: { width: 120, height: 140 },
    storageKey: 'giftPositions',
    hoverTextsKey: 'giftHoverTexts'
};

// State
const state = {
    giftsContainer: null,
    giftBox: null,
    boxLid: null,
    messageCard: null,
    tooltip: null,
    fileInput: null,
    uploadBtn: null,
    giftImages: [],
    giftPositions: {},
    hoverTexts: {},
    scrollProgress: 0,
    lidOpen: true,
    originalPositions: {},
    editingGiftId: null
};

// Init on load
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadStoredPositions();
    loadStoredHoverTexts();
    createDefaultGifts();
    setupEventListeners();
    setupScrollListener();
    console.log('Gift Box Anniversary Website - Ready! 🎁');
});

// ---------- Initialization ----------
function initializeElements() {
    state.giftsContainer = document.getElementById('giftsContainer');
    state.giftBox = document.getElementById('giftBox');
    state.boxLid = document.getElementById('boxLid');
    state.messageCard = document.getElementById('messageCard');
    state.tooltip = document.getElementById('tooltip');
    state.fileInput = document.getElementById('fileInput');
    state.uploadBtn = document.getElementById('uploadBtn');
}

// ---------- Storage ----------
function loadStoredPositions() {
    const stored = localStorage.getItem(CONFIG.storageKey);
    if (stored) state.giftPositions = JSON.parse(stored);
}

function loadStoredHoverTexts() {
    const stored = localStorage.getItem(CONFIG.hoverTextsKey);
    if (stored) state.hoverTexts = JSON.parse(stored);
}

function savePositions() {
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.giftPositions));
}

function saveHoverTexts() {
    localStorage.setItem(CONFIG.hoverTextsKey, JSON.stringify(state.hoverTexts));
}

// ---------- Gifts ----------
function createDefaultGifts() {
    for (let i = 0; i < CONFIG.totalGifts; i++) {
        const id = `gift-${i}`;
        if (!state.giftPositions[id]) {
            state.giftPositions[id] = randomPos();
        }
        state.originalPositions[id] = state.giftPositions[id];
        createGiftElement(id, i);
    }
    savePositions();
}

function randomPos() {
    const maxX = window.innerWidth - CONFIG.giftSize.width - 40;

    // only use the upper part of the screen so gifts start above the box
    const upperAreaHeight = window.innerHeight * 0.5;

    return {
        x: Math.random() * maxX,
        y: Math.random() * upperAreaHeight + 40, // scattered near the top
        rotation: Math.random() * 10 - 5
    };
}

function createGiftElement(id, index) {
    const pos = state.giftPositions[id];

    const div = document.createElement('div');
    div.className = 'gift-image';
    div.id = id;
    div.style.left = pos.x + 'px';
    div.style.top = pos.y + 'px';
    div.style.transform = `rotate(${pos.rotation}deg)`;

    const img = document.createElement('img');
    img.src = placeholderImage(index);
    div.appendChild(img);

    const label = document.createElement('div');
    label.className = 'gift-label';
    label.textContent = 'Double click to edit';
    div.appendChild(label);

    state.giftsContainer.appendChild(div);
    state.giftImages.push({ element: div, id });

    div.addEventListener('mouseenter', e => showTooltip(e, state.hoverTexts[id] || 'Double click to edit'));
    div.addEventListener('mousemove', e => moveTooltip(e));
    div.addEventListener('mouseleave', hideTooltip);
    div.addEventListener('dblclick', () => openModal(id));
}

function placeholderImage(i) {
    const colors = ['#ff6b9d','#ff1493','#ff85c0','#ffb6c1','#ffc0cb'];
    const c = colors[i % colors.length];
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='140'><rect width='100%' height='100%' fill='${c}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='white' font-size='14'>Gift</text></svg>`;
}

// ---------- Upload ----------
function setupEventListeners() {
    state.uploadBtn.addEventListener('click', () => state.fileInput.click());
    state.fileInput.addEventListener('change', handleUpload);

    document.getElementById('saveHoverText').addEventListener('click', saveHoverText);
    document.getElementById('cancelEdit').addEventListener('click', closeModal);
}

function handleUpload(e) {
    const files = Array.from(e.target.files);

    files.slice(0, CONFIG.totalGifts).forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = ev => {
            const img = document.querySelector(`#gift-${i} img`);
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });

    state.fileInput.value = '';
}

// ---------- Scroll animation ----------
function setupScrollListener() {
    window.addEventListener('scroll', handleScroll);
}

function handleScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    state.scrollProgress = Math.min(window.scrollY / max, 1);

    moveGifts();
    toggleLid();
    toggleCard();
}

function moveGifts() {
    const boxRect = state.giftBox.getBoundingClientRect();

    // center of the visible gift box on screen
    const targetX = boxRect.left + boxRect.width / 2 - CONFIG.giftSize.width / 2;
    const targetY = boxRect.top + boxRect.height / 2 - CONFIG.giftSize.height / 2;

    state.giftImages.forEach(({ element, id }) => {
        const start = state.originalPositions[id];

        const dx = (targetX - start.x) * state.scrollProgress;
        const dy = (targetY - start.y) * state.scrollProgress;

        element.style.transform =
            `translate(${dx}px, ${dy}px) rotate(${start.rotation * (1 - state.scrollProgress)}deg)`;

        // fade slightly as they go into the box
        element.style.opacity = 1 - state.scrollProgress * 0.8;
    });
}

function toggleLid() {
    if(state.scrollProgress>0.7){
        state.boxLid.classList.add('closed');
        state.boxLid.classList.remove('open');
    } else {
        state.boxLid.classList.add('open');
        state.boxLid.classList.remove('closed');
    }
}

function toggleCard() {
    if(state.scrollProgress>0.8) state.messageCard.classList.add('visible');
    else state.messageCard.classList.remove('visible');
}

// ---------- Tooltip ----------
function showTooltip(e,text){
    state.tooltip.textContent=text;
    state.tooltip.classList.add('visible');
    moveTooltip(e);
}
function moveTooltip(e){
    state.tooltip.style.left=(e.clientX+10)+'px';
    state.tooltip.style.top=(e.clientY+10)+'px';
}
function hideTooltip(){
    state.tooltip.classList.remove('visible');
}

// ---------- Modal ----------
function openModal(id){
    state.editingGiftId=id;
    document.getElementById('editModal').classList.add('visible');
    document.getElementById('hoverTextInput').value = state.hoverTexts[id]||'';
}

function closeModal(){
    document.getElementById('editModal').classList.remove('visible');
}

function saveHoverText(){
    const text=document.getElementById('hoverTextInput').value.trim();
    if(text){
        state.hoverTexts[state.editingGiftId]=text;
        saveHoverTexts();
    }
    closeModal();
}

