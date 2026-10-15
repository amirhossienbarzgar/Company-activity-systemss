/**
 * سیستم مدیریت و نمایش فعالیت‌های شرکت
 * اسکریپت اصلی (Main JavaScript)
 * شامل:
 * ۱. پایش اسکرول و مدیریت هدر چسبان (Sticky Glassmorphic Header)
 * ۲. مدیریت باز و بسته شدن منوی همبرگری موبایل (Mobile Navigation Drawer)
 * ۳. مدیریت ارسال فرم صفحه تماس با ما (Contact Form Submission Handler)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // راه‌اندازی ماژول‌ها (سبک، سریع، بدون لود اضافی)
  initStickyHeader();
  initMobileNavigation();
  initHeroStatCounters();
  initContactForm();
});

/**
 * ۱. هدر چسبان شیشه‌ای (Sticky Header on Scroll)
 * هنگام اسکرول به پایین، استایل شیشه‌ای هدر تقویت شده و افکت سایه اضافه می‌گردد.
 */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const scrollThreshold = 20;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      if (!header.classList.contains('is-scrolled')) {
        header.classList.add('is-scrolled');
      }
    } else {
      if (header.classList.contains('is-scrolled')) {
        header.classList.remove('is-scrolled');
      }
    }
  };

  // گوش دادن به رویداد اسکرول با بررسی وضعیت اولیه
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * ۲. منوی همبرگری واکنش‌گرا برای موبایل (Mobile Drawer Menu)
 * شامل باز و بسته شدن روان، مدیریت Accessibility، بستن با کلیک خارج از کادر و دکمه Escape
 */
function initMobileNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('mobileCloseBtn');
  const drawer = document.getElementById('mobileMenuDrawer');
  const overlay = document.getElementById('mobileMenuOverlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-footer a');

  if (!hamburgerBtn || !drawer || !overlay) return;

  let isOpen = false;

  const openMenu = () => {
    isOpen = true;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // جلوگیری از اسکرول صفحه زیر منو
  };

  const closeMenu = () => {
    isOpen = false;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // بستن منو با کلیک بر روی لایه تیره پس‌زمینه
  overlay.addEventListener('click', closeMenu);

  // بستن منو با کلیک بر روی هر یک از لینک‌های ناوبری
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // بستن منو با فشردن دکمه Escape کیبورد
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      closeMenu();
    }
  });
}

/**
 * ۳. مدیریت ارسال فرم تماس با ما (Contact Form Handler)
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formSuccessAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // اعتبارسنجی اولیه فرم
    const nameInput = document.getElementById('senderName');
    const contactInput = document.getElementById('senderContact');
    const messageInput = document.getElementById('messageBody');

    if (!nameInput?.value.trim() || !contactInput?.value.trim() || !messageInput?.value.trim()) {
      alert('لطفاً فیلدهای ستاره‌دار الزامی را تکمیل فرمایید.');
      return;
    }

    // شبیه‌سازی ارسال موفقیت‌آمیز پیام
    const submitBtn = document.getElementById('submitContactBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>در حال ثبت اطلاعات...</span>';
    }

    setTimeout(() => {
      if (alertBox) {
        alertBox.classList.add('is-visible');
        alertBox.style.display = 'flex';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>ارسال پیام و ثبت درخواست</span>
          <svg class="btn-send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        `;
      }
    }, 600);
  });
}

/**
 * تبدیل اعداد انگلیسی به اعداد فارسی
 * @param {number|string} num 
 * @returns {string}
 */
function toPersianDigits(num) {
  if (num === null || num === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (char) => persianDigits[char]);
}

/**
 * تابع نرم‌کننده حرکتی (Easing function - easeOutExpo)
 */
function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * ۴. انیمیشن شمارنده کارت‌های آماری بخش هیرو (Hero Counter Animation)
 */
function initHeroStatCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  if (!counterElements.length) return;

  const duration = 2000; // مدت‌زمان انیمیشن به میلی‌ثانیه (۲ ثانیه)

  const startCounterAnimation = (el) => {
    const targetValue = parseInt(el.getAttribute('data-target'), 10) || 0;
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    let startTime = null;

    const updateCounter = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentValue = Math.floor(easedProgress * targetValue);
      const formattedNumber = toPersianDigits(currentValue);

      el.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${toPersianDigits(targetValue)}${suffix}`;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counterElements.forEach((counter) => startCounterAnimation(counter));
          observer.disconnect();
        }
      });
    }, {
      threshold: 0.2
    });

    const heroSection = document.getElementById('hero');
    if (heroSection) {
      statsObserver.observe(heroSection);
    } else {
      counterElements.forEach((counter) => startCounterAnimation(counter));
    }
  } else {
    counterElements.forEach((counter) => startCounterAnimation(counter));
  }
}

