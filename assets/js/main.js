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
  initHomeProjectsShowcase();
  initContactForm();
  initAuthSystem();
  initManagerEmployeeVault();
  initEmployeeProfilePortal();
  initLivePresenceDashboard();
});

// نگهداری وضعیت باز یا بسته بودن کارت‌های پروژه‌ها (پیش‌فرض: بسته بودن جهت اشغال نکردن فضا)
const expandedProjectIds = new Set();

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
 * ۴. انیمیشن شمارنده کارت‌های آماری بخش هیرو (Hero Counter Animation) بر اساس داده‌های واقعی سامانه
 */
function initHeroStatCounters() {
  const counterElements = document.querySelectorAll('.stat-counter');
  if (!counterElements.length) return;

  // محاسبه پویای آمار واقعی از روی پروژه‌های ثبت‌شده در سامانه
  const allProjects = getStoredProjects();
  let completedCount = 0;
  let inProgressCount = 0;
  let totalStages = 0;
  let completedStages = 0;

  allProjects.forEach(p => {
    const total = p.stages?.length || 0;
    const comp = p.stages?.filter(s => s.completed).length || 0;
    totalStages += total;
    completedStages += comp;
    if (total > 0 && comp === total) {
      completedCount++;
    } else {
      inProgressCount++;
    }
  });

  const productivityPercent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  const card1Counter = document.querySelector('.stat-card-1 .stat-counter');
  const card2Counter = document.querySelector('.stat-card-2 .stat-counter');
  const card3Counter = document.querySelector('.stat-card-3 .stat-counter');
  const card3Progress = document.querySelector('.stat-card-3 .stat-progress-fill');

  if (card1Counter) {
    card1Counter.setAttribute('data-target', completedCount);
    card1Counter.setAttribute('data-prefix', completedCount > 0 ? '+' : '');
    card1Counter.textContent = (completedCount > 0 ? '+' : '') + toPersianDigits(completedCount);
  }

  if (card2Counter) {
    card2Counter.setAttribute('data-target', inProgressCount);
    card2Counter.setAttribute('data-prefix', '');
    card2Counter.textContent = toPersianDigits(inProgressCount);
  }

  if (card3Counter) {
    card3Counter.setAttribute('data-target', productivityPercent);
    card3Counter.setAttribute('data-suffix', '٪');
    card3Counter.textContent = toPersianDigits(productivityPercent) + '٪';
  }

  if (card3Progress) {
    card3Progress.style.width = `${productivityPercent}%`;
  }

  const duration = 1800; // مدت‌زمان انیمیشن به میلی‌ثانیه

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

/* ==========================================================================
   ۵. ماژول پایگاه داده و ذخیره‌سازی محلی (Storage & Vault Helpers)
   ========================================================================== */
const EMP_VAULT_KEY = 'company_employees_vault';
const EMP_PROJECTS_KEY = 'company_employee_projects';

function getStoredEmployees() {
  try {
    const raw = localStorage.getItem(EMP_VAULT_KEY);
    if (!raw) {
      const initialSeed = [
        {
          id: 'emp_' + Date.now(),
          name: 'سارا محمدی',
          email: 'sara@company.ir',
          phone: '09121112233',
          password: 'sara',
          empCode: 'EMP-2041',
          department: 'توسعه و برنامه‌نویسی نرم‌افزار',
          createdAt: '۱۴۰۵/۰۷/۱۵',
          status: 'فعال'
        }
      ];
      localStorage.setItem(EMP_VAULT_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('خطا در خواندن داده‌های کارمندان:', e);
    return [];
  }
}

function saveStoredEmployees(list) {
  localStorage.setItem(EMP_VAULT_KEY, JSON.stringify(list));
}

function getStoredProjects() {
  try {
    const raw = localStorage.getItem(EMP_PROJECTS_KEY);
    if (!raw) {
      const initialSeed = [
        {
          id: 'proj_seed_1',
          employeeEmail: 'sara@company.ir',
          employeeName: 'سارا محمدی',
          title: 'پیاده‌سازی پلتفرم یکپارچه خدمات هوشمند ابری',
          clientName: 'هلدینگ توسعه فناوری آریا',
          contractNo: 'CNT-1405-44',
          contractDate: '۱۴۰۵/۰۶/۱۵',
          contractAmount: '۱۸۰,۰۰۰,۰۰۰ تومان',
          contractScope: 'طراحی، پیاده‌سازی و استقرار زیرساخت‌های سرورهای توزیع‌شده کلاود و امنیت داده‌های سازمانی',
          createdAt: '۱۴۰۵/۰۶/۱۵',
          stages: [
            { id: 'stg_1_1', title: '۱. نیازسنجی، تدوین RFP و تصویب الزامات فنی معماری', completed: true, completedAt: '۱۴۰۵/۰۶/۲۰ - ۱۰:۳۰', note: 'مستندات معماری با تایید مدیر فنی تصویب گردید.' },
            { id: 'stg_1_2', title: '۲. پیکربندی پایگاه‌های داده و ماژول‌های امنیتی کلاود', completed: true, completedAt: '۱۴۰۵/۰۶/۲۸ - ۱۴:۱۵', note: 'کانفیگ کلاسترها با تست بار موفق انجام شد.' },
            { id: 'stg_1_3', title: '۳. پیاده‌سازی وب‌سرویس‌ها و APIهای یکپارچه سازمانی', completed: true, completedAt: '۱۴۰۵/۰۷/۰۸ - ۱۱:۰۰', note: 'تمامی اندپوینت‌ها پیاده‌سازی و مستند شد.' },
            { id: 'stg_1_4', title: '۴. آزمون‌های امنیتی، تست نفوذ و بهینه‌سازی بار شبکه', completed: true, completedAt: '۱۴۰۵/۰۷/۱۶ - ۱۶:۴۰', note: 'گواهی سلامت تست نفوذ دریافت شد.' },
            { id: 'stg_1_5', title: '۵. تحویل نهایی، آموزش کاربران ارشد و انتقال دانش فنی', completed: true, completedAt: '۱۴۰۵/۰۷/۱۹ - ۰۹:۲۰', note: 'جلسه تحویل نهایی با صورت‌جلسه رسمی پایان یافت.' }
          ]
        },
        {
          id: 'proj_seed_2',
          employeeEmail: 'amir@company.ir',
          employeeName: 'امیرحسین برزگر (مدیریت)',
          title: 'سامانه نظارت برخط و داشبورد پایش شاخص‌های عملکرد KPI',
          clientName: 'شرکت سرمایه‌گذاری پارس نوین',
          contractNo: 'CNT-1405-92',
          contractDate: '۱۴۰۵/۰۷/۱۰',
          contractAmount: '۱۲۰,۰۰۰,۰۰۰ تومان',
          contractScope: 'پیاده‌سازی ماژول‌های تحلیل داده و گزارش‌گیری خودکار شاخص‌های کلیدی سازمان',
          createdAt: '۱۴۰۵/۰۷/۱۰',
          stages: [
            { id: 'stg_2_1', title: '۱. نیازسنجی، تدوین پیش‌نویس قرارداد و برآورد بودجه', completed: true, completedAt: '۱۴۰۵/۰۷/۱۲ - ۱۲:۳۰', note: 'بودجه و زمان‌بندی به تایید طرفین رسید.' },
            { id: 'stg_2_2', title: '۲. اخذ تاییدیه و تصویب رسمی قرارداد با کارفرما', completed: true, completedAt: '۱۴۰۵/۰۷/۱۵ - ۱۰:۰۰', note: 'قرارداد امضا و نسخه فیزیکی مبادله شد.' },
            { id: 'stg_2_3', title: '۳. تشکیل کارگروه اجرایی و آغاز فازهای عملیاتی', completed: true, completedAt: '۱۴۰۵/۰۷/۱۸ - ۱۴:۰۰', note: 'تیم اجرایی مستقر و فاز اول آغاز شد.' },
            { id: 'stg_2_4', title: '۴. نظارت دوره‌ای، پایش شاخص‌های کلیدی و کنترل کیفیت', completed: false, completedAt: '', note: '' },
            { id: 'stg_2_5', title: '۵. تحویل نهایی خروجی‌ها، تسویه‌حساب و پایان تعهدات', completed: false, completedAt: '', note: '' }
          ]
        }
      ];
      localStorage.setItem(EMP_PROJECTS_KEY, JSON.stringify(initialSeed));
      return initialSeed;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('خطا در خواندن پروژه‌ها:', e);
    return [];
  }
}

function saveStoredProjects(list) {
  localStorage.setItem(EMP_PROJECTS_KEY, JSON.stringify(list));
}

/* ==========================================================================
   ۶. مدیریت ورود هوشمند (Authentication System)
   ========================================================================== */
function initAuthSystem() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  const alertError = document.getElementById('loginAlertError');
  const alertSuccess = document.getElementById('loginAlertSuccess');
  const errorMessageText = document.getElementById('errorMessageText');
  const successMessageText = document.getElementById('loginSuccessMessageText');
  const submitBtn = document.getElementById('loginSubmitBtn');

  // تضمین مقداردهی اولیه مخزن
  getStoredEmployees();

  const hideAlerts = () => {
    if (alertError) alertError.classList.remove('is-visible');
    if (alertSuccess) alertSuccess.classList.remove('is-visible');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideAlerts();

    const inputUser = usernameInput?.value.trim() || '';
    const inputPass = passwordInput?.value.trim() || '';

    if (!inputUser || !inputPass) {
      if (errorMessageText) errorMessageText.textContent = 'لطفاً نام کاربری/ایمیل و رمز عبور را وارد فرمایید.';
      if (alertError) alertError.classList.add('is-visible');
      return;
    }

    // ۱. بررسی ورود مدیر سایت (amir / 0000)
    if (inputUser.toLowerCase() === 'amir' && (inputPass === '0000' || inputPass === '00000')) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>در حال ورود به داشبورد مدیریت...</span>';
      }
      if (successMessageText) successMessageText.textContent = 'ورود مدیر سایت موفقیت‌آمیز! در حال انتقال به داشبورد...';
      if (alertSuccess) alertSuccess.classList.add('is-visible');

      const sessionData = {
        username: 'amir',
        name: 'امیرحسین برزگر',
        role: 'مدیریت ارشد و سرپرست پایش عملکرد',
        empCode: 'EMP-8801',
        department: 'مدیریت ارشد و راهبری سازمان',
        loginTimestamp: Date.now()
      };
      sessionStorage.setItem('portalAdminUser', JSON.stringify(sessionData));

      setTimeout(() => {
        window.location.href = 'dashbord.html';
      }, 650);
      return;
    }

    // ۲. بررسی ورود کارمندان تعریف‌شده توسط مدیر
    const employees = getStoredEmployees();
    const lowerInput = inputUser.toLowerCase();
    const matchedEmp = employees.find(emp => {
      const matchIdentity = (
        (emp.email && emp.email.toLowerCase() === lowerInput) ||
        (emp.phone && emp.phone.trim() === inputUser) ||
        (emp.name && emp.name.toLowerCase() === lowerInput) ||
        (emp.empCode && emp.empCode.toLowerCase() === lowerInput)
      );
      return matchIdentity && String(emp.password) === inputPass;
    });

    if (matchedEmp) {
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>در حال انتقال به پرتال کارمند...</span>';
      }
      if (successMessageText) successMessageText.textContent = `ورود موفقیت‌آمیز همکار گرامی «${matchedEmp.name}»! در حال ورود به پروفایل...`;
      if (alertSuccess) alertSuccess.classList.add('is-visible');

      sessionStorage.setItem('portalEmployeeUser', JSON.stringify(matchedEmp));

      setTimeout(() => {
        window.location.href = 'employee-profile.html';
      }, 650);
    } else {
      if (errorMessageText) errorMessageText.textContent = 'اطلاعات کاربری یا رمز عبور نامعتبر است. دسترسی کارمند باید توسط مدیر سایت در داشبورد تعریف شده باشد.';
      if (alertError) alertError.classList.add('is-visible');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  });
}

