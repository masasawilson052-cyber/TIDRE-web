// Basic SPA Navigation Logic
function switchView(viewId) {
    if (window.event) window.event.preventDefault();
    window.location.hash = viewId;
}

function handleHashChange() {
    const viewId = window.location.hash.substring(1) || 'view-landing';
    
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show the selected view
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.classList.add('active');
    }
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);

// --- AI Assistant Interactivity ---
function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();
    if (!messageText) return;

    const chatHistory = document.getElementById('chat-history');

    // 1. Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `
        <div class="chat-bubble">
            <p>${messageText}</p>
        </div>
        <div class="chat-avatar"><i class="fa-solid fa-user"></i></div>
    `;
    chatHistory.appendChild(userMsg);
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // 2. Mock Bot Reply after a delay
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-message bot';
        botMsg.innerHTML = `
            <div class="chat-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="chat-bubble">
                <p>Thank you for your question. I am analyzing your request regarding "${messageText}". As this is a prototype, I am unable to provide live tax advice, but you can explore the other sections of the dashboard.</p>
            </div>
        `;
        chatHistory.appendChild(botMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1000);
}

// Listen for Enter key in chat input
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // --- Verify e-Invoice Interactivity ---
    const resultCard = document.querySelector('.result-card');
    const scannerFrame = document.querySelector('.scanner-frame');
    
    // Initially hide result card
    if (resultCard) {
        resultCard.style.display = 'none';
    }

    // Click on scanner to simulate a successful scan
    if (scannerFrame) {
        scannerFrame.style.cursor = 'pointer';
        scannerFrame.addEventListener('click', () => {
            // Flash effect
            scannerFrame.style.backgroundColor = 'var(--tidre-green-light)';
            setTimeout(() => {
                scannerFrame.style.backgroundColor = 'white';
                if (resultCard) {
                    resultCard.style.display = 'block';
                }
            }, 500);
        });
    }
});
const en2sw = {
    'Home': 'Mwanzo',
    'Dashboard': 'Dashibodi',
    'Overview': 'Muhtasari',
    'Returns': 'Marejesho',
    'Payments': 'Malipo',
    'e-Invoices': 'Ankara kielektroniki',
    'Certificates': 'Vyeti',
    'Messages (AI)': 'Ujumbe (AI)',
    'Profile': 'Wasifu',
    'Reports': 'Ripoti',
    'Settings': 'Mipangilio',
    'Help & Support': 'Msaada',
    'Need help?': 'Unahitaji msaada?',
    'Need Help?': 'Unahitaji msaada?',
    'Contact Support': 'Wasiliana Nasi',
    'Get Started': 'Anza Sasa',
    'Taxpayer Dashboard': 'Dashibodi ya Mlipakodi',
    'Total Outstanding Balance': 'Salio Linalodaiwa',
    'Pay Now': 'Lipa Sasa',
    'Recent Transactions': 'Miamala Hivi Karibuni',
    'Payment Received - March VAT': 'Malipo - VAT Machi',
    'Payment Received - Income Tax Installment': 'Malipo - Kodi ya Mapato',
    'Tax Returns': 'Marejesho ya Kodi',
    'File New Return': 'Wasilisha Rejesho',
    'Filing History': 'Historia',
    'All': 'Yote',
    'Pending': 'Inasubiri',
    'Drafts': 'Rasimu',
    'Tax Type': 'Aina ya Kodi',
    'Period': 'Kipindi',
    'Status': 'Hali',
    'Date Filed': 'Tarehe',
    'Action': 'Kitendo',
    'Pending Payment': 'Inasubiri Malipo',
    'Filed': 'Imewasilishwa',
    'Value Added Tax (VAT)': 'VAT',
    'Corporate Income Tax': 'Kodi ya Kampuni',
    'View': 'Tazama',
    'My Certificates': 'Vyeti Vyangu',
    'TIN Certificate': 'Cheti cha TIN',
    'Taxpayer Identification Number Certificate': 'Namba ya Mlipakodi',
    'Active': 'Inafanya Kazi',
    'Download': 'Pakua',
    'Tax Clearance Certificate': 'Cheti cha Kibali',
    'Valid until 31 Dec 2026': 'Halali hadi 31 Des 2026',
    'Valid': 'Halali',
    'User Profile': 'Wasifu wa Mtumiaji',
    'Save Changes': 'Hifadhi',
    'Business Owner': 'Mmiliki',
    'Full Name': 'Jina Kamili',
    'Email Address': 'Barua Pepe',
    'Phone Number': 'Namba ya Simu',
    'Business Name': 'Jina la Biashara',
    'Financial Reports': 'Ripoti za Kifedha',
    'Export PDF': 'Toa PDF',
    'Monthly Revenue Bar Chart': 'Chati ya Mapato',
    'Tax Distribution Pie Chart': 'Chati ya Kodi',
    'Platform Settings': 'Mipangilio',
    'Preferences': 'Mapendeleo',
    'Language': 'Lugha',
    'Select your preferred language': 'Chagua lugha yako',
    'Email Notifications': 'Taarifa za Barua Pepe',
    'Receive updates about your taxes': 'Pata sasisho',
    'Two-Factor Authentication': 'Ulinzi wa Ziada',
    'Add an extra layer of security': 'Ongeza usalama',
    'Enable': 'Wezesha',
    'Call Center': 'Kituo cha Simu',
    'Available Monday to Friday, 8am to 5pm.': '8 asubuhi hadi 11 jioni.',
    'Email Support': 'Msaada wa Barua Pepe',
    "Send us an email and we'll reply within 24 hours.": 'Tutumie barua pepe.',
    'Verify e-Invoice': 'Hakiki Ankara',
    'Scan QR Code': 'Skani QR',
    'Position the QR code within the frame to scan': 'Weka QR ndani ya fremu',
    'Upload Image': 'Pakia Picha',
    'Verification Result': 'Matokeo',
    'Valid Invoice': 'Ankara Halali',
    'TIDRE AI Assistant': 'Msaidizi wa AI',
    'Recent topics': 'Mada',
    'When is my VAT return due?': 'Marejesho ya VAT ni lini?',
    'Just now': 'Sasa hivi',
    'How do I verify an invoice?': 'Nitahakikije ankara?',
    '2 days ago': 'Siku 2 zilizopita',
    'Speak to an Officer': 'Ongea na Afisa',
    '1 week ago': 'Wiki 1 iliyopita',
    'Quick links': 'Viungo haraka',
    'Services': 'Huduma',
    'Help Center': 'Msaada',
    'Smarter Tax Services for Tanzania': 'Kodi Kidijitali Tanzania',
    'Secure. Simple. Intelligent.': 'Salama. Rahisi. Akili.',
    'Taxpayer Services': 'Huduma Mlipakodi',
    'About': 'Kuhusu',
    'Type your question here...': 'Andika swali lako hapa...'
};

const sw2en = {};
for (const key in en2sw) { sw2en[en2sw[key]] = key; }

function changeLanguage(lang) {
    const dict = (lang === 'sw') ? en2sw : sw2en;
    
    function walkText(node) {
        if (node.nodeType === 3) {
            let text = node.nodeValue;
            let trimmed = text.trim();
            if (trimmed && dict[trimmed]) {
                node.nodeValue = text.replace(trimmed, dict[trimmed]);
            }
        } else if (node.nodeType === 1 && node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE') {
            for (let i = 0; i < node.childNodes.length; i++) {
                walkText(node.childNodes[i]);
            }
        }
    }
    
    walkText(document.body);
    
    document.querySelectorAll('input').forEach(input => {
        if (input.placeholder && dict[input.placeholder]) {
            input.placeholder = dict[input.placeholder];
        }
    });
}
function askAiQuestion(text) {
    const input = document.getElementById('chat-input');
    if (input) {
        input.value = text;
        sendMessage();
    }
}
