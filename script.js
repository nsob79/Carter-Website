const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const progress = document.getElementById('progress');
const toast = document.getElementById('toast');
const donateBtn = document.getElementById('donateBtn');

let selectedAmount = 50;

function onScroll() {
    const y = window.scrollY;

    nav.classList.toggle('nav--scrolled', y > 40);

    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = height > 0 ? `${(y / height) * 100}%` : '0%';

    revealElements();
}

function revealElements() {
    document.querySelectorAll('.reveal:not(.reveal--visible)').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
            el.classList.add('reveal--visible');
        }
    });
}

window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', () => {
    if (window.innerWidth > 640) navLinks.classList.remove('nav__links--open');
});

navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('nav__links--open');
    navToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav__links--open');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

document.querySelectorAll('.amount').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.amount').forEach((b) => b.classList.remove('amount--active'));
        btn.classList.add('amount--active');

        if (btn.dataset.amount === 'custom') {
            const custom = window.prompt('Enter a custom donation amount (USD):');
            if (custom && !isNaN(custom) && Number(custom) > 0) {
                selectedAmount = Number(custom);
            } else {
                btn.classList.remove('amount--active');
                document.querySelector('.amount[data-amount="50"]').classList.add('amount--active');
            }
            return;
        }

        selectedAmount = Number(btn.dataset.amount);
    });
});

donateBtn.addEventListener('click', () => {
    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedAmount);
    showToast(`Thank you! Your ${currency} gift helps protect wildlife.`);
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('toast--show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove('toast--show'), 3500);
}

const counters = document.querySelectorAll('.stat__number');
function animateCounters() {
    counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        const duration = 1800;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(target * eased);

            if (target >= 1000) {
                counter.textContent = value.toLocaleString('en-US');
            } else {
                counter.textContent = value;
            }

            if (progress < 1) requestAnimationFrame(tick);
            else counter.textContent = target.toLocaleString('en-US');
        }

        requestAnimationFrame(tick);
    });
}

const impactSection = document.getElementById('impact');
let counted = false;
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                animateCounters();
            }
        });
    },
    { threshold: 0.4 }
);
observer.observe(impactSection);

onScroll();