/* ==========================================================================
   ۷. بخش محرمانه مدیریت کارمندان در داشبورد مدیر (Manager Employee Vault)
   ========================================================================== */
function initManagerEmployeeVault() {
  const vaultSection = document.getElementById('managerVaultSection');
  if (!vaultSection) return;

  const createForm = document.getElementById('createEmployeeForm');
  const tbody = document.getElementById('employeesTableBody');
  const countBadge = document.getElementById('registeredEmployeesCountBadge');
  const btnGenPwd = document.getElementById('btnGenRandomPwd');
  const btnTogglePwd = document.getElementById('toggleEmpPwdBtn');
  const empPwdInput = document.getElementById('empPassword');
  const btnExportBackup = document.getElementById('btnExportVaultBackup');

  // رندر جدول کارمندان
  const renderEmployeesTable = () => {
    if (!tbody) return;
    const employees = getStoredEmployees();
    const allProjects = getStoredProjects();

    if (countBadge) {
      countBadge.textContent = `${employees.length} کارمند ثبت‌شده`;
    }

    if (employees.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
            <div style="font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem;">هنوز کارمندی تعریف نشده است</div>
            <div style="font-size: 0.82rem;">از فرم بالا برای ثبت اولین کارمند و صدور دسترسی محرمانه استفاده نمایید.</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = employees.map(emp => {
      const pCount = allProjects.filter(p => p.employeeEmail === emp.email).length;
      const initialLetter = emp.name.trim().charAt(0) || 'E';
      return `
        <tr data-emp-id="${emp.id}">
          <td>
            <div class="emp-avatar-cell">
              <div class="emp-avatar-badge">${initialLetter}</div>
              <div>
                <div style="font-weight: 700; color: var(--color-primary-900);">${emp.name}</div>
                <div style="font-size: 0.74rem; color: #64748b;" dir="ltr">${emp.empCode || 'EMP-0000'} • ${emp.department}</div>
              </div>
            </div>
          </td>
          <td><span dir="ltr" style="font-weight: 600; color: #1e293b;">${emp.email}</span></td>
          <td><span dir="ltr" style="color: #475569;">${emp.phone}</span></td>
          <td>
            <div class="emp-pwd-masked">
              <span class="pwd-text" data-actual-pwd="${emp.password}">••••••••</span>
              <button type="button" class="btn-icon-xs toggle-single-pwd" title="نمایش/مخفی‌سازی رمز">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="7" r="3"></circle>
                </svg>
              </button>
              <button type="button" class="btn-icon-xs copy-credentials-btn" data-email="${emp.email}" data-pwd="${emp.password}" title="کپی مشخصات ورود">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </td>
          <td><span class="badge-present-done" style="font-size: 0.78rem;">${pCount} پروژه</span></td>
          <td><span class="badge-present-active" style="font-size: 0.76rem;">فعال ✓</span></td>
          <td>
            <div class="vault-actions-cell">
              <button type="button" class="btn-action-view open-emp-profile-btn" data-emp-email="${emp.email}" title="ورود به پرتال این کارمند">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                <span>ورود به پرتال</span>
              </button>
              <button type="button" class="btn-action-edit edit-emp-btn" data-emp-id="${emp.id}" title="ویرایش اطلاعات کارمند (ویژه مدیر)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>ویرایش</span>
              </button>
              <button type="button" class="btn-action-del delete-emp-btn" data-emp-id="${emp.id}" data-emp-name="${emp.name}" title="حذف دسترسی کارمند">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>حذف</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    bindTableInteractions();
  };

  const bindTableInteractions = () => {
    // ۱. نمایش رمز تکی
    document.querySelectorAll('.toggle-single-pwd').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const wrap = e.currentTarget.closest('.emp-pwd-masked');
        const span = wrap.querySelector('.pwd-text');
        const actual = span.getAttribute('data-actual-pwd');
        if (span.textContent === '••••••••') {
          span.textContent = actual;
          span.style.color = '#1d4ed8';
          span.style.fontWeight = 'bold';
        } else {
          span.textContent = '••••••••';
          span.style.color = '#64748b';
          span.style.fontWeight = 'normal';
        }
      });
    });

    // ۲. کپی مشخصات ورود
    document.querySelectorAll('.copy-credentials-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-email');
        const pwd = e.currentTarget.getAttribute('data-pwd');
        const text = `اطلاعات ورود به پرتال کارمندان:\nنام کاربری: ${email}\nرمز عبور: ${pwd}`;
        navigator.clipboard.writeText(text).then(() => {
          alert('مشخصات ورود کارمند در کلیپ‌بورد کپی گردید.');
        }).catch(() => {
          prompt('مشخصات ورود کارمند:', text);
        });
      });
    });

    // ۳. ورود مستقیم به عنوان کارمند
    document.querySelectorAll('.open-emp-profile-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const email = e.currentTarget.getAttribute('data-emp-email');
        const employees = getStoredEmployees();
        const target = employees.find(em => em.email === email);
        if (target) {
          sessionStorage.setItem('portalEmployeeUser', JSON.stringify(target));
          window.location.href = 'employee-profile.html';
        }
      });
    });

    // ۴. ویرایش مشخصات کارمند توسط مدیر (مودال اختصاصی)
    document.querySelectorAll('.edit-emp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-emp-id');
        const employees = getStoredEmployees();
        const emp = employees.find(em => em.id === id);
        const editModal = document.getElementById('editEmployeeModal');
        if (!emp || !editModal) return;

        const editIdEl = document.getElementById('editEmpId');
        const editNameEl = document.getElementById('editEmpName');
        const editEmailEl = document.getElementById('editEmpEmail');
        const editPhoneEl = document.getElementById('editEmpPhone');
        const editPwdEl = document.getElementById('editEmpPassword');
        const editDeptEl = document.getElementById('editEmpDept');
        const editCodeEl = document.getElementById('editEmpCode');

        if (editIdEl) editIdEl.value = emp.id;
        if (editNameEl) editNameEl.value = emp.name || '';
        if (editEmailEl) editEmailEl.value = emp.email || '';
        if (editPhoneEl) editPhoneEl.value = emp.phone || '';
        if (editPwdEl) editPwdEl.value = emp.password || '';
        if (editDeptEl) editDeptEl.value = emp.department || 'توسعه و برنامه‌نویسی نرم‌افزار';
        if (editCodeEl) editCodeEl.value = emp.empCode || '';

        editModal.style.display = 'flex';
      });
    });

    // ۵. حذف کارمند
    document.querySelectorAll('.delete-emp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-emp-id');
        const name = e.currentTarget.getAttribute('data-emp-name');
        if (confirm(`آیا از لغو دسترسی و حذف کارمند «${name}» اطمینان دارید؟`)) {
          let list = getStoredEmployees();
          list = list.filter(em => em.id !== id);
          saveStoredEmployees(list);
          renderEmployeesTable();
          renderAdminAllProjectsTable();
        }
      });
    });
  };

  // رویدادهای مودال ویرایش اطلاعات کارمند
  const editModal = document.getElementById('editEmployeeModal');
  const editForm = document.getElementById('editEmployeeForm');
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const cancelEditModalBtn = document.getElementById('cancelEditModalBtn');

  const closeEditModal = () => {
    if (editModal) editModal.style.display = 'none';
  };

  if (closeEditModalBtn) closeEditModalBtn.addEventListener('click', closeEditModal);
  if (cancelEditModalBtn) cancelEditModalBtn.addEventListener('click', closeEditModal);

  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) {
        closeEditModal();
      }
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('editEmpId')?.value;
      const name = document.getElementById('editEmpName')?.value.trim();
      const email = document.getElementById('editEmpEmail')?.value.trim();
      const phone = document.getElementById('editEmpPhone')?.value.trim();
      const password = document.getElementById('editEmpPassword')?.value.trim();
      const department = document.getElementById('editEmpDept')?.value;
      const empCode = document.getElementById('editEmpCode')?.value.trim();

      if (!name || !email || !phone || !password) {
        alert('لطفاً فیلدهای ستاره‌دار الزامی (نام، ایمیل، شماره تماس و رمز عبور) را تکمیل فرمایید.');
        return;
      }

      let list = getStoredEmployees();
      const targetIndex = list.findIndex(em => em.id === id);
      if (targetIndex === -1) {
        alert('اطلاعات کارمند مورد نظر یافت نشد.');
        return;
      }

      const oldEmail = list[targetIndex].email;

      list[targetIndex] = {
        ...list[targetIndex],
        name,
        email,
        phone,
        password,
        department,
        empCode: empCode || list[targetIndex].empCode
      };

      saveStoredEmployees(list);

      // در صورت تغییر ایمیل یا نام، پروژه‌های ثبت‌شده توسط این کارمند نیز هماهنگ شوند
      if (oldEmail !== email || list[targetIndex].name !== name) {
        let projects = getStoredProjects();
        projects = projects.map(p => {
          if (p.employeeEmail === oldEmail) {
            return { ...p, employeeEmail: email, employeeName: name };
          }
          return p;
        });
        saveStoredProjects(projects);
      }

      closeEditModal();
      renderEmployeesTable();
      renderAdminAllProjectsTable();
      alert(`اطلاعات کارمند «${name}» با موفقیت توسط مدیریت ویرایش و ذخیره گردید.`);
    });
  }

  // تولید رمز عبور تصادفی امن
  if (btnGenPwd && empPwdInput) {
    btnGenPwd.addEventListener('click', () => {
      const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$';
      let gen = '';
      for (let i = 0; i < 8; i++) {
        gen += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      empPwdInput.type = 'text';
      empPwdInput.value = gen;
    });
  }

  if (btnTogglePwd && empPwdInput) {
    btnTogglePwd.addEventListener('click', () => {
      empPwdInput.type = (empPwdInput.type === 'password') ? 'text' : 'password';
    });
  }

  // ثبت کارمند جدید
  if (createForm) {
    createForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('empFullName')?.value.trim();
      const email = document.getElementById('empEmail')?.value.trim();
      const phone = document.getElementById('empPhone')?.value.trim();
      const password = document.getElementById('empPassword')?.value.trim();
      const department = document.getElementById('empDepartment')?.value || 'فناوری اطلاعات';
      let empCode = document.getElementById('empCode')?.value.trim();

      if (!name || !email || !phone || !password) {
        alert('لطفاً فیلدهای ستاره‌دار الزامی (نام، ایمیل، تلفن و رمز عبور) را وارد نمایید.');
        return;
      }

      const list = getStoredEmployees();
      if (list.some(em => em.email.toLowerCase() === email.toLowerCase())) {
        alert('کارمندی با این پست الکترونیک از قبل ثبت شده است.');
        return;
      }

      if (!empCode) {
        empCode = 'EMP-' + Math.floor(1000 + Math.random() * 9000);
      }

      const now = new Date();
      const jalaliDate = '۱۴۰۵/۰۷/' + String(now.getDate()).padStart(2, '۰');

      const newEmp = {
        id: 'emp_' + Date.now(),
        name,
        email,
        phone,
        password,
        empCode,
        department,
        createdAt: jalaliDate,
        status: 'فعال'
      };

      list.unshift(newEmp);
      saveStoredEmployees(list);
      renderEmployeesTable();
      createForm.reset();

      alert(`کارمند گرامی «${name}» با موفقیت تعریف شد.\n\nنام کاربری (ایمیل): ${email}\nرمز عبور: ${password}\n\nاطلاعات به عنوان سند محرمانه با موفقیت ذخیره شد.`);
    });
  }

  // پشتیبان‌گیری امن JSON
  if (btnExportBackup) {
    btnExportBackup.addEventListener('click', () => {
      const data = {
        exportDate: new Date().toISOString(),
        employees: getStoredEmployees(),
        projects: getStoredProjects()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `company_confidential_vault_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // خروج از حساب مدیریت
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('آیا از خروج از پنل مدیریت اطمینان دارید؟')) {
        sessionStorage.removeItem('portalAdminUser');
        window.location.href = 'login.html';
      }
    });
  }

  // ۲. مرکز پروژه‌ها و قراردادهای مدیریت و نظارت عالیه بر کل پروژه‌های شرکت (Super Admin)
  const initManagerProjectCenter = () => {
    const mgrMilestoneContainer = document.getElementById('mgrMilestoneInputsList');
    const btnMgrAddStage = document.getElementById('btnMgrAddStage');
    const mgrProjectForm = document.getElementById('managerNewProjectForm');
    const mgrProjectsListContainer = document.getElementById('managerProjectsContainer');
    const adminAllProjectsTbody = document.getElementById('adminAllProjectsTableBody');
    const btnClearAllProjects = document.getElementById('btnAdminClearAllProjects');

    // ۲.۱. راه‌اندازی مراحل پیش‌فرض قرارداد برای مدیر
    const defaultMgrStages = [
      '۱. نیازسنجی، تدوین پیش‌نویس قرارداد و برآورد بودجه',
      '۲. اخذ تاییدیه و تصویب رسمی قرارداد با کارفرما',
      '۳. تشکیل کارگروه اجرایی و آغاز فازهای عملیاتی',
      '۴. نظارت دوره‌ای، پایش شاخص‌های کلیدی و کنترل کیفیت',
      '۵. تحویل نهایی خروجی‌ها، تسویه‌حساب و پایان تعهدات'
    ];

    const renderMgrMilestoneInputs = () => {
      if (!mgrMilestoneContainer) return;
      mgrMilestoneContainer.innerHTML = defaultMgrStages.map(stg => `
        <div class="milestone-input-row">
          <input type="text" class="vault-input mgr-milestone-stage-input" value="${stg}" required>
          <button type="button" class="btn-remove-stage btn-mgr-remove-stage" title="حذف این مرحله">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      `).join('');

      attachMgrRemoveBtns();
    };

    const attachMgrRemoveBtns = () => {
      if (!mgrMilestoneContainer) return;
      mgrMilestoneContainer.querySelectorAll('.btn-mgr-remove-stage').forEach(btn => {
        btn.onclick = (e) => {
          const rows = mgrMilestoneContainer.querySelectorAll('.milestone-input-row');
          if (rows.length > 1) {
            e.currentTarget.closest('.milestone-input-row').remove();
          } else {
            alert('پروژه باید حداقل دارای یک مرحله اجرایی باشد.');
          }
        };
      });
    };

    if (btnMgrAddStage && mgrMilestoneContainer) {
      btnMgrAddStage.addEventListener('click', () => {
        const count = mgrMilestoneContainer.querySelectorAll('.milestone-input-row').length + 1;
        const row = document.createElement('div');
        row.className = 'milestone-input-row';
        row.innerHTML = `
          <input type="text" class="vault-input mgr-milestone-stage-input" placeholder="مرحله ${count}: شرح اقدام اجرایی" required>
          <button type="button" class="btn-remove-stage btn-mgr-remove-stage" title="حذف این مرحله">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        `;
        mgrMilestoneContainer.appendChild(row);
        attachMgrRemoveBtns();
      });
    }

    renderMgrMilestoneInputs();

    // ۲.۲. ثبت پروژه جدید توسط مدیر با اعتبارسنجی الزامی بودن همه فیلدها
    if (mgrProjectForm) {
      mgrProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('mgrProjTitle')?.value.trim();
        const clientName = document.getElementById('mgrProjClientName')?.value.trim();
        const contractNo = document.getElementById('mgrProjContractNo')?.value.trim();
        const contractDate = document.getElementById('mgrProjContractDate')?.value.trim();
        const contractAmount = document.getElementById('mgrProjContractAmount')?.value.trim();
        const contractScope = document.getElementById('mgrProjContractScope')?.value.trim();

        if (!title || !clientName || !contractNo || !contractDate || !contractAmount || !contractScope) {
          alert('تمامی فیلدهای قرارداد مدیریت (عنوان پروژه، نام کارفرما، شماره قرارداد، تاریخ انعقاد، مبلغ قرارداد و شرح تعهدات) الزامی می‌باشند. لطفاً همه فیلدها را کامل نمایید.');
          return;
        }

        const stageInputs = mgrMilestoneContainer ? mgrMilestoneContainer.querySelectorAll('.mgr-milestone-stage-input') : [];
        const stages = [];
        stageInputs.forEach((inp, idx) => {
          const val = inp.value.trim();
          if (val) {
            stages.push({
              id: 'stg_mgr_' + idx + '_' + Date.now(),
              title: val,
              completed: false,
              completedAt: '',
              note: ''
            });
          }
        });

        if (stages.length === 0) {
          alert('لطفاً حداقل یک مرحله اجرایی برای پروژه تعریف نمایید.');
          return;
        }

        const allProjects = getStoredProjects();
        const newMgrProject = {
          id: 'proj_mgr_' + Date.now(),
          employeeEmail: 'amir@company.ir',
          employeeName: 'امیرحسین برزگر (مدیریت)',
          title,
          clientName,
          contractNo,
          contractDate,
          contractAmount,
          contractScope,
          createdAt: '۱۴۰۵/۰۷/۲۰',
          stages
        };

        allProjects.unshift(newMgrProject);
        saveStoredProjects(allProjects);

        mgrProjectForm.reset();
        renderMgrMilestoneInputs();
        renderManagerProjects();
        renderAdminAllProjectsTable();
        renderEmployeesTable();

        alert(`پروژه و قرارداد مدیریتی «${title}» با کارفرما «${clientName}» با موفقیت ثبت شد و در لیست پروژه‌ها قرار گرفت.`);
      });
    }

    // ۲.۳. رندر پروژه‌های در حال اجرای مدیر (با نوار پیشرفت، چک‌باکس‌ها، یادداشت‌ها)
    const renderManagerProjects = () => {
      if (!mgrProjectsListContainer) return;
      const allProjects = getStoredProjects();
      const mgrProjects = allProjects.filter(p => p.employeeEmail === 'amir@company.ir');

      if (mgrProjects.length === 0) {
        mgrProjectsListContainer.innerHTML = `
          <div class="profile-card" style="text-align: center; padding: 2.5rem 1.5rem; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: var(--radius-xl);">
            <div style="font-size: 1rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">هنوز پروژه‌ای برای مدیریت ثبت نشده است</div>
            <div style="font-size: 0.82rem; color: #64748b;">از فرم بالا برای ثبت قرارداد و پروژه‌های اختصاصی مدیریت استفاده فرمایید.</div>
          </div>
        `;
        return;
      }

      mgrProjectsListContainer.innerHTML = mgrProjects.map(proj => {
        const totalStages = proj.stages.length;
        const completedStages = proj.stages.filter(s => s.completed).length;
        const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

        let fillClass = 'fill-amber';
        if (percent >= 100) fillClass = 'fill-green';
        else if (percent > 30) fillClass = 'fill-blue';

        const isFullyDone = percent === 100;
        const isExpanded = expandedProjectIds.has(proj.id);

        return `
          <div class="project-card ${isExpanded ? '' : 'is-collapsed'}" data-proj-id="${proj.id}">
            <div class="project-card-header">
              <div>
                <h3 class="project-title">${proj.title}</h3>
                <div class="project-meta-pills">
                  <span class="project-meta-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>کارفرما: <strong>${proj.clientName}</strong></span>
                  </span>
                  <span class="project-meta-pill">
                    <span>شماره قرارداد: <strong>${proj.contractNo}</strong></span>
                  </span>
                  <span class="project-meta-pill">
                    <span>تاریخ انعقاد: ${proj.contractDate}</span>
                  </span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                ${isFullyDone ? `
                  <span class="badge-present-done" style="background: #ecfdf5; color: #047857; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                    تکمیل ۱۰۰٪ ✓
                  </span>
                ` : `
                  <span class="badge-overtime" style="background: #eff6ff; color: #1d4ed8; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                    ${percent}٪ در حال اجرا
                  </span>
                `}
                <button type="button" class="btn-toggle-project-details" data-proj-id="${proj.id}" title="نمایش یا بستن جزئیات و مراحل پروژه">
                  <span>${isExpanded ? 'بستن جزئیات ▴' : 'مشاهده و مدیریت مراحل ▾'}</span>
                  <svg class="toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <button type="button" class="btn-action-del delete-mgr-proj-btn" data-proj-id="${proj.id}" title="حذف این پروژه">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  <span>حذف</span>
                </button>
              </div>
            </div>

            <!-- بدنه جزئیات و مراحل پروژه (در حالت پیش‌فرض بسته جهت جلوگیری از اشغال فضا) -->
            <div class="project-card-body">
              <!-- آکاردئون جزئیات قرارداد مدیریت -->
              <div class="contract-details-box">
                <div class="contract-details-header" onclick="this.nextElementSibling.classList.toggle('is-hidden')">
                  <span style="font-weight: 700; color: #1e293b; font-size: 0.86rem; display: flex; align-items: center; gap: 0.4rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    <span>مشاهده مفاد قرارداد و تعهدات توافق‌شده</span>
                  </span>
                  <span style="font-size: 0.78rem; color: #1d4ed8;">نمایش / بستن ▾</span>
                </div>
                <div class="contract-grid-info">
                  <div><strong>ارزش و مبلغ قرارداد:</strong> ${proj.contractAmount}</div>
                  <div><strong>شناسه ثبتی قرارداد:</strong> ${proj.contractNo}</div>
                  <div style="grid-column: 1 / -1;"><strong>شرح موضوع و تعهدات:</strong> ${proj.contractScope}</div>
                </div>
              </div>

              <!-- نوار پیشرفت زنده مدیریت -->
              <div class="project-progress-section">
                <div class="progress-info-row">
                  <span class="progress-label">
                    <span>پیشرفت گام‌های پروژه مدیریت:</span>
                    <span style="color: #64748b; font-weight: normal; font-size: 0.82rem; margin-right: 0.4rem;">
                      (${completedStages} از ${totalStages} فاز انجام شده)
                    </span>
                  </span>
                  <span class="progress-percent-display">${percent}٪</span>
                </div>
                <div class="project-progress-track">
                  <div class="project-progress-fill ${fillClass}" style="width: ${percent}%;"></div>
                </div>
                ${isFullyDone ? `
                  <div class="project-completed-banner">
                    <span>🎉 تمامی مراحل این پروژه با موفقیت ۱۰۰٪ به اتمام رسید.</span>
                    <span>گزارش نهایی تکمیل گردید ✓</span>
                  </div>
                ` : ''}
              </div>

              <!-- چک‌لیست مراحل و یادداشت‌ها -->
              <div>
                <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>مراحل اجرایی پروژه مدیریت (تیک‌زدن فازهای انجام‌شده):</span>
                </h4>

                <div class="milestones-checklist">
                  ${proj.stages.map(stage => `
                    <div class="milestone-item ${stage.completed ? 'is-completed' : ''}" data-stage-id="${stage.id}">
                      <div class="milestone-header-row">
                        <input type="checkbox" class="mgr-milestone-checkbox" ${stage.completed ? 'checked' : ''} data-proj-id="${proj.id}" data-stage-id="${stage.id}">
                        <div class="milestone-content">
                          <span class="milestone-title-text">${stage.title}</span>
                          ${stage.completed && stage.completedAt ? `
                            <div class="milestone-completed-time">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                              </svg>
                              <span>تایید و انجام در: ${stage.completedAt}</span>
                            </div>
                          ` : ''}

                          <div class="milestone-notes-wrap">
                            ${stage.note ? `
                              <div class="milestone-saved-note-text">
                                <strong>یادداشت مدیر:</strong> ${stage.note}
                              </div>
                            ` : ''}

                            <form class="mgr-milestone-note-form" data-proj-id="${proj.id}" data-stage-id="${stage.id}">
                              <input type="text" class="milestone-note-input" placeholder="ثبت توضیحات یا صورت‌جلسه این فاز..." value="${stage.note || ''}">
                              <button type="submit" class="btn-save-note">ذخیره یادداشت</button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      bindMgrProjectsInteractions();
    };

    const bindMgrProjectsInteractions = () => {
      // باز و بسته کردن کارت پروژه مدیریت (Accordion Toggle)
      document.querySelectorAll('#managerProjectsContainer .btn-toggle-project-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const projId = e.currentTarget.getAttribute('data-proj-id');
          const card = e.currentTarget.closest('.project-card');
          const span = e.currentTarget.querySelector('span');
          if (card.classList.contains('is-collapsed')) {
            card.classList.remove('is-collapsed');
            expandedProjectIds.add(projId);
            if (span) span.textContent = 'بستن جزئیات ▴';
          } else {
            card.classList.add('is-collapsed');
            expandedProjectIds.delete(projId);
            if (span) span.textContent = 'مشاهده و مدیریت مراحل ▾';
          }
        });
      });

      // تیک‌زدن مراحل پروژه مدیر
      document.querySelectorAll('.mgr-milestone-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const projId = e.currentTarget.getAttribute('data-proj-id');
          const stageId = e.currentTarget.getAttribute('data-stage-id');
          const isChecked = e.currentTarget.checked;

          const allProjects = getStoredProjects();
          const proj = allProjects.find(p => p.id === projId);
          if (!proj) return;

          const stage = proj.stages.find(s => s.id === stageId);
          if (!stage) return;

          stage.completed = isChecked;
          if (isChecked) {
            const now = new Date();
            stage.completedAt = '۱۴۰۵/۰۷/' + String(now.getDate()).padStart(2, '۰') + ' - ' + String(now.getHours()).padStart(2, '۰') + ':' + String(now.getMinutes()).padStart(2, '۰');
          } else {
            stage.completedAt = '';
          }

          saveStoredProjects(allProjects);
          renderManagerProjects();
          renderAdminAllProjectsTable();
        });
      });

      // ذخیره یادداشت مدیر
      document.querySelectorAll('.mgr-milestone-note-form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const projId = e.currentTarget.getAttribute('data-proj-id');
          const stageId = e.currentTarget.getAttribute('data-stage-id');
          const noteInput = e.currentTarget.querySelector('.milestone-note-input');
          const noteVal = noteInput?.value.trim() || '';

          const allProjects = getStoredProjects();
          const proj = allProjects.find(p => p.id === projId);
          if (!proj) return;

          const stage = proj.stages.find(s => s.id === stageId);
          if (!stage) return;

          stage.note = noteVal;
          saveStoredProjects(allProjects);
          renderManagerProjects();
          alert('یادداشت مرحله پروژه با موفقیت ثبت شد.');
        });
      });

      // حذف پروژه مدیر
      document.querySelectorAll('.delete-mgr-proj-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const projId = e.currentTarget.getAttribute('data-proj-id');
          if (confirm('آیا از حذف این پروژه مدیریتی اطمینان دارید؟')) {
            let allProjects = getStoredProjects();
            allProjects = allProjects.filter(p => p.id !== projId);
            saveStoredProjects(allProjects);
            renderManagerProjects();
            renderAdminAllProjectsTable();
            renderEmployeesTable();
          }
        });
      });
    };

    // ۲.۴. نظارت عالیه و جدول کلیه پروژه‌های شرکت با امکان حذف هر پروژه توسط مدیر (Super Admin)
    const renderAdminAllProjectsTable = () => {
      if (!adminAllProjectsTbody) return;
      const allProjects = getStoredProjects();

      if (allProjects.length === 0) {
        adminAllProjectsTbody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 2.5rem 1rem; color: #64748b;">
              <div style="font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem;">هیچ پروژه‌ای در سامانه موجود نیست</div>
              <div style="font-size: 0.82rem;">تمامی پروژه‌های ایجادشده توسط مدیر و کارمندان در این جدول قابل پایش و مدیریت هستند.</div>
            </td>
          </tr>
        `;
        return;
      }

      adminAllProjectsTbody.innerHTML = allProjects.map(proj => {
        const totalStages = proj.stages?.length || 0;
        const completedStages = proj.stages?.filter(s => s.completed).length || 0;
        const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

        let badgeStyle = 'background: #eff6ff; color: #1d4ed8;';
        if (percent >= 100) badgeStyle = 'background: #ecfdf5; color: #047857;';
        else if (percent === 0) badgeStyle = 'background: #f8fafc; color: #64748b;';

        const isManager = proj.employeeEmail === 'amir@company.ir';

        return `
          <tr data-proj-id="${proj.id}">
            <td>
              <strong style="color: var(--color-primary-900);">${proj.title}</strong>
            </td>
            <td>
              <div style="font-size: 0.86rem; font-weight: 700; color: ${isManager ? '#1d4ed8' : '#0f172a'};">
                ${proj.employeeName || 'کارمند'}
              </div>
              <div style="font-size: 0.76rem; color: #64748b;" dir="ltr">${proj.employeeEmail}</div>
            </td>
            <td><strong>${proj.clientName}</strong></td>
            <td><span dir="ltr" style="font-family: monospace; font-weight: 600;">${proj.contractNo}</span></td>
            <td>
              <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 130px;">
                <div style="flex: 1; height: 8px; background: #e2e8f0; border-radius: 999px; overflow: hidden;">
                  <div style="width: ${percent}%; height: 100%; background: ${percent >= 100 ? '#10b981' : '#2563eb'}; border-radius: 999px;"></div>
                </div>
                <span style="font-size: 0.78rem; font-weight: 800; padding: 0.15rem 0.45rem; border-radius: var(--radius-sm); ${badgeStyle}">
                  ${percent}٪
                </span>
              </div>
            </td>
            <td><span style="font-size: 0.82rem; color: #64748b;">${proj.contractDate || proj.createdAt || '۱۴۰۵/۰۷/۲۰'}</span></td>
            <td>
              <button type="button" class="btn-action-del btn-admin-del-proj" data-proj-id="${proj.id}" data-proj-title="${proj.title}" data-creator="${proj.employeeName}" title="حذف این پروژه توسط مدیر ارشد">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>حذف پروژه</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');

      // اتصال دکمه حذف نظارت عالیه
      adminAllProjectsTbody.querySelectorAll('.btn-admin-del-proj').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const projId = e.currentTarget.getAttribute('data-proj-id');
          const title = e.currentTarget.getAttribute('data-proj-title');
          const creator = e.currentTarget.getAttribute('data-creator');

          if (confirm(`هشدار مدیریت ارشد:\nآیا از حذف پروژه «${title}» متعلق به «${creator}» اطمینان دارید؟ این عملیات قابل بازگشت نیست.`)) {
            let all = getStoredProjects();
            all = all.filter(p => p.id !== projId);
            saveStoredProjects(all);
            renderAdminAllProjectsTable();
            renderManagerProjects();
            renderEmployeesTable();
            alert(`پروژه «${title}» با موفقیت توسط مدیریت حذف گردید.`);
          }
        });
      });
    };

    // ۲.۵. دکمه پاکسازی تمام پروژه‌های سامانه توسط مدیر ارشد
    if (btnClearAllProjects) {
      btnClearAllProjects.addEventListener('click', () => {
        const all = getStoredProjects();
        if (all.length === 0) {
          alert('هیچ پروژه‌ای در سامانه برای پاکسازی وجود ندارد.');
          return;
        }

        if (confirm(`هشدار فوق‌العاده حساس:\nآیا از پاکسازی و حذف کامل تمامی ${all.length} پروژه ثبت‌شده در شرکت اطمینان دارید؟\nتمامی داده‌های پروژه‌ها و قراردادها پاک خواهند شد.`)) {
          saveStoredProjects([]);
          renderAdminAllProjectsTable();
          renderManagerProjects();
          renderEmployeesTable();
          alert('تمامی پروژه‌های سامانه با موفقیت پاکسازی شدند.');
        }
      });
    }

    renderManagerProjects();
    renderAdminAllProjectsTable();
  };

  // فراخوانی راه‌اندازی مرکز پروژه‌ها و نظارت ارشد
  initManagerProjectCenter();

  // رندر اولیه جدول کارمندان
  renderEmployeesTable();
}

