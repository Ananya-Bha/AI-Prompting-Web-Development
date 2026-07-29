// Results Page JavaScript

// Average student user baseline (in kg CO₂ per day)
const AVERAGE_STUDENT_DAILY = 0.35; // kg CO₂/day (based on typical student usage)

// Real-world equivalents
const SMARTPHONE_CHARGE_CO2 = 0.006; // kg CO₂ per charge
const CAR_KM_CO2 = 0.12; // kg CO₂ per km (petrol car)
const TREE_MONTHLY_CO2 = 20; // kg CO₂ absorbed per tree per month

document.addEventListener('DOMContentLoaded', function() {
    // Get results from sessionStorage
    const resultsData = sessionStorage.getItem('calculatorResults');
    const formData = sessionStorage.getItem('formData');
    
    if (!resultsData || !formData) {
        // No data found, redirect to calculator
        window.location.href = 'calculator.html';
        return;
    }
    
    const results = JSON.parse(resultsData);
    const inputs = JSON.parse(formData);
    
    // Display all results
    displayTotalSummary(results);
    createBreakdownChart(results);
    displayComparison(results);
    displayPersonalizedTips(results, inputs);
});

// Display total summary (daily, weekly, yearly)
function displayTotalSummary(results) {
    const dailyKg = results.totalKg;
    const weeklyKg = dailyKg * 7;
    const yearlyKg = dailyKg * 365;
    
    document.getElementById('total-daily-kg').textContent = dailyKg.toFixed(2);
    document.getElementById('total-weekly-kg').textContent = weeklyKg.toFixed(2) + ' kg CO₂';
    document.getElementById('total-yearly-kg').textContent = yearlyKg.toFixed(2) + ' kg CO₂';
}

