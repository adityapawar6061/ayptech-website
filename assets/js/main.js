/**
 * AYP TECH — Interactive Experience Engine
 * Handles Canvas Simulations, Stack Recipe Filter, ROI Calculator, and Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initHeroCanvas();
  initStackSelector();
  initRoiCalculator();
});

/* --------------------------------------------------------------------------
   1. NAVBAR & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileClose = document.querySelector('.mobile-close-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  });

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close on link click
  const drawerLinks = mobileDrawer?.querySelectorAll('a');
  drawerLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape key for keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* --------------------------------------------------------------------------
   2. INTERACTIVE HERO WORKFLOW CANVAS (MAKE / RETOOL MODEL)
   -------------------------------------------------------------------------- */
const canvasScenarios = {
  leads: {
    badge: 'SCENARIO 1: REVENUE OPS',
    nodes: [
      {
        type: 'TRIGGER',
        name: 'New Lead Submitted',
        meta: 'WhatsApp Cloud API / Website Form',
        icon: '⚡',
        iconClass: 'icon-trigger',
        status: '200 OK'
      },
      {
        type: 'AI AGENT',
        name: 'Autonomous Research & Scoring',
        meta: 'Analyzes LinkedIn, company revenue, fits ICP',
        icon: '🤖',
        iconClass: 'icon-ai',
        status: 'Score: 94/100'
      },
      {
        type: 'GUARDRAIL',
        name: 'Confidence & Approval Check',
        meta: 'Confidence > 90% (Self-routed to calendar)',
        icon: '🛡️',
        iconClass: 'icon-guardrail',
        status: 'Deterministic Pass'
      },
      {
        type: 'ACTION',
        name: 'Auto-Book Call & Sync CRM',
        meta: 'Google Calendar invite + HubSpot/Zoho created',
        icon: '🚀',
        iconClass: 'icon-action',
        status: 'Completed (1.2s)'
      }
    ]
  },
  finance: {
    badge: 'SCENARIO 2: FINANCE & INVOICING',
    nodes: [
      {
        type: 'TRIGGER',
        name: 'Invoice PDF Received',
        meta: 'Vendor email into billing inbox',
        icon: '📄',
        iconClass: 'icon-trigger',
        status: 'Auto-Extracted'
      },
      {
        type: 'AI AGENT',
        name: 'Vision OCR & Line-Item Parser',
        meta: 'Extracts GSTIN, subtotal, PO match',
        icon: '🔍',
        iconClass: 'icon-ai',
        status: '100% Match'
      },
      {
        type: 'GUARDRAIL',
        name: 'Human-in-the-Loop Gate',
        meta: 'Slack 1-click approval for > ₹50,000 spend',
        icon: '🛡️',
        iconClass: 'icon-guardrail',
        status: 'Approved by CFO'
      },
      {
        type: 'ACTION',
        name: 'Reconcile in Tally / Zoho Books',
        meta: 'Payment queued & receipt dispatched',
        icon: '💳',
        iconClass: 'icon-action',
        status: 'Reconciled'
      }
    ]
  },
  support: {
    badge: 'SCENARIO 3: 24/7 CUSTOMER SUPPORT',
    nodes: [
      {
        type: 'TRIGGER',
        name: 'Customer Query',
        meta: 'WhatsApp / Web Live Chat / Phone Voice',
        icon: '💬',
        iconClass: 'icon-trigger',
        status: 'Incoming'
      },
      {
        type: 'AI AGENT',
        name: 'RAG Knowledge Assistant',
        meta: 'Queries company documentation & DB',
        icon: '🧠',
        iconClass: 'icon-ai',
        status: 'Answer Synthesized'
      },
      {
        type: 'GUARDRAIL',
        name: 'Safety & Hallucination Guard',
        meta: 'Strict zero-hallucination compliance prompt',
        icon: '🛡️',
        iconClass: 'icon-guardrail',
        status: 'Verified Safe'
      },
      {
        type: 'ACTION',
        name: 'Instant Resolution & Ticket Sync',
        meta: 'Solved in 2.8s | Zendesk/Freshdesk updated',
        icon: '✅',
        iconClass: 'icon-action',
        status: 'CSAT 5/5'
      }
    ]
  }
};