/* ==========================================================================
   ۸. پرتال کارمند: ثبت قراردادها، تیک زدن مراحل، یادداشت‌ها و نوار پیشرفت زنده
   ========================================================================== */
function initEmployeeProfilePortal() {
  const profileContainer = document.getElementById('employeeProfileApp');
  if (!profileContainer) return;

  // بازیابی اطلاعات کارمند لاگین‌شده
  let currentEmp = null;
  try {
    const raw = sessionStorage.getItem('portalEmployeeUser');
    if (raw) currentEmp = JSON.parse(raw);
  } catch (e) {
    currentEmp = null;
  }

  // اگر کاربری لاگین نکرده بود، جهت پیش‌نمایش اولین کارمند مخزن را انتخاب می‌کنیم یا به لاگین هدایت می‌کنیم
  if (!currentEmp) {
    const employees = getStoredEmployees();
    if (employees.length > 0) {
      currentEmp = employees[0];
      sessionStorage.setItem('portalEmployeeUser', JSON.stringify(currentEmp));
    } else {
      window.location.href = 'login.html';
      return;
    }
  }

  // مقداردهی مشخصات در هدر و سایدبار
  renderEmployeeProfileHeader(currentEmp);

  // راه‌اندازی مراحل فرم ثبت پروژه
  initMilestonesFormBuilder();

  // اتصال فرم ثبت پروژه و قرارداد جدید
  const contractForm = document.getElementById('newProjectContractForm');
  if (contractForm) {
    contractForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('projTitle')?.value.trim();
      const clientName = document.getElementById('projClientName')?.value.trim();
      const contractNo = document.getElementById('projContractNo')?.value.trim();
      const contractDate = document.getElementById('projContractDate')?.value.trim();
      const contractAmount = document.getElementById('projContractAmount')?.value.trim();
      const contractScope = document.getElementById('projContractScope')?.value.trim();

      if (!title || !clientName || !contractNo || !contractDate || !contractAmount || !contractScope) {
        alert('تمامی فیلدهای قرارداد (عنوان پروژه، نام کارفرما، شماره قرارداد، تاریخ انعقاد، مبلغ قرارداد و شرح تعهدات) الزامی می‌باشند. لطفاً همه فیلدها را به طور کامل تکمیل فرمایید.');
        return;
      }

      // جمع‌آوری فازها و مراحل تعریف‌شده
      const stageInputs = document.querySelectorAll('.milestone-stage-input');
      const stages = [];
      stageInputs.forEach((inp, idx) => {
        const text = inp.value.trim();
        if (text) {
          stages.push({
            id: 'stg_' + idx + '_' + Date.now(),
            title: text,
            completed: false,
            completedAt: '',
            note: ''
          });
        }
      });

      if (stages.length === 0) {
        alert('لطفاً حداقل یک مرحله اجرایی برای پروژه تعریف نمایید.');
        return;
      }

      const allProjects = getStoredProjects();
      const newProject = {
        id: 'proj_' + Date.now(),
        employeeEmail: currentEmp.email,
        employeeName: currentEmp.name,
        title,
        clientName,
        contractNo: contractNo || `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
        contractDate: contractDate || '۱۴۰۵/۰۷/۲۰',
        contractAmount: contractAmount || 'توافقی',
        contractScope: contractScope || 'تعهدات اجرایی طبق مفاد توافق‌شده با کارفرما',
        createdAt: '۱۴۰۵/۰۷/۲۰',
        stages
      };

      allProjects.unshift(newProject);
      saveStoredProjects(allProjects);

      contractForm.reset();
      renderEmployeeProjectsList(currentEmp.email);
      updateProfileStrengthAndStats(currentEmp.email);

      alert(`قرارداد و پروژه جدید «${title}» با کارفرما «${clientName}» با موفقیت ثبت شد و آماده انجام مراحل گردید.`);
    });
  }

  // رندر پروژه‌ها و آمار
  renderEmployeeProjectsList(currentEmp.email);
  updateProfileStrengthAndStats(currentEmp.email);

  // دکمه خروج
  const empLogoutBtn = document.getElementById('empLogoutBtn');
  if (empLogoutBtn) {
    empLogoutBtn.addEventListener('click', () => {
      if (confirm('آیا از خروج از حساب کاربری اطمینان دارید؟')) {
        sessionStorage.removeItem('portalEmployeeUser');
        window.location.href = 'login.html';
      }
    });
  }
}

// نمایش اطلاعات هویتی کارمند در پروفایل
function renderEmployeeProfileHeader(emp) {
  const nameEls = document.querySelectorAll('.emp-render-name');
  const emailEls = document.querySelectorAll('.emp-render-email');
  const phoneEls = document.querySelectorAll('.emp-render-phone');
  const codeEls = document.querySelectorAll('.emp-render-code');
  const deptEls = document.querySelectorAll('.emp-render-dept');
  const avatarEls = document.querySelectorAll('.emp-render-avatar');

  nameEls.forEach(el => el.textContent = emp.name);
  emailEls.forEach(el => el.textContent = emp.email);
  phoneEls.forEach(el => el.textContent = emp.phone);
  codeEls.forEach(el => el.textContent = emp.empCode || 'EMP-2041');
  deptEls.forEach(el => el.textContent = emp.department || 'دپارتمان تخصصی');
  avatarEls.forEach(el => el.textContent = emp.name.trim().charAt(0) || 'E');
}

// مدیریت مراحل در فرم ثبت پروژه (امکان افزودن/حذف مرحله)
function initMilestonesFormBuilder() {
  const container = document.getElementById('milestoneInputsList');
  const addBtn = document.getElementById('btnAddStageInput');
  if (!container || !addBtn) return;

  const defaultStages = [
    '۱. نیازسنجی، تدوین RFP و پیش‌پرداخت قرارداد',
    '۲. طراحی پروتوتایپ و معماری اولیه و تایید کارفرما',
    '۳. پیاده‌سازی و کدنویسی فازهای اصلی پروژه',
    '۴. تست یکپارچگی، بازبینی با کارفرما و رفع نواقص',
    '۵. تحویل نهایی به کارفرما، تسویه‌حساب و مستندسازی'
  ];

  container.innerHTML = defaultStages.map((stg) => `
    <div class="milestone-input-row">
      <input type="text" class="vault-input milestone-stage-input" value="${stg}" required>
      <button type="button" class="btn-remove-stage" title="حذف این مرحله">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `).join('');

  const attachRemoveBtns = () => {
    container.querySelectorAll('.btn-remove-stage').forEach(b => {
      b.onclick = (e) => {
        const rows = container.querySelectorAll('.milestone-input-row');
        if (rows.length > 1) {
          e.currentTarget.closest('.milestone-input-row').remove();
        } else {
          alert('پروژه باید حداقل دارای یک مرحله باشد.');
        }
      };
    });
  };
  attachRemoveBtns();

  addBtn.onclick = () => {
    const currentCount = container.querySelectorAll('.milestone-input-row').length + 1;
    const div = document.createElement('div');
    div.className = 'milestone-input-row';
    div.innerHTML = `
      <input type="text" class="vault-input milestone-stage-input" placeholder="مرحله ${currentCount}: عنوان مرحله اجرایی" required>
      <button type="button" class="btn-remove-stage" title="حذف این مرحله">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    container.appendChild(div);
    attachRemoveBtns();
  };
}

// رندر لیست پروژه‌ها، مراحل، چک‌باکس‌ها، یادداشت‌ها و نوار پیشرفت ۰ تا ۱۰۰٪
function renderEmployeeProjectsList(empEmail) {
  const container = document.getElementById('employeeProjectsContainer');
  const emptyState = document.getElementById('employeeEmptyState');
  if (!container) return;

  const allProjects = getStoredProjects();
  const empProjects = allProjects.filter(p => p.employeeEmail === empEmail);

  if (empProjects.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    container.innerHTML = '';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = empProjects.map(proj => {
    const totalStages = proj.stages.length;
    const completedStages = proj.stages.filter(s => s.completed).length;
    const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    let fillClass = 'fill-amber';
    if (percent >= 100) fillClass = 'fill-green';
    else if (percent > 30) fillClass = 'fill-blue';

    const isFullyDone = percent === 100;
    const isExpanded = expandedProjectIds.has(proj.id);

    return `
      <div class="project-card ${isExpanded ? '' : 'is-collapsed'}" data-proj-id="${proj.id}">
        <div class="project-card-header">
          <div>
            <h3 class="project-title">${proj.title}</h3>
            <div class="project-meta-pills">
              <span class="project-meta-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>کارفرما: <strong>${proj.clientName}</strong></span>
              </span>
              <span class="project-meta-pill">
                <span>شماره قرارداد: <strong>${proj.contractNo}</strong></span>
              </span>
              <span class="project-meta-pill">
                <span>تاریخ انعقاد: ${proj.contractDate}</span>
              </span>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            ${isFullyDone ? `
              <span class="badge-present-done" style="background: #ecfdf5; color: #047857; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                تکمیل ۱۰۰٪ ✓
              </span>
            ` : `
              <span class="badge-overtime" style="background: #eff6ff; color: #1d4ed8; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                ${percent}٪ در حال پیشرفت
              </span>
            `}
            <button type="button" class="btn-toggle-project-details" data-proj-id="${proj.id}" title="نمایش یا بستن جزئیات و مراحل پروژه">
              <span>${isExpanded ? 'بستن جزئیات ▴' : 'مشاهده و مدیریت مراحل ▾'}</span>
              <svg class="toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <button type="button" class="btn-action-del delete-proj-btn" data-proj-id="${proj.id}" title="حذف این پروژه">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
              <span>حذف</span>
            </button>
          </div>
        </div>

        <!-- بدنه جزئیات و مراحل پروژه (در حالت پیش‌فرض بسته جهت جلوگیری از اشغال فضا) -->
        <div class="project-card-body">
          <!-- آکاردئون جزئیات قرارداد با کارفرما -->
          <div class="contract-details-box">
            <div class="contract-details-header" onclick="this.nextElementSibling.classList.toggle('is-hidden')">
              <span style="font-weight: 700; color: #1e293b; font-size: 0.86rem; display: flex; align-items: center; gap: 0.4rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>مشاهده مفاد قرارداد و تعهدات کارفرما</span>
              </span>
              <span style="font-size: 0.78rem; color: #1d4ed8;">نمایش / بستن ▾</span>
            </div>
            <div class="contract-grid-info">
              <div><strong>ارزش / مبلغ قرارداد:</strong> ${proj.contractAmount}</div>
              <div><strong>شماره پیگیری قرارداد:</strong> ${proj.contractNo}</div>
              <div style="grid-column: 1 / -1;"><strong>مفاد و شرح توافقات:</strong> ${proj.contractScope}</div>
            </div>
          </div>

          <!-- نوار پیشرفت زنده پروژه (۰ تا ۱۰۰ درصد بر اساس تیک مراحل) -->
          <div class="project-progress-section">
            <div class="progress-info-row">
              <span class="progress-label">
                <span>نوار پیشرفت پیشبرد پروژه:</span>
                <span style="color: #64748b; font-weight: normal; font-size: 0.82rem; margin-right: 0.4rem;">
                  (${completedStages} از ${totalStages} مرحله انجام شده)
                </span>
              </span>
              <span class="progress-percent-display">${percent}٪</span>
            </div>
            <div class="project-progress-track">
              <div class="project-progress-fill ${fillClass}" style="width: ${percent}%;"></div>
            </div>

            ${isFullyDone ? `
              <div class="project-completed-banner">
                <span>🎉 تبریک! تمامی مراحل قرارداد با کارفرما با موفقیت ۱۰۰٪ تکمیل گردید.</span>
                <span>رتبه و کارنامه شما ارتقا یافت ✓</span>
              </div>
            ` : ''}
          </div>

          <!-- چک‌لیست مراحل انجام پروژه و یادداشت‌ها -->
          <div>
            <h4 style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.4rem;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>مراحل اجرایی پروژه (تیک‌زدن پس از انجام هر مرحله):</span>
            </h4>

            <div class="milestones-checklist">
              ${proj.stages.map((stage, stgIdx) => `
                <div class="milestone-item ${stage.completed ? 'is-completed' : ''}" data-stage-id="${stage.id}">
                  <div class="milestone-header-row">
                    <input type="checkbox" class="milestone-checkbox" ${stage.completed ? 'checked' : ''} data-proj-id="${proj.id}" data-stage-id="${stage.id}">
                    <div class="milestone-content">
                      <span class="milestone-title-text">${stage.title}</span>
                      ${stage.completed && stage.completedAt ? `
                        <div class="milestone-completed-time">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>انجام‌شده در: ${stage.completedAt}</span>
                        </div>
                      ` : ''}

                      <!-- بخش یادداشت مرحله -->
                      <div class="milestone-notes-wrap">
                        ${stage.note ? `
                          <div class="milestone-saved-note-text">
                            <strong>یادداشت مرحله:</strong> ${stage.note}
                          </div>
                        ` : ''}

                        <form class="milestone-note-form" data-proj-id="${proj.id}" data-stage-id="${stage.id}">
                          <input type="text" class="milestone-note-input" placeholder="یادداشت یا توضیحات این مرحله..." value="${stage.note || ''}">
                          <button type="submit" class="btn-save-note">ذخیره یادداشت</button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  bindProjectInteractions(empEmail);
}

// اتصال رویدادهای تیک زدن مراحل، یادداشت‌ها و حذف پروژه
function bindProjectInteractions(empEmail) {
  // ۰. باز و بسته کردن کارت پروژه (Accordion Toggle)
  document.querySelectorAll('#employeeProjectsContainer .btn-toggle-project-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projId = e.currentTarget.getAttribute('data-proj-id');
      const card = e.currentTarget.closest('.project-card');
      const span = e.currentTarget.querySelector('span');
      if (card.classList.contains('is-collapsed')) {
        card.classList.remove('is-collapsed');
        expandedProjectIds.add(projId);
        if (span) span.textContent = 'بستن جزئیات ▴';
      } else {
        card.classList.add('is-collapsed');
        expandedProjectIds.delete(projId);
        if (span) span.textContent = 'مشاهده و مدیریت مراحل ▾';
      }
    });
  });

  // ۱. رویداد تیک زدن چک‌باکس مرحله (محاسبه آنی نوار پیشرفت از ۰ تا ۱۰۰٪)
  document.querySelectorAll('.milestone-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      const projId = e.currentTarget.getAttribute('data-proj-id');
      const stageId = e.currentTarget.getAttribute('data-stage-id');
      const isChecked = e.currentTarget.checked;

      const allProjects = getStoredProjects();
      const proj = allProjects.find(p => p.id === projId);
      if (!proj) return;

      const stage = proj.stages.find(s => s.id === stageId);
      if (!stage) return;

      stage.completed = isChecked;
      if (isChecked) {
        const now = new Date();
        stage.completedAt = '۱۴۰۵/۰۷/' + String(now.getDate()).padStart(2, '۰') + ' - ' + String(now.getHours()).padStart(2, '۰') + ':' + String(now.getMinutes()).padStart(2, '۰');
      } else {
        stage.completedAt = '';
      }

      saveStoredProjects(allProjects);
      renderEmployeeProjectsList(empEmail);
      updateProfileStrengthAndStats(empEmail);
    });
  });

  // ۲. ثبت و به‌روزرسانی یادداشت برای هر مرحله
  document.querySelectorAll('.milestone-note-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const projId = e.currentTarget.getAttribute('data-proj-id');
      const stageId = e.currentTarget.getAttribute('data-stage-id');
      const noteInput = e.currentTarget.querySelector('.milestone-note-input');
      const noteVal = noteInput?.value.trim() || '';

      const allProjects = getStoredProjects();
      const proj = allProjects.find(p => p.id === projId);
      if (!proj) return;

      const stage = proj.stages.find(s => s.id === stageId);
      if (!stage) return;

      stage.note = noteVal;
      saveStoredProjects(allProjects);
      renderEmployeeProjectsList(empEmail);
      alert('یادداشت مرحله با موفقیت ثبت و ذخیره شد.');
    });
  });

  // ۳. حذف پروژه
  document.querySelectorAll('.delete-proj-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projId = e.currentTarget.getAttribute('data-proj-id');
      if (confirm('آیا از حذف این پروژه و قرارداد اطمینان دارید؟')) {
        let allProjects = getStoredProjects();
        allProjects = allProjects.filter(p => p.id !== projId);
        saveStoredProjects(allProjects);
        renderEmployeeProjectsList(empEmail);
        updateProfileStrengthAndStats(empEmail);
      }
    });
  });
}