// Create breakdown chart (pie chart style matching home page)
function createBreakdownChart(results) {
    const svg = document.getElementById('breakdown-chart');
    const legend = document.getElementById('breakdown-legend');
    
    if (!svg || !legend) return;
    
    // Chart data
    const data = [
        { label: 'Streaming', value: results.streaming.value, color: '#3b82f6', icon: '📺' },
        { label: 'Gaming', value: results.gaming.value, color: '#8b5cf6', icon: '🎮' },
        { label: 'Emails', value: results.email.value, color: '#06b6d4', icon: '📧' },
        { label: 'Cloud Storage', value: results.cloud.value, color: '#ec4899', icon: '☁️' },
        { label: 'Data Transfer', value: results.transfer.value, color: '#f59e0b', icon: '⬇️' }
    ];
    
    // Filter out zero values and sort by value (descending)
    const activeData = data.filter(item => item.value > 0);
    activeData.sort((a, b) => b.value - a.value);
    
    const total = results.totalGrams;
    if (total === 0) {
        svg.innerHTML = '<text x="200" y="200" text-anchor="middle" dominant-baseline="middle" fill="#cbd5e1" font-size="18">No emissions calculated</text>';
        return;
    }
    
    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    
    let currentAngle = -Math.PI / 2; // Start at top
    
    // Clear previous content
    svg.innerHTML = '<defs><filter id="shadow-results"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/></filter></defs>';
    legend.innerHTML = '';
    
    // Draw pie chart segments
    activeData.forEach((item, index) => {
        const percentage = (item.value / total) * 100;
        const angle = (item.value / total) * 2 * Math.PI;
        
        // Calculate arc path
        const x1 = centerX + radius * Math.cos(currentAngle);
        const y1 = centerY + radius * Math.sin(currentAngle);
        const x2 = centerX + radius * Math.cos(currentAngle + angle);
        const y2 = centerY + radius * Math.sin(currentAngle + angle);
        
        const largeArc = angle > Math.PI ? 1 : 0;
        
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', item.color);
        path.setAttribute('stroke', '#ffffff');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('class', 'pie-slice');
        path.setAttribute('filter', 'url(#shadow-results)');
        path.style.cursor = 'pointer';
        
        // Add data attributes for tooltip
        path.setAttribute('data-category', item.label);
        path.setAttribute('data-value', item.value.toFixed(0));
        path.setAttribute('data-percentage', percentage.toFixed(1));
        
        // Add hover effect
        path.addEventListener('mouseenter', function() {
            this.setAttribute('opacity', '0.9');
            this.setAttribute('stroke-width', '3');
        });
        path.addEventListener('mouseleave', function() {
            this.setAttribute('opacity', '1');
            this.setAttribute('stroke-width', '2');
        });
        
        svg.appendChild(path);
        
        // Create legend item (matching home page style)
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item-pie';
        legendItem.setAttribute('data-category', item.label);
        legendItem.innerHTML = `
            <div class="legend-color-pie" style="background: ${item.color};"></div>
            <div class="legend-text-pie">
                <span class="legend-name">${item.label}</span>
                <span class="legend-value">${item.value.toFixed(0)} g (${percentage.toFixed(1)}%)</span>
            </div>
        `;
        legend.appendChild(legendItem);
        
        currentAngle += angle;
    });
    
    // Add center text
    const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerText.setAttribute('x', centerX);
    centerText.setAttribute('y', centerY - 5);
    centerText.setAttribute('text-anchor', 'middle');
    centerText.setAttribute('dominant-baseline', 'middle');
    centerText.setAttribute('fill', '#64d9ff');
    centerText.setAttribute('font-size', '28');
    centerText.setAttribute('font-weight', '700');
    centerText.setAttribute('class', 'pie-center-text');
    centerText.textContent = (total / 1000).toFixed(2) + ' kg';
    svg.appendChild(centerText);
    
    const centerSubtext = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    centerSubtext.setAttribute('x', centerX);
    centerSubtext.setAttribute('y', centerY + 20);
    centerSubtext.setAttribute('text-anchor', 'middle');
    centerSubtext.setAttribute('dominant-baseline', 'middle');
    centerSubtext.setAttribute('fill', '#cbd5e1');
    centerSubtext.setAttribute('font-size', '14');
    centerSubtext.setAttribute('class', 'pie-center-text');
    centerSubtext.textContent = 'Total Daily CO₂';
    svg.appendChild(centerSubtext);
}

// Display comparison with average student user
function displayComparison(results) {
    const dailyKg = results.totalKg;
    const averageKg = AVERAGE_STUDENT_DAILY;
    const difference = dailyKg - averageKg;
    const differencePercent = ((difference / averageKg) * 100).toFixed(0);
    
    const comparisonText = document.getElementById('comparison-text');
    const equivalents = document.getElementById('comparison-equivalents');
    
    // Comparison text
    let comparisonMessage = '';
    if (difference > 0) {
        comparisonMessage = `Your digital footprint is <strong>${Math.abs(differencePercent)}% higher</strong> than the average student user.`;
    } else if (difference < 0) {
        comparisonMessage = `Your footprint is <strong>${Math.abs(differencePercent)}% lower</strong> than average. Great job!`;
    } else {
        comparisonMessage = `Your digital footprint matches the average student user.`;
    }
    
    comparisonText.innerHTML = `<p>${comparisonMessage}</p>`;
    
    // Real-world equivalents
    const smartphoneCharges = Math.round(dailyKg / SMARTPHONE_CHARGE_CO2);
    const carKm = (dailyKg / CAR_KM_CO2).toFixed(1);
    const treesNeeded = Math.ceil((dailyKg * 30) / TREE_MONTHLY_CO2);
    
    equivalents.innerHTML = `
        <div class="equivalent-item">
            <span class="equivalent-icon">📱</span>
            <span class="equivalent-text">Equivalent to charging a smartphone <strong>${smartphoneCharges}</strong> times</span>
        </div>
        <div class="equivalent-item">
            <span class="equivalent-icon">🚗</span>
            <span class="equivalent-text">Equivalent to driving <strong>${carKm} km</strong> in a petrol car</span>
        </div>
        <div class="equivalent-item">
            <span class="equivalent-icon">🌳</span>
            <span class="equivalent-text">Would need <strong>${treesNeeded} tree${treesNeeded !== 1 ? 's' : ''}</strong> to offset monthly emissions</span>
        </div>
    `;
}

