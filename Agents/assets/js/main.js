// AYP Tech Voice Agents - Interactive Engine
document.addEventListener('DOMContentLoaded', function () {
  // 1. Mobile Menu Toggle
  const mobileToggleBtn = document.querySelector('[aria-label="Open menu"], .mobile-toggle');
  const mobileDrawer = document.getElementById('aypMobileDrawer');
  const mobileOverlay = document.getElementById('aypMobileOverlay');
  const mobileCloseBtn = document.getElementById('aypMobileClose');

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggleBtn) mobileToggleBtn.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // 2. Interactive FAQ Accordion
  const faqButtons = document.querySelectorAll('[data-faq-btn]');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const faqItem = this.closest('.faq-item') || this.parentElement;
      const isOpen = faqItem.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(item => {
        if (item !== faqItem) item.classList.remove('open');
      });

      if (!isOpen) {
        faqItem.classList.add('open');
      } else {
        faqItem.classList.remove('open');
      }
    });
  });

  // 3. Hero Demo Form - Redirection with Pre-filled Parameters
  const demoForm = document.getElementById('heroDemoForm');
  const heroWhatsAppBtn = document.getElementById('heroWhatsAppBtn');

  // Country code picker
  const countryCodeBtn = document.getElementById('countryCodeBtn');
  const countryCodeMenu = document.getElementById('countryCodeMenu');
  const countryCodeText = document.getElementById('countryCodeText');
  const countryCodeFlag = document.getElementById('countryCodeFlag');

  if (countryCodeBtn && countryCodeMenu) {
    countryCodeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      countryCodeMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', function () {
      countryCodeMenu.classList.add('hidden');
    });

    countryCodeMenu.querySelectorAll('[data-code]').forEach(opt => {
      opt.addEventListener('click', function () {
        const code = this.getAttribute('data-code');
        const flag = this.getAttribute('data-flag');
        if (countryCodeText) countryCodeText.textContent = code;
        if (countryCodeFlag) countryCodeFlag.textContent = flag;
        countryCodeMenu.classList.add('hidden');
      });
    });
  }

  // Handle Hero Form Submission -> Redirect to contact.html with prefilled details
  if (demoForm) {
    demoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = (document.getElementById('demoName')?.value || '').trim();
      const rawPhone = (document.getElementById('demoPhone')?.value || '').trim();
      const countryCode = (countryCodeText?.textContent || '+91').trim();
      const fullPhone = rawPhone ? `${countryCode} ${rawPhone}` : '';

      const params = new URLSearchParams({
        name: name,
        phone: fullPhone,
        ref: 'hero_demo'
      });

      window.location.href = `contact.html?${params.toString()}`;
    });
  }

  // Handle WhatsApp Button on Hero
  if (heroWhatsAppBtn) {
    heroWhatsAppBtn.addEventListener('click', function () {
      const name = (document.getElementById('demoName')?.value || '').trim();
      const rawPhone = (document.getElementById('demoPhone')?.value || '').trim();
      const countryCode = (countryCodeText?.textContent || '+91').trim();
      const fullPhone = rawPhone ? `${countryCode} ${rawPhone}` : '';

      let msg = 'Hi AYP Tech! I would like to book a demo for your Voice AI Agents.';
      if (name) msg += `\nMy Name: ${name}`;
      if (fullPhone) msg += `\nPhone: ${fullPhone}`;

      const waUrl = `https://wa.me/919356965876?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, '_blank');
    });
  }

  // 4. Contact Page Pre-fill Logic & Form Submission
  const isContactPage = window.location.pathname.includes('contact.html') || document.getElementById('demo-fullName');
  if (isContactPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const prefillName = urlParams.get('name');
    const prefillPhone = urlParams.get('phone');
    const prefillAgent = urlParams.get('agent');
    const prefillVolume = urlParams.get('volume');

    if (prefillName || prefillPhone || prefillAgent) {
      const formCard = document.querySelector('.rounded-3xl.border.border-zinc-200.bg-white') || document.querySelector('form');
      if (formCard) {
        const banner = document.createElement('div');
        banner.className = 'mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-sm flex items-start gap-3 shadow-xs';
        banner.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 font-bold"><i class="ri-check-line text-lg"></i></div>
          <div>
            <div class="font-bold text-teal-950">Pre-filled Demo Request</div>
            <div class="text-xs text-teal-800 mt-0.5">We have prefilled your request for <strong>${prefillAgent || 'Voice AI Agent'}</strong>. Please verify and confirm below to book your demo slot.</div>
          </div>
        `;
        formCard.insertBefore(banner, formCard.firstChild);
      }

      const nameInput = document.getElementById('demo-fullName');
      if (nameInput && prefillName) nameInput.value = prefillName;

      const phoneInput = document.getElementById('demo-phone');
      if (phoneInput && prefillPhone) phoneInput.value = prefillPhone;

      // Fill message textarea
      const messageInput = document.getElementById('demo-message');
      if (messageInput) {
        let msgNotes = [];
        if (prefillAgent) msgNotes.push(`• Selected Agent: ${prefillAgent}`);
        if (prefillVolume) msgNotes.push(`• Monthly Volume: ${prefillVolume}`);
        messageInput.value = `Hi AYP Tech Team,\nI would like to schedule a 1-on-1 walkthrough for Voice AI.\n` + msgNotes.join('\n');
      }

      // Update use case button text if present
      const useCaseBtn = document.querySelector('[aria-label="Primary use case"] span[data-slot="select-value"]');
      if (useCaseBtn && prefillAgent) {
        useCaseBtn.textContent = prefillAgent;
        useCaseBtn.classList.remove('text-zinc-500');
        useCaseBtn.classList.add('text-zinc-900', 'font-medium');
      }

      // Update volume button text if present
      const volumeBtn = document.querySelector('[aria-label="Expected call volume"] span[data-slot="select-value"]');
      if (volumeBtn && prefillVolume) {
        volumeBtn.textContent = prefillVolume;
        volumeBtn.classList.remove('text-zinc-500');
        volumeBtn.classList.add('text-zinc-900', 'font-medium');
      }

      // Smooth scroll to form
      setTimeout(() => {
        const scrollTarget = document.getElementById('demo-fullName') || formCard;
        if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }

    // Contact Form submission handler
    const contactForm = document.querySelector('form[novalidate], form.contact-form-main, .rounded-3xl.border form');
    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fullName = (document.getElementById('demo-fullName')?.value || '').trim();
        const email = (document.getElementById('demo-email')?.value || '').trim();
        const phone = (document.getElementById('demo-phone')?.value || '').trim();
        const company = (document.getElementById('demo-companyName')?.value || '').trim();
        const message = (document.getElementById('demo-message')?.value || '').trim();

        if (!fullName || !phone) {
          alert('Please provide your name and phone number so our team can contact you.');
          return;
        }

        // Show elegant submission modal or WhatsApp redirect option
        showConfirmationModal(fullName, phone, company, email, message);
      });
    }
  }

  function showConfirmationModal(name, phone, company, email, message) {
    const modalHtml = `
      <div id="confirmModalOverlay" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-zinc-200 text-center animate-in fade-in zoom-in duration-200">
          <div class="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold"><i class="ri-checkbox-circle-line text-3xl"></i></div>
          <h3 class="text-2xl font-bold text-zinc-900 mb-2">Demo Request Received!</h3>
          <p class="text-sm text-zinc-600 mb-6 leading-relaxed">
            Thank you, <strong>${name}</strong>. Our Voice AI solutions engineer has received your request and will contact you at <strong>${phone}</strong> within 4 business hours to schedule your live walkthrough.
          </p>
          <div class="space-y-3">
            <a href="https://wa.me/919356965876?text=${encodeURIComponent('Hi AYP Tech! I just requested a Voice AI demo. Name: ' + name + ', Phone: ' + phone + ', Company: ' + (company || 'N/A'))}" target="_blank" class="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm">
              <span>Connect on WhatsApp for Instant Confirmation →</span>
            </a>
            <button type="button" id="closeConfirmModal" class="w-full py-3 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium text-sm transition-colors">
              Close &amp; Back to Home
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    document.getElementById('closeConfirmModal')?.addEventListener('click', function () {
      document.getElementById('confirmModalOverlay')?.remove();
      window.location.href = 'index.html';
    });
  }

  // 5. Frontier Voice Models Tabbed Switcher
  const modelTabs = document.querySelectorAll('[data-model-tab]');
  const modelContents = document.querySelectorAll('[data-model-content]');

  modelTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetModel = this.getAttribute('data-model-tab');
      modelTabs.forEach(t => t.classList.remove('bg-teal-600', 'text-white', 'active'));
      this.classList.add('bg-teal-600', 'text-white', 'active');

      modelContents.forEach(content => {
        if (content.getAttribute('data-model-content') === targetModel) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });

  // 6. Sales Suite Agent Tabbed Switcher
  const agentTabs = document.querySelectorAll('[data-agent-tab]');
  const agentPanels = document.querySelectorAll('[data-agent-panel]');

  agentTabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const targetAgent = this.getAttribute('data-agent-tab');
      agentTabs.forEach(t => t.classList.remove('bg-teal-600', 'text-white', 'active'));
      this.classList.add('bg-teal-600', 'text-white', 'active');

      agentPanels.forEach(panel => {
        if (panel.getAttribute('data-agent-panel') === targetAgent) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // 7. Whitelabel Partnership Form Submission
  const whitelabelForm = document.getElementById('whitelabelForm');
  if (whitelabelForm) {
    whitelabelForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fullName = (document.getElementById('fullName')?.value || '').trim();
      const phone = (document.getElementById('phone')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const agencyName = (document.getElementById('businessName')?.value || '').trim();

      const modalHtml = `
        <div id="wlConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl border border-zinc-100">
            <div class="w-16 h-16 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-5 text-2xl font-bold">
              ✓
            </div>
            <h3 class="text-2xl font-bold text-zinc-900 mb-2">Application Received!</h3>
            <p class="text-sm text-zinc-600 mb-6 leading-relaxed">
              Thank you, <strong>${fullName}</strong>. Our Partnerships Director has received your white-label application for <strong>${agencyName || 'your agency'}</strong> and will contact you at <strong>${phone || email}</strong> within 1 business day for your 15-minute discovery call.
            </p>
            <div class="space-y-3">
              <a href="https://wa.me/919356965876?text=${encodeURIComponent('Hi AYP Tech! I submitted a White-Label Partner application. Name: ' + fullName + ', Agency: ' + agencyName + ', Phone: ' + phone)}" target="_blank" class="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm">
                <span>Fast-track on WhatsApp (+91 9356965876) →</span>
              </a>
              <button type="button" id="closeWlModal" class="w-full py-3 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 font-medium text-sm transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      document.getElementById('closeWlModal')?.addEventListener('click', function () {
        document.getElementById('wlConfirmModal')?.remove();
      });
    });
  }

});