function initHeroCanvas() {
  const tabs = document.querySelectorAll('.canvas-tab-btn');
  const badge = document.getElementById('canvasBadge');
  const nodesContainer = document.getElementById('canvasNodesFlow');
  const simBtn = document.getElementById('simTriggerBtn');

  if (!nodesContainer) return;

  function renderScenario(key) {
    const data = canvasScenarios[key];
    if (!data) return;

    if (badge) badge.textContent = data.badge;

    // Retain connector line
    nodesContainer.innerHTML = `
      <div class="canvas-connector-line">
        <span class="canvas-packet" id="canvasPacket"></span>
      </div>
    `;

    data.nodes.forEach((node, idx) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'canvas-node' + (idx === 0 ? ' active-node' : '');
      nodeEl.style.animation = `fadeUp 0.3s ease forwards ${idx * 0.08}s`;
      nodeEl.innerHTML = `
        <div class="node-icon-wrap ${node.iconClass}">${node.icon}</div>
        <div class="node-info">
          <div class="node-type-label">${node.type}</div>
          <div class="node-name">${node.name}</div>
          <div class="node-meta">${node.meta}</div>
        </div>
        <span class="node-status-pill">${node.status}</span>
      `;
      nodesContainer.appendChild(nodeEl);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const scenarioKey = tab.getAttribute('data-scenario');
      renderScenario(scenarioKey);
    });
  });

  if (simBtn) {
    simBtn.addEventListener('click', () => {
      const origText = simBtn.innerHTML;
      simBtn.innerHTML = '⚡ Simulating Live Packet...';
      simBtn.style.filter = 'brightness(1.3)';
      
      const nodes = nodesContainer.querySelectorAll('.canvas-node');
      nodes.forEach((node, idx) => {
        setTimeout(() => {
          nodes.forEach(n => n.classList.remove('active-node'));
          node.classList.add('active-node');
        }, idx * 600);
      });

      setTimeout(() => {
        simBtn.innerHTML = origText;
        simBtn.style.filter = '';
      }, nodes.length * 600 + 400);
    });
  }

  // Initial render on page load: show default 'leads' scenario
  renderScenario('leads');
}

/* --------------------------------------------------------------------------
   3. STACK INTEGRATION & RECIPE FINDER (ZAPIER-STYLE FLYWHEEL)
   -------------------------------------------------------------------------- */
const sampleRecipes = [
  {
    apps: ['whatsapp', 'sheets', 'slack'],
    name: 'WhatsApp Lead to Google Sheets & Instant Slack Alert',
    badge: 'GROWTH OPS',
    desc: 'Auto-captures WhatsApp chats, logs lead attributes to Sheets, and notifies sales rep on Slack with 1-click reply.',
    metric: '⚡ Response time drops from 4 hours to 45 seconds'
  },
  {
    apps: ['gmail', 'tally', 'zoho'],
    name: 'Vendor PDF Invoice to Tally / Zoho Auto-Entry',
    badge: 'FINANCE OPS',
    desc: 'Extracts invoices arriving in Gmail using OCR, validates GSTIN, and posts directly to accounting software.',
    metric: '⚡ 85% reduction in manual billing errors'
  },
  {
    apps: ['razorpay', 'notion', 'whatsapp'],
    name: 'Razorpay Payment to Notion Task & Client WhatsApp Onboarding',
    badge: 'CUSTOMER ONBOARDING',
    desc: 'Immediately upon successful payment, generates project dashboard in Notion and sends personalized WhatsApp welcome pack.',
    metric: '⚡ 100% automated client handoff'
  },
  {
    apps: ['openai', 'hubspot', 'gmail'],
    name: 'AI SDR Prospect Research & Hyper-Personalized Email Drafter',
    badge: 'SALES AGENT',
    desc: 'Deep-scrapes prospect domain & recent news, calculates relevance, and drafts custom outbound cold email into HubSpot drafts.',
    metric: '⚡ 3.8x increase in outbound reply rate'
  },
  {
    apps: ['slack', 'notion', 'sheets'],
    name: 'Executive Daily KPI Digest & Pipeline Pulse',
    badge: 'EXECUTIVE INTELLIGENCE',
    desc: 'Aggregates daily sales, support tickets, and cash flow into a concise 5-bullet executive summary posted to #leadership.',
    metric: '⚡ Saves founders 1.5 hours every morning'
  },
  {
    apps: ['whatsapp', 'openai', 'zoho'],
    name: '24/7 WhatsApp AI Customer Support & Inventory Checker',
    badge: 'CUSTOMER EXPERIENCE',
    desc: 'Answers product questions in fluent English and Hindi, checks real-time inventory in Zoho, and hands off complex inquiries to humans.',
    metric: '⚡ Handles 70% of routine inquiries autonomously'
  }
];