// Display personalized tips for all categories
function displayPersonalizedTips(results, inputs) {
    const tipsGrid = document.getElementById('tips-grid');
    if (!tipsGrid) return;
    
    const tips = [
        {
            category: 'Streaming',
            icon: '📺',
            condition: results.streaming.value > 0,
            title: 'Reduce Streaming Emissions',
            tips: [
                'Switch from HD to SD when streaming on small screens',
                'Disable autoplay on video platforms',
                'Download content when on WiFi instead of streaming repeatedly',
                'Lower video quality when audio-only is sufficient'
            ],
            impact: calculateImpactPercentage(results.streaming.value, results.totalGrams)
        },
        {
            category: 'Gaming',
            icon: '🎮',
            condition: results.gaming.value > 0,
            title: 'Optimize Gaming Habits',
            tips: [
                'Enable power-saving modes on gaming devices',
                'Close background applications while gaming',
                'Reduce screen brightness when possible',
                'Consider cloud gaming services for energy efficiency'
            ],
            impact: calculateImpactPercentage(results.gaming.value, results.totalGrams)
        },
        {
            category: 'Emails',
            icon: '📧',
            condition: results.email.value > 0,
            title: 'Reduce Email Emissions',
            tips: [
                'Delete old emails and empty your trash folder',
                'Unsubscribe from unnecessary mailing lists',
                'Avoid sending "thank you" emails when not needed',
                'Compress attachments or use cloud links instead'
            ],
            impact: calculateImpactPercentage(results.email.value, results.totalGrams)
        },
        {
            category: 'Cloud Storage',
            icon: '☁️',
            condition: results.cloud.value > 0,
            title: 'Clean Up Cloud Storage',
            tips: [
                'Delete unused files and old backups',
                'Remove duplicate photos and videos',
                'Empty cloud trash folders regularly',
                'Archive important files locally instead of keeping in cloud'
            ],
            impact: calculateImpactPercentage(results.cloud.value, results.totalGrams)
        },
        {
            category: 'Data Transfer',
            icon: '⬇️',
            condition: results.transfer.value > 0,
            title: 'Optimize Data Usage',
            tips: [
                'Download large files on WiFi instead of mobile data',
                'Use data compression when possible',
                'Avoid unnecessary file uploads and downloads',
                'Schedule large transfers during off-peak hours'
            ],
            impact: calculateImpactPercentage(results.transfer.value, results.totalGrams)
        }
    ];
    
    // Filter tips for categories with emissions
    const activeTips = tips.filter(tip => tip.condition);
    
    // Generate tip cards
    activeTips.forEach(tip => {
        const tipCard = document.createElement('div');
        tipCard.className = 'tip-card';
        tipCard.innerHTML = `
            <div class="tip-header">
                <span class="tip-icon">${tip.icon}</span>
                <h3 class="tip-title">${tip.title}</h3>
            </div>
            <div class="tip-impact">Could reduce your footprint by ~${tip.impact}%</div>
            <ul class="tip-list">
                ${tip.tips.map(t => `<li>${t}</li>`).join('')}
            </ul>
        `;
        tipsGrid.appendChild(tipCard);
    });
}

// Calculate impact percentage (estimated reduction)
function calculateImpactPercentage(categoryValue, totalValue) {
    if (totalValue === 0) return 0;
    // Estimate that following tips could reduce category emissions by 20-30%
    const reductionFactor = 0.25; // 25% average reduction
    const potentialReduction = categoryValue * reductionFactor;
    return ((potentialReduction / totalValue) * 100).toFixed(0);
}
