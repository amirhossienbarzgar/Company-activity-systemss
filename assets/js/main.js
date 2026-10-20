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
  initAuthSystem();
  initManagerEmployeeVault();
  initEmployeeProfilePortal();
  initLivePresenceDashboard();
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
    return JSON.parse(localStorage.getItem(EMP_PROJECTS_KEY) || '[]');
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
              <button type="button" class="btn-action-del delete-emp-btn" data-emp-id="${emp.id}" data-emp-name="${emp.name}" title="حذف دسترسی کارمند">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
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

    // ۴. حذف کارمند
    document.querySelectorAll('.delete-emp-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-emp-id');
        const name = e.currentTarget.getAttribute('data-emp-name');
        if (confirm(`آیا از لغو دسترسی و حذف کارمند «${name}» اطمینان دارید؟`)) {
          let list = getStoredEmployees();
          list = list.filter(em => em.id !== id);
          saveStoredEmployees(list);
          renderEmployeesTable();
        }
      });
    });
  };

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

  // افزودن فعالیت شخصی جدید توسط مدیر
  const newForm = document.getElementById('newActivityForm');
  const listContainer = document.getElementById('myActivitiesList');
  const actCountTag = document.getElementById('activityCountTag');

  if (newForm && listContainer) {
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('newTitle')?.value.trim();
      const dept = document.getElementById('newDept')?.value || 'مدیریت شرکت';
      const progress = parseInt(document.getElementById('newProgress')?.value, 10) || 0;

      if (!title) return;

      let statusClass = 'progress-amber';
      let statusText = 'برنامه‌ریزی‌شده';
      let statusBg = 'background: #fffbeb; color: #b45309; border: 1px solid rgba(245, 158, 11, 0.3);';

      if (progress >= 100) {
        statusClass = 'progress-green';
        statusText = 'تکمیل‌شده';
        statusBg = 'background: #ecfdf5; color: #047857; border: 1px solid rgba(16, 185, 129, 0.3);';
      } else if (progress > 30) {
        statusClass = 'progress-blue';
        statusText = 'در حال انجام';
        statusBg = 'background: #eff6ff; color: #1d4ed8; border: 1px solid rgba(29, 78, 216, 0.3);';
      }

      const newItem = document.createElement('div');
      newItem.className = 'my-activity-item';
      newItem.innerHTML = `
        <div class="my-activity-top">
          <div>
            <h3 class="my-activity-title">${title}</h3>
            <span class="my-activity-dept">${dept} • ثبت: امروز</span>
          </div>
          <span class="status-pill" style="${statusBg}">
            <span class="status-dot"></span>
            <span>${statusText}</span>
          </span>
        </div>
        <div class="my-activity-progress-wrap">
          <div class="my-progress-bar">
            <div class="my-progress-fill ${statusClass}" style="width: ${progress}%;"></div>
          </div>
          <span class="my-progress-text">${progress}٪</span>
        </div>
      `;

      listContainer.prepend(newItem);
      newForm.reset();

      const totalItems = listContainer.querySelectorAll('.my-activity-item').length;
      if (actCountTag) {
        actCountTag.textContent = `${totalItems} مأموریت ثبت‌شده`;
      }
    });
  }

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

      if (!title || !clientName) {
        alert('لطفاً عنوان پروژه و نام کارفرما را وارد فرمایید.');
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

    return `
      <div class="project-card" data-proj-id="${proj.id}">
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
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${isFullyDone ? `
              <span class="badge-present-done" style="background: #ecfdf5; color: #047857; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                تکمیل‌شده ✓
              </span>
            ` : `
              <span class="badge-overtime" style="background: #eff6ff; color: #1d4ed8; font-size: 0.82rem; padding: 0.35rem 0.75rem;">
                در حال پیشرفت
              </span>
            `}
            <button type="button" class="btn-action-del delete-proj-btn" data-proj-id="${proj.id}" title="حذف این پروژه">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

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
    `;
  }).join('');

  bindProjectInteractions(empEmail);
}

// اتصال رویدادهای تیک زدن مراحل، یادداشت‌ها و حذف پروژه
function bindProjectInteractions(empEmail) {
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