// محاسبه پویای قدرت پروفایل و رتبه کارمند بر اساس پیشرفت پروژه‌ها
function updateProfileStrengthAndStats(empEmail) {
  const allProjects = getStoredProjects();
  const empProjects = allProjects.filter(p => p.employeeEmail === empEmail);

  const activeProjectsCount = empProjects.length;
  let totalStagesCount = 0;
  let completedStagesCount = 0;
  let fullyCompletedProjects = 0;

  empProjects.forEach(p => {
    const total = p.stages.length;
    const comp = p.stages.filter(s => s.completed).length;
    totalStagesCount += total;
    completedStagesCount += comp;
    if (total > 0 && comp === total) {
      fullyCompletedProjects++;
    }
  });

  // محاسبه قدرت پروفایل:
  // حالت اولیه (بدون پروژه): ۲۰٪ (سطح ۱: کارمند تازه پیوسته)
  // با ثبت و تکمیل پروژه‌ها: ارتقا تا ۱۰۰٪ (سطح ۳: کارمند برتر و ارشد)
  let strengthPercent = 20;
  let levelBadgeText = 'سطح ۱: مقدماتی (پروفایل پایه)';

  if (activeProjectsCount > 0) {
    const stageRatio = totalStagesCount > 0 ? (completedStagesCount / totalStagesCount) : 0;
    strengthPercent = Math.min(100, Math.round(20 + (activeProjectsCount * 15) + (stageRatio * 50)));

    if (strengthPercent >= 80) {
      levelBadgeText = 'سطح ۳: کارمند برتر و ارشد 🌟';
    } else if (strengthPercent >= 45) {
      levelBadgeText = 'سطح ۲: کارمند فعال و پرتلاش 🚀';
    } else {
      levelBadgeText = 'سطح ۱: در حال پیشرفت 🌱';
    }
  }

  // آپدیت المنت‌های صفحه
  const strengthBar = document.getElementById('profileStrengthFill');
  const strengthNum = document.getElementById('profileStrengthNumber');
  const levelBadge = document.getElementById('profileLevelBadge');
  const activeCountEl = document.getElementById('statActiveProjects');
  const doneCountEl = document.getElementById('statCompletedProjects');
  const avgProgressEl = document.getElementById('statAvgProgress');

  if (strengthBar) strengthBar.style.width = `${strengthPercent}%`;
  if (strengthNum) strengthNum.textContent = `${strengthPercent}٪`;
  if (levelBadge) levelBadge.textContent = levelBadgeText;
  if (activeCountEl) activeCountEl.textContent = `${activeProjectsCount} پروژه`;
  if (doneCountEl) doneCountEl.textContent = `${fullyCompletedProjects} پروژه`;

  if (avgProgressEl) {
    const avg = totalStagesCount > 0 ? Math.round((completedStagesCount / totalStagesCount) * 100) : 0;
    avgProgressEl.textContent = `${avg}٪`;
  }
}

