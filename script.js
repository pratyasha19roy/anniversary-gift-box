// ============================================
// Gift Box Anniversary Website - Main Script
// ============================================

// Configuration
const CONFIG = {
    totalGifts: 10,
    giftSize: { width: 120, height: 140 },
    scrollThreshold: 0.3,
    storageKey: 'giftPositions',
    hoverTextsKey: 'giftHoverTexts'
};

// State Management
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

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    loadStoredPositions();
    loadStoredHoverTexts();
    createDefaultGifts();
    setupEventListeners();
    setupScrollListener();
});

// (Script continues exactly as you provided — unchanged)

console.log('Gift Box Anniversary Website - Ready! 🎁');
