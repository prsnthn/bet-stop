// List of SA betting operators with their contact details
const BETTING_OPERATORS = [
    { name: '10bet', email: 'support@10bet.co.za' },
    { name: 'EasyBet', email: 'help@easybet.co.za' },
    { name: 'Betway', email: 'Responsiblegambling@betway.co.za' },
    { name: 'Sportingbet', email: 'support@sportingbet.co.za' },
    { name: 'Hollywoodbets', email: 'selfexclusion@hollywoodbets.net' },
    { name: 'World Sport Betting', email: 'support@wsb.co.za' },
    { name: 'SupaBets', email: 'support@supabets.co.za' },
    { name: 'Bet.co.za', email: 'support@bet.co.za' },
    { name: 'ScoreBet', email: 'support@scorebet.co.za' },
    { name: 'YesPlay', email: 'support@yesplay.bet' },
    { name: 'Jackpot City', email: 'responsiblegambling@jackpotcity.co.za' }
];

// Populate operators grid on page load
document.addEventListener('DOMContentLoaded', () => {
    const operatorsGrid = document.getElementById('operatorsGrid');
    
    BETTING_OPERATORS.forEach(operator => {
        const operatorDiv = document.createElement('div');
        operatorDiv.className = 'operator-checkbox';
        operatorDiv.innerHTML = `
            <input type="checkbox" id="${operator.name}" name="operators" value="${operator.name}">
            <label for="${operator.name}">${operator.name}</label>
        `;
        operatorsGrid.appendChild(operatorDiv);
    });
});

// Generate email content
function generateEmailContent(formData, operators) {
    const date = new Date().toISOString().split('T')[0];
    const exclusionText = formData.exclusionPeriod === 'permanent' 
        ? 'I wish to be excluded permanently.' 
        : `I wish to be excluded for a period of ${formData.exclusionPeriod} months.`;

    return `Dear Sir/Madam,

I hereby request to be excluded from your betting platform.

Personal Details:
- Full Name: ${formData.fullName}
- ID Number: ${formData.idNumber}
- Email: ${formData.email}
- Phone: ${formData.phone}

${exclusionText}

Please confirm receipt of this request and its implementation.

Kind regards,
${formData.fullName}

Date: ${date}`;
}

// Handle form submission
document.getElementById('exclusionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        idNumber: document.getElementById('idNumber').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        exclusionPeriod: document.getElementById('exclusionPeriod').value
    };
    
    // Get selected operators
    const selectedOperators = Array.from(document.querySelectorAll('input[name="operators"]:checked'))
        .map(checkbox => BETTING_OPERATORS.find(op => op.name === checkbox.value));
    
    if (selectedOperators.length === 0) {
        alert('Please select at least one betting operator');
        return;
    }
    
    // Generate email link with BCC
    const emailLinksContainer = document.getElementById('emailLinksContainer');
    emailLinksContainer.innerHTML = '';
    
    const bccEmails = selectedOperators.map(op => op.email).join(',');
    const emailContent = generateEmailContent(formData, selectedOperators);
    
    const emailLink = document.createElement('a');
    emailLink.href = `mailto:?bcc=${encodeURIComponent(bccEmails)}&subject=Self-Exclusion Request - ${encodeURIComponent(formData.fullName)}&body=${encodeURIComponent(emailContent)}`;
    emailLink.className = 'email-link';
    emailLink.innerHTML = `Click here to send self-exclusion email to ${selectedOperators.length} operator${selectedOperators.length > 1 ? 's' : ''} <span style="float: right;">→</span>`;
    emailLinksContainer.appendChild(emailLink);
    
    // Show email links section
    document.getElementById('emailLinks').classList.remove('hidden');
    
    // Scroll to email links
    document.getElementById('emailLinks').scrollIntoView({ behavior: 'smooth' });
});

// Geolocation check for South African visitors
async function checkCountryAccess() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // If not in South Africa, show warning
        if (data.country_code !== 'ZA') {
            // Only show warning if middleware didn't already block
            const warningBanner = document.createElement('div');
            warningBanner.className = 'country-warning';
            warningBanner.innerHTML = `
                <div class="warning-content">
                    <p><strong>Notice:</strong> This service is designed for South African users. Some features may not work correctly in your region (${data.country_name}).</p>
                    <button id="close-warning">Understand</button>
                </div>
            `;
            document.body.prepend(warningBanner);
            
            // Add event listener to close button
            document.getElementById('close-warning').addEventListener('click', function() {
                warningBanner.style.display = 'none';
            });
            
            // Track non-SA visitors in analytics
            if (typeof gtag === 'function') {
                gtag('event', 'non_sa_visitor', {
                    'event_category': 'geo',
                    'event_label': data.country_code
                });
            }
        }
    } catch (error) {
        console.error('Error checking location:', error);
    }
}

// Run the check when the page loads
window.addEventListener('DOMContentLoaded', checkCountryAccess); 