/* ==========================================================================
   ۹. ساعت زنده و پایش مدت حضور در داشبورد (Live Dashboard Helpers)
   ========================================================================== */
function initLivePresenceDashboard() {
  const liveClockDisplay = document.getElementById('liveClockDisplay');
  if (!liveClockDisplay) return;

  const updateClock = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '۰');
    const minutes = String(now.getMinutes()).padStart(2, '۰');
    const seconds = String(now.getSeconds()).padStart(2, '۰');
    liveClockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  };
  updateClock();
  setInterval(updateClock, 1000);

  // پایش تایمر زنده حضور
  let sessionSec = parseInt(sessionStorage.getItem('site_session_seconds') || '3680', 10);
  const sessionTimerEl = document.getElementById('liveSessionTimer');
  const todaySiteTimeEl = document.getElementById('tableTodaySiteTime');

  setInterval(() => {
    sessionSec++;
    sessionStorage.setItem('site_session_seconds', sessionSec.toString());
    const h = Math.floor(sessionSec / 3600);
    const m = Math.floor((sessionSec % 3600) / 60);
    const txt = `${h} ساعت و ${m} دقیقه`;
    if (sessionTimerEl) sessionTimerEl.textContent = txt;
    if (todaySiteTimeEl) todaySiteTimeEl.textContent = txt;
  }, 1000);
}

