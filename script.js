const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.classList.toggle('active', open);
    menuButton.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// ЛОГИКА КОЛЕСА КОМПЕТЕНЦИЙ
// ==========================================
const wheelWrapper = document.getElementById('wheelWrapper');
const infoPanel = document.getElementById('infoPanel');
const placeholderText = document.getElementById('placeholderText');
const infoContent = document.getElementById('infoContent');
const infoHeader = document.getElementById('infoHeader');
const infoIcon = document.getElementById('infoIcon');
const infoTitle = document.getElementById('infoTitle');
const infoList = document.getElementById('infoList');
const segments = document.querySelectorAll('.wheel-segment');

const sectionsData = {
    0: { 
        title: 'БУРЕНИЕ', 
        color: 'blue', 
        icon: '', 
        items: [
            'Ремонт и обслуживание бурового оборудования',
            'Ремонт СВП',
            'Ремонт системы очистки',
            'Ремонт вышек и мачт'
        ] 
    },
    1: { 
        title: 'ГРП', 
        color: 'orange', 
        icon: '', 
        items: [
            'Ремонт и обслуживание насосных установок ГРП',
            'Ремонт гидравлических блоков и манифольдов',
            'Ремонт смесителей и дозирующих систем',
            'Ремонт и изготовление деталей для ГРП'
        ] 
    },
    2: { 
        title: 'ГНКТ', 
        color: 'red', 
        icon: '', 
        items: [
            'Ремонт и обслуживание оборудования для ГНКТ',
            'Ремонт катушек и инжекторов',
            'Изготовление и ремонт инструментов для ГНКТ',
            'Испытания и опрессовка'
        ] 
    },
    3: { 
        title: 'РЕМОНТ КОТЕЛЬНЫХ АГРЕГАТОВ', 
        color: 'teal', 
        icon: '', 
        items: [
            'Замена дефектных экранных и кипятильных труб (вальцовка, сварка)',
            'Ремонт или полная замена обмуровки, теплоизоляции и обшивки котла',
            'Ремонт барабанов котла, устранение трещин и свищей'
        ] 
    },
    4: { 
        title: 'ПРОМЫШЛЕННЫЙ РЕМОНТ И МЕХАНОБРАБОТКА', 
        color: 'slate', 
        icon: '', 
        items: [
            'Ремонт центробежных, винтовых и шламовых насосов',
            'Изготовление и восстановление шнеков',
            'Ремонт корпусов и рабочих колёс',
            'Изготовление рам, бункеров и металлоконструкций',
            'Изготовление деталей по образцу без конструкторской документации'
        ] 
    },
    5: { 
        title: 'РЕИНЖИНИРИНГ', 
        color: 'dark', 
        icon: '', 
        items: [
            '3D-сканирование и обмер',
            'Проектирование и КД',
            'Материаловедческий анализ',
            'Прочностные расчеты',
            'Лабораторные испытания'
        ] 
    }
};
function showSectionInfo(index) {
    const data = sectionsData[index];
    if (!data) return;
    
    placeholderText.style.display = 'none';
    infoContent.classList.remove('active');
    
    infoHeader.className = 'info-header ' + data.color;
    infoIcon.textContent = data.icon;
    infoTitle.textContent = data.title;
    
    infoList.innerHTML = '';
    data.items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        infoList.appendChild(li);
    });
    
    setTimeout(() => {
        infoContent.classList.add('active');
    }, 50);
}

function handleSegmentEnter(segment) {
    const index = parseInt(segment.dataset.index);
    const color = segment.dataset.color;
    
    wheelWrapper.classList.add('shrunk');
    infoPanel.classList.add('visible');
    showSectionInfo(index);

    segments.forEach(seg => {
        seg.classList.remove('active');
        seg.classList.remove('dimmed');
    });

    segments.forEach((seg,idx) => {
        if (idx === index){
            seg.classList.add('active');
        }else if (seg.dataset.color === color){
        }else {
            seg.classList.add('dimmed');
        }
    })
}

function handleSegmentLeave(segment) {
    // Текст не пропадает при уходе мыши
}

segments.forEach(segment => {
    segment.addEventListener('mouseenter', () => handleSegmentEnter(segment));
    segment.addEventListener('mouseleave', () => handleSegmentLeave(segment));
    segment.addEventListener('click', () => handleSegmentEnter(segment));
});

const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');

            navLinks.forEach(link => link.classList.remove('active'));

            const activeLink = document.querySelector(`.site-nav a[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
});

sections.forEach(section => scrollSpyObserver.observe(section));

const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator-dot');
let currentSlide = 0;
let slideTimeout = null;
let isPaused = false;
const SLIDE_DURATION = 5000;

function goToSlide (index){
    if (index === currentSlide) return;

    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;
}

function nextSlide(){
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
    scheduleNextSlide();
}

function scheduleNextSlide(){
    if (slideTimeout){
        clearTimeout(slideTimeout);
        slideTimeout = null;
    }

    if (!isPaused && slides.length > 1){
        slideTimeout = setTimeout(nextSlide, SLIDE_DURATION);
    }
}

function pauseSlider(){
    isPaused = true;
    if (slideTimeout){
        clearTimeout(slideTimeout);
        slideTimeout = null;
    }
}

function resumeSlider(){
    isPaused = false;
    scheduleNextSlide();
}

indicators.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (slideTimeout) {
            clearTimeout(slideTimeout);
            slideTimeout = null;
        }

        goToSlide(index);

        if (!isPaused){
            slideTimeout = setTimeout(nextSlide, SLIDE_DURATION);
        }
    });
});

const productionSlider = document.querySelector('.production-slider');
if (productionSlider && slides.length > 1) {
    productionSlider.addEventListener('mouseenter', pauseSlider);
    productionSlider.addEventListener('mouseleave', resumeSlider);

    scheduleNextSlide();
}