// ============================================
// 43 ANNEXE - INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initActiveLink();
    initReveal();
    initMobileNavClose();
    initYear();
    initCornwallMap();
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
        '.cornwall-map-shell',
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

/* --- Cornwall map --- */
function initCornwallMap() {
    const mapElement = document.getElementById('cornwallMap');
    if (!mapElement || !window.L) return;

    const places = [
        { selector: '[data-testid="dest-newquay"]', lat: 50.4154, lng: -5.0788 },
        { selector: '[data-testid="dest-padstow"]', lat: 50.5397, lng: -5.0131 },
        { selector: '[data-testid="dest-stives"]', lat: 50.2100, lng: -5.4829 },
        { selector: '[data-testid="dest-eden"]', lat: 50.3601, lng: -4.7441 },
        { selector: '[data-testid="dest-bedruthan"]', lat: 50.4910, lng: -5.0276 },
        { selector: '[data-testid="dest-truro"]', lat: 50.2632, lng: -5.0510 },
        { selector: '[data-testid="dest-tintagel"]', lat: 50.6635, lng: -4.7500 },
        { selector: '[data-testid="dest-lostlands"]', lat: 50.2975, lng: -4.7921 }
    ];

    const map = L.map(mapElement, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true
    }).setView([50.35, -4.95], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const pinIcon = L.divIcon({
        className: 'cornwall-pin-icon',
        html: '<span class="cornwall-pin" aria-hidden="true"></span>',
        iconSize: [16, 16],
        iconAnchor: [8, 16],
        popupAnchor: [0, -18]
    });

    const homeIcon = L.divIcon({
        className: 'cornwall-home-icon',
        html: '<span class="cornwall-home-pin" aria-hidden="true"></span>',
        iconSize: [18, 18],
        iconAnchor: [9, 18],
        popupAnchor: [0, -20]
    });

    const homeLat = 50.4162;
    const homeLng = -5.1104;
    const homeMarker = L.marker([homeLat, homeLng], {
        icon: homeIcon,
        zIndexOffset: 1000
    }).addTo(map);
    homeMarker.bindTooltip('We are here', {
        permanent: true,
        direction: 'top',
        offset: [0, -12],
        className: 'cornwall-home-tooltip',
        opacity: 1
    });

    const cardMap = new Map();
    const bounds = [];
    bounds.push([homeLat, homeLng]);

    places.forEach(place => {
        const card = document.querySelector(place.selector);
        if (!card) return;

        const titleEl = card.querySelector('h4');
        const distanceEl = card.querySelector('.dest-distance');
        const summaryEl = card.querySelector('p');
        const title = titleEl ? titleEl.textContent.trim() : 'Place';
        const distance = distanceEl ? distanceEl.textContent.trim() : '';
        const summary = summaryEl ? summaryEl.textContent.trim() : '';

        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Open map pin for ${title}`);

        const marker = L.marker([place.lat, place.lng], { icon: pinIcon }).addTo(map);
        marker.bindPopup(createPopupContent(title, distance, summary), {
            className: 'cornwall-popup',
            maxWidth: 280,
            closeButton: false,
            autoPanPadding: [30, 30]
        });

        const selectPlace = () => {
            setActiveCornwallCard(cardMap, card);
            marker.openPopup();
            map.flyTo([place.lat, place.lng], Math.max(map.getZoom(), 8), { duration: 0.55 });
        };

        marker.on('click', selectPlace);
        card.addEventListener('click', selectPlace);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                selectPlace();
            }
        });

        cardMap.set(card, marker);
        bounds.push([place.lat, place.lng]);
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [30, 30] });
    }

    map.on('popupopen', (event) => {
        for (const [card, marker] of cardMap.entries()) {
            if (marker.getPopup() === event.popup) {
                setActiveCornwallCard(cardMap, card);
                break;
            }
        }
    });
}

function createPopupContent(title, distance, summary) {
    return `
        <span class="popup-title">${title}</span>
        <span class="popup-distance">${distance}</span>
        <p class="popup-copy">${summary}</p>
    `;
}

function setActiveCornwallCard(cardMap, activeCard) {
    cardMap.forEach((marker, card) => {
        card.classList.toggle('is-active', card === activeCard);
    });
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