/* ==========================================================================
   ۱۰. نمایش پویای پروژه‌های سامانه در صفحه اصلی و مودال مشاهده جزئیات کامل
   ========================================================================== */
function initHomeProjectsShowcase() {
  const grid = document.getElementById('homeActivitiesGrid');
  if (!grid) return;

  const modal = document.getElementById('homeProjectDetailModal');
  const modalTitle = document.getElementById('homeModalTitle');
  const modalStatusBadge = document.getElementById('homeModalStatusBadge');
  const modalBody = document.getElementById('homeModalBody');
  const closeBtn = document.getElementById('closeHomeModalBtn');
  const dismissBtn = document.getElementById('btnDismissHomeModal');

  const closeModal = () => {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  });

  const renderHomeProjects = () => {
    const allProjects = getStoredProjects();

    if (allProjects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1.5rem; background: #ffffff; border: 2px dashed #cbd5e1; border-radius: var(--radius-xl);">
          <div style="width: 64px; height: 64px; margin: 0 auto 1.15rem; border-radius: 50%; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #1d4ed8;">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #1e293b; margin-bottom: 0.45rem;">در حال حاضر هیچ پروژه‌ای در سامانه موجود نیست</h3>
          <p style="font-size: 0.88rem; color: #64748b; max-width: 480px; margin: 0 auto 1.5rem; line-height: 1.7;">
            پروژه‌ها و قراردادهای ثبت‌شده توسط کارمندان و مدیریت شرکت به صورت خودکار و برخط در این بخش به نمایش درمی‌آیند.
          </p>
          <a href="login.html" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.65rem 1.5rem; font-size: 0.88rem; font-weight: 700;">
            <span>ورود به پنل و تعریف پروژه جدید</span>
          </a>
        </div>
      `;
      return;
    }

    grid.innerHTML = allProjects.map(proj => {
      const totalStages = proj.stages?.length || 0;
      const completedStages = proj.stages?.filter(s => s.completed).length || 0;
      const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

      let statusClass = 'status-planned';
      let statusText = 'برنامه‌ریزی‌شده';
      if (percent >= 100) {
        statusClass = 'status-completed';
        statusText = 'تکمیل‌شده';
      } else if (percent > 0) {
        statusClass = 'status-in-progress';
        statusText = 'در حال انجام';
      }

      return `
        <article class="activity-card ${statusClass}" data-proj-id="${proj.id}">
          <div class="card-top">
            <span class="status-pill">
              <span class="status-dot"></span>
              <span>${statusText}</span>
            </span>
          </div>

          <h3 class="activity-title">${proj.title}</h3>

          <div class="activity-meta-list">
            <div class="activity-meta-item">
              <span class="meta-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </span>
              <span>تاریخ انعقاد: ${proj.contractDate || proj.createdAt}</span>
            </div>

            <div class="activity-meta-item">
              <span class="meta-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <span>کارفرما: <strong>${proj.clientName}</strong></span>
            </div>

            <div class="activity-meta-item">
              <span class="meta-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </span>
              <span>مجری / ایجادکننده: ${proj.employeeName || 'پرسنل شرکت'}</span>
            </div>
          </div>

          <div class="card-progress-wrapper">
            <div class="card-progress-header">
              <span class="card-progress-label">میزان پیشرفت (${completedStages} از ${totalStages} مرحله)</span>
              <span class="card-progress-value">${percent}٪</span>
            </div>
            <div class="progress-track" role="progressbar" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
              <div class="progress-fill" style="width: ${percent}%;"></div>
            </div>
          </div>

          <div class="card-footer">
            <button type="button" class="btn-details open-home-proj-modal-btn" data-proj-id="${proj.id}">
              <span>جزئیات بیشتر</span>
              <svg class="btn-details-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // اتصال رویداد کلیک روی دکمه جزئیات بیشتر برای تاریک‌کردن صفحه و نمایش مودال در مرکز
    grid.querySelectorAll('.open-home-proj-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const projId = e.currentTarget.getAttribute('data-proj-id');
        const proj = allProjects.find(p => p.id === projId);
        if (!proj || !modal) return;

        const totalStages = proj.stages?.length || 0;
        const completedStages = proj.stages?.filter(s => s.completed).length || 0;
        const percent = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

        let statusClass = 'status-planned';
        let statusText = 'برنامه‌ریزی‌شده';
        if (percent >= 100) {
          statusClass = 'status-completed';
          statusText = 'تکمیل‌شده ۱۰۰٪ ✓';
        } else if (percent > 0) {
          statusClass = 'status-in-progress';
          statusText = `${percent}٪ در حال اجرا`;
        }

        if (modalTitle) modalTitle.textContent = proj.title;
        if (modalStatusBadge) {
          modalStatusBadge.className = `status-pill ${statusClass}`;
          modalStatusBadge.textContent = statusText;
        }

        if (modalBody) {
          modalBody.innerHTML = `
            <div class="modal-project-info-grid">
              <div><strong>کارفرما / طرف قرارداد:</strong> ${proj.clientName}</div>
              <div><strong>شماره پیگیری قرارداد:</strong> <span dir="ltr">${proj.contractNo}</span></div>
              <div><strong>تاریخ انعقاد قرارداد:</strong> ${proj.contractDate || proj.createdAt}</div>
              <div><strong>ارزش و مبلغ قرارداد:</strong> ${proj.contractAmount || 'توافقی'}</div>
              <div><strong>مسئول و مجری پروژه:</strong> ${proj.employeeName || 'پرسنل شرکت'}</div>
              <div><strong>پست الکترونیک مسئول:</strong> <span dir="ltr">${proj.employeeEmail}</span></div>
            </div>

            <div class="modal-project-scope-box">
              <strong style="display: block; margin-bottom: 0.35rem; color: var(--color-primary-900);">موضوع و تعهدات کاری قرارداد:</strong>
              <div>${proj.contractScope || 'تعهدات اجرایی طبق توافقات منعقد شده با کارفرما'}</div>
            </div>

            <!-- نوار پیشرفت درصد پروژه -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); padding: 1rem 1.15rem; margin-bottom: 1.25rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.88rem;">
                <span style="font-weight: 700; color: var(--color-primary-900);">
                  میزان پیشرفت کلی پروژه: (${completedStages} از ${totalStages} مرحله انجام شده)
                </span>
                <span style="font-weight: 800; color: var(--color-brand-blue);">${percent}٪</span>
              </div>
              <div class="progress-track" style="height: 10px;">
                <div class="progress-fill" style="width: ${percent}%; background: ${percent >= 100 ? '#10b981' : '#2563eb'};"></div>
              </div>
            </div>

            <!-- مراحل و فازهای اجرایی پروژه -->
            <div>
              <h4 style="font-size: 0.94rem; font-weight: 700; color: var(--color-primary-900); margin-bottom: 0.75rem;">
                مراحل و اقدامات اجرایی توافق‌شده:
              </h4>

              <div class="modal-stages-list">
                ${proj.stages?.map((stage, sIdx) => `
                  <div class="modal-stage-item ${stage.completed ? 'is-done' : ''}">
                    <div class="modal-stage-icon">
                      ${stage.completed ? '✓' : (sIdx + 1)}
                    </div>
                    <div style="flex: 1;">
                      <div style="font-size: 0.88rem; font-weight: 600; color: ${stage.completed ? '#047857' : '#1e293b'}; text-decoration: ${stage.completed ? 'line-through' : 'none'};">
                        ${stage.title}
                      </div>
                      ${stage.completed && stage.completedAt ? `
                        <div style="font-size: 0.74rem; color: #16a34a; margin-top: 0.2rem;">
                          انجام‌شده در: ${stage.completedAt}
                        </div>
                      ` : ''}
                      ${stage.note ? `
                        <div style="font-size: 0.78rem; background: #ffffff; border-right: 3px solid #0284c7; padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); margin-top: 0.35rem; color: #334155;">
                          <strong>یادداشت:</strong> ${stage.note}
                        </div>
                      ` : ''}
                    </div>
                  </div>
                `).join('') || '<div style="color: #64748b; font-size: 0.82rem;">مرحله‌ای تعریف نشده است.</div>'}
              </div>
            </div>
          `;
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  };

  renderHomeProjects();
}



