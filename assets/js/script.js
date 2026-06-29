// ============================================
// 43 ANNEXE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initActiveLink();
    initReveal();
    initMobileNavClose();
    initYear();
    initWeatherForecast();
});

/* --- Nav: add scrolled class --- */
function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    const onScroll = () => {
        if (window.scrollY > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
}

/* --- Active link highlighting --- */
function initActiveLink() {
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = Array.from(links)
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = () => {
        const y = window.scrollY + 140;
        let current = sections[0].id;
        sections.forEach(sec => {
            if (sec.offsetTop <= y) current = sec.id;
        });
        links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
        });
    };
    setActive();
    window.addEventListener('scroll', setActive, { passive: true });
}

/* --- Reveal on scroll --- */
function initReveal() {
    if (!('IntersectionObserver' in window)) return;

    // Tag elements to reveal
    const selectors = [
        '.section-about .col-lg-6',
        '.section-gallery .annexe-carousel',
        '.chip-card',
        '.info-tile',
        '.story-card',
        '.dest-card',
        '.map-wrap',
        '.cta-card',
        '.weather-panel',
        '.feature-list-item'
    ];
    const targets = document.querySelectorAll(selectors.join(','));
    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(t => io.observe(t));
}

/* --- Close mobile nav on link click --- */
function initMobileNavClose() {
    const links = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .btn');
    const collapse = document.querySelector('.navbar-collapse');
    const toggler = document.querySelector('.navbar-toggler');
    if (!collapse || !toggler) return;
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (collapse.classList.contains('show')) toggler.click();
        });
    });
}

/* --- Footer year --- */
function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
}

/* --- Weather forecast --- */
async function initWeatherForecast() {
    const panel = document.querySelector('[data-weather-panel]');
    if (!panel || !window.fetch) return;

    const statusEl = panel.querySelector('[data-weather-status]');
    const tempEl = panel.querySelector('[data-weather-temp]');
    const summaryEl = panel.querySelector('[data-weather-summary]');
    const detailsEl = panel.querySelector('[data-weather-details]');
    const forecastEl = panel.querySelector('[data-weather-forecast]');

    const latitude = 50.416;
    const longitude = -5.110;

    try {
        const url = new URL('https://api.open-meteo.com/v1/forecast');
        url.searchParams.set('latitude', latitude);
        url.searchParams.set('longitude', longitude);
        url.searchParams.set('timezone', 'Europe/London');
        url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max');
        url.searchParams.set('current', 'temperature_2m,weather_code,wind_speed_10m');
        url.searchParams.set('forecast_days', '3');

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error('Weather request failed');

        const data = await response.json();
        const current = data.current || {};
        const daily = data.daily || {};

        if (statusEl) statusEl.textContent = 'Updated just now';
        if (tempEl) tempEl.textContent = formatTemperature(current.temperature_2m);
        if (summaryEl) summaryEl.textContent = getWeatherLabel(current.weather_code);
        if (detailsEl) {
            detailsEl.textContent = `Wind ${formatNumber(current.wind_speed_10m)} km/h. Forecast for Crantock, Cornwall.`;
        }

        if (forecastEl) {
            forecastEl.innerHTML = '';

            const dates = daily.time || [];
            const highs = daily.temperature_2m_max || [];
            const lows = daily.temperature_2m_min || [];
            const codes = daily.weather_code || [];
            const rain = daily.precipitation_probability_max || [];

            dates.slice(0, 3).forEach((date, index) => {
                const card = document.createElement('article');
                card.className = 'weather-day';

                const dayName = formatDay(date, index === 0);
                const iconClass = getWeatherIcon(codes[index]);

                card.innerHTML = `
                    <div class="weather-day-top">
                        <span class="weather-day-name">${dayName}</span>
                        <i class="fas ${iconClass}" aria-hidden="true"></i>
                    </div>
                    <div class="weather-day-temp">${formatTemperature(highs[index])}</div>
                    <div class="weather-day-meta">
                        <span>Low ${formatTemperature(lows[index])}</span>
                        <span>Rain ${formatNumber(rain[index])}%</span>
                    </div>
                `;

                forecastEl.appendChild(card);
            });
        }
    } catch (error) {
        if (statusEl) statusEl.textContent = 'Forecast unavailable';
        if (summaryEl) summaryEl.textContent = 'Check back later';
        if (detailsEl) detailsEl.textContent = 'The weather service could not be loaded right now.';
        if (forecastEl) {
            forecastEl.innerHTML = '<div class="weather-day"><div class="weather-day-temp">--°</div><p class="m-0">No forecast available right now.</p></div>';
        }
    }
}

function formatTemperature(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '--°';
    return `${Math.round(Number(value))}°`;
}

function formatNumber(value) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return '--';
    return Math.round(Number(value));
}

function formatDay(dateString, isToday) {
    if (isToday) return 'Today';
    const date = new Date(`${dateString}T12:00:00`);
    return new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(date);
}

function getWeatherLabel(code) {
    const weatherCode = Number(code);
    if (weatherCode === 0) return 'Clear skies';
    if ([1, 2].includes(weatherCode)) return 'Mostly bright';
    if (weatherCode === 3) return 'Cloudy';
    if ([45, 48].includes(weatherCode)) return 'Mist and fog';
    if ([51, 53, 55, 56, 57].includes(weatherCode)) return 'Light drizzle';
    if ([61, 63, 65, 66, 67].includes(weatherCode)) return 'Rain showers';
    if ([71, 73, 75, 77].includes(weatherCode)) return 'Cold and snowy';
    if ([80, 81, 82].includes(weatherCode)) return 'Showers likely';
    if ([95, 96, 99].includes(weatherCode)) return 'Stormy weather';
    return 'Local forecast';
}

function getWeatherIcon(code) {
    const weatherCode = Number(code);
    if (weatherCode === 0) return 'fa-sun';
    if ([1, 2].includes(weatherCode)) return 'fa-cloud-sun';
    if (weatherCode === 3) return 'fa-cloud';
    if ([45, 48].includes(weatherCode)) return 'fa-smog';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return 'fa-cloud-showers-heavy';
    if ([71, 73, 75, 77].includes(weatherCode)) return 'fa-snowflake';
    if ([95, 96, 99].includes(weatherCode)) return 'fa-bolt';
    return 'fa-cloud';
}