function initStackSelector() {
  const chips = document.querySelectorAll('.stack-chip');
  const recipesContainer = document.getElementById('recipesGrid');
  if (!chips.length || !recipesContainer) return;

  function filterRecipes() {
    const activeApps = Array.from(document.querySelectorAll('.stack-chip.active'))
      .map(c => c.getAttribute('data-app'));

    let matched = sampleRecipes.filter(recipe => {
      if (activeApps.length === 0) return true;
      return recipe.apps.some(app => activeApps.includes(app));
    });

    if (matched.length === 0) matched = sampleRecipes.slice(0, 3);

    recipesContainer.innerHTML = '';
    matched.forEach(rec => {
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.innerHTML = `
        <span class="recipe-badge">${rec.badge}</span>
        <h4 class="recipe-name">${rec.name}</h4>
        <p class="recipe-desc">${rec.desc}</p>
        <div class="recipe-metric">${rec.metric}</div>
      `;
      recipesContainer.appendChild(card);
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      filterRecipes();
    });
  });

  filterRecipes(); // initial render
}

/* --------------------------------------------------------------------------
   4. QUANTIFIED ROI & TIME SAVINGS CALCULATOR
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const teamSlider = document.getElementById('teamSizeSlider');
  const hoursSlider = document.getElementById('hoursSlider');
  const salarySlider = document.getElementById('salarySlider');

  const teamVal = document.getElementById('teamSizeVal');
  const hoursVal = document.getElementById('hoursVal');
  const salaryVal = document.getElementById('salaryVal');

  const totalSavedElem = document.getElementById('calcTotalSavedYear');
  const hoursSavedElem = document.getElementById('calcHoursSavedMonth');
  const roiMultiplierElem = document.getElementById('calcRoiMultiplier');

  if (!teamSlider || !hoursSlider || !salarySlider) return;

  function calculate() {
    const team = parseInt(teamSlider.value, 10);
    const hoursPerWeek = parseInt(hoursSlider.value, 10);
    const avgSalary = parseInt(salarySlider.value, 10);

    teamVal.textContent = `${team} people`;
    hoursVal.textContent = `${hoursPerWeek} hrs/week`;
    salaryVal.textContent = `₹${(avgSalary / 1000).toFixed(0)}k/mo`;

    // Monthly manual hours across team
    const totalWeeklyHours = team * hoursPerWeek;
    const totalMonthlyHours = totalWeeklyHours * 4.2;

    // Assuming automation recaptures ~75% of those repetitive hours
    const hoursSavedMonth = Math.round(totalMonthlyHours * 0.75);

    // Hourly cost equivalent
    const hourlyRate = avgSalary / 160; // ~160 working hours/month
    const monthlyCostLost = totalMonthlyHours * hourlyRate;
    const annualMoneyRecovered = (monthlyCostLost * 0.75) * 12;

    // Convert to Lakhs
    const annualLakhs = (annualMoneyRecovered / 100000).toFixed(1);

    // Estimated ROI multiplier
    const estimatedCostOfAyp = 60000 * 12; // estimated typical investment
    const multiplier = Math.max(3.2, (annualMoneyRecovered / estimatedCostOfAyp)).toFixed(1);

    totalSavedElem.textContent = `₹${annualLakhs} Lakhs`;
    hoursSavedElem.textContent = `${hoursSavedMonth.toLocaleString()} hrs`;
    roiMultiplierElem.textContent = `${multiplier}x ROI`;
  }

  teamSlider.addEventListener('input', calculate);
  hoursSlider.addEventListener('input', calculate);
  salarySlider.addEventListener('input', calculate);

  calculate();
}

/* --------------------------------------------------------------------------
   5. THEME ENGINE (DEVICE PREFERENCE BY DEFAULT + MANUAL TOGGLE)
   -------------------------------------------------------------------------- */
function initTheme() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getSystemTheme() {
    return mediaQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('ayp_theme', theme);
    }
  }

  // Determine current active theme
  const savedTheme = localStorage.getItem('ayp_theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme, false);
  } else {
    applyTheme(getSystemTheme(), false);
  }

  // Toggle button click handler (support multiple toggles on page if any)
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || getSystemTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  });

  // Listen for real-time OS theme changes when no manual override is active
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('ayp_theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}
