// Project Data for Max Gaudelli Portfolio
// Loads from content.json for easy editing via admin panel

let PROJECTS = {};
let SITE_INFO = {};
let ABOUT_INFO = {};
let APPEARANCE = {};

const ICON_BASE_URL = 'https://icons.iconarchive.com/icons/johanchalibert/mac-osx-yosemite/256/';

// Get icon URL from icon name or full URL
function getIconUrl(iconName) {
    if (!iconName) return ICON_BASE_URL + 'preview-icon.png';
    if (iconName.startsWith('http')) return iconName;
    return ICON_BASE_URL + iconName + '.png';
}

// Load content from JSON
async function loadContent() {
    try {
        // Check localStorage first for CMS edits
        const saved = localStorage.getItem('portfolio-content');
        let content;
        if (saved) {
            content = JSON.parse(saved);
        } else {
            const response = await fetch('content.json');
            content = await response.json();
        }

        SITE_INFO = content.siteInfo;
        ABOUT_INFO = content.about;
        APPEARANCE = content.appearance || {};

        // Convert projects array to object for compatibility
        content.projects.forEach(project => {
            if (project.visible !== false) {
                PROJECTS[project.id] = project;
            }
        });

        // Add special items
        PROJECTS.about = {
            title: "About Me",
            isAbout: true,
            name: SITE_INFO.name,
            role: SITE_INFO.title,
            location: SITE_INFO.location,
            tagline: SITE_INFO.tagline,
            bio: ABOUT_INFO.bio,
            experience: ABOUT_INFO.experience
        };

        PROJECTS.contact = {
            title: "Contact",
            isContact: true,
            links: [
                { label: "LinkedIn", url: SITE_INFO.linkedin, icon: "linkedin" },
                { label: "Email", url: `mailto:${SITE_INFO.email}`, icon: "email" }
            ]
        };

        PROJECTS.music = {
            title: "Music Player",
            isMusic: true
        };

    } catch (e) {
        console.error('Could not load content.json, using defaults', e);
        loadDefaultContent();
    }
}

// Fallback default content
function loadDefaultContent() {
    PROJECTS = {
        tmobile: {
            id: "tmobile",
            title: "T-Mobile Copa '24",
            client: "T-Mobile",
            agency: "Dentsu Creative",
            role: "Associate Creative Director",
            year: "2024",
            description: "A feature spot running throughout Copa America 2024.",
            media: { type: "none" },
            credits: []
        },
        about: {
            title: "About Me",
            isAbout: true,
            name: "Max Gaudelli",
            role: "Associate Creative Director",
            location: "Brooklyn, NY",
            tagline: "A haiku writer and a good friend with good music.",
            bio: "Creative director based in New York.",
            experience: []
        },
        contact: {
            title: "Contact",
            isContact: true,
            links: [
                { label: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
                { label: "Email", url: "mailto:hello@example.com", icon: "email" }
            ]
        },
        music: {
            title: "Music Player",
            isMusic: true
        }
    };
}

// Helper: Parse YouTube/Vimeo URL to embed
function getVideoEmbed(url) {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    if (youtubeMatch) {
        return `<iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
        return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }

    return null;
}

// Helper: Get media HTML
function getMediaHTML(media, title) {
    if (!media || media.type === 'none') {
        return '<div class="project-media-placeholder">Media coming soon</div>';
    }

    if (media.type === 'youtube' && media.url) {
        const embed = getVideoEmbed(media.url);
        if (embed) {
            return `<div class="project-media video-embed">${embed}</div>`;
        }
    }

    if (media.type === 'file' && media.file) {
        const ext = media.file.split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'mov'].includes(ext)) {
            return `<div class="project-media"><video src="media/${media.file}" controls></video></div>`;
        } else {
            return `<div class="project-media"><img src="media/${media.file}" alt="${title}"></div>`;
        }
    }

    return '<div class="project-media-placeholder">Media coming soon</div>';
}

// Window content generators
function generateProjectContent(project) {
    return `
        <div class="project-content">
            <div class="project-header">
                <h1>${project.title}</h1>
                <div class="project-meta">
                    <span>${project.client}</span>
                    <span>•</span>
                    <span>${project.agency}</span>
                    <span>•</span>
                    <span>${project.year}</span>
                </div>
            </div>
            <div class="project-body">
                ${getMediaHTML(project.media, project.title)}
                <div class="project-description">
                    ${project.description.split('\n\n').map(p => `<p style="margin-bottom: 16px;">${p}</p>`).join('')}
                </div>
                ${project.credits && project.credits.length > 0 ? `
                    <div class="project-credits">
                        <h3>Credits</h3>
                        ${project.credits.map(c => `<div>${c.role}: ${c.name}</div>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function generateAboutContent(project) {
    return `
        <div class="about-content">
            <div class="about-photo"></div>
            <h1>${project.name}</h1>
            <h2>${project.role} • ${project.location}</h2>
            <p style="font-style: italic; color: #888; margin-bottom: 24px;">"${project.tagline}"</p>
            <div class="about-bio">
                ${project.bio.split('\n\n').map(p => `<p style="margin-bottom: 12px;">${p}</p>`).join('')}
            </div>
            <div class="about-experience">
                <h3>Experience</h3>
                ${(project.experience || []).map(exp => `
                    <div class="experience-item">
                        <span class="experience-role">${exp.role}</span>
                        <span class="experience-place">${exp.place} (${exp.year})</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function generateContactContent(project) {
    return `
        <div class="contact-content">
            <h1>Get in Touch</h1>
            <p>Let's make something together.</p>
            <div class="contact-links">
                ${project.links.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener" class="contact-link">
                        <div class="contact-icon"></div>
                        <span>${link.label}</span>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

function generateMusicContent() {
    return `
        <div class="music-player">
            <div class="visualizer-container">
                <canvas id="visualizer-canvas"></canvas>
            </div>
            <div class="player-controls">
                <div class="now-playing">
                    <span class="track-title">Ambient Visualization</span>
                    <span class="track-artist">Energy Bliss Mode</span>
                </div>
                <div class="control-buttons">
                    <button class="player-btn" id="prev-btn" title="Previous">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3 2h2v12H3V2zm4 6l7-6v12l-7-6z"/>
                        </svg>
                    </button>
                    <button class="player-btn play-btn" id="play-btn" title="Play/Pause">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="play-icon">
                            <path d="M4 3l12 7-12 7V3z"/>
                        </svg>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="pause-icon" style="display:none">
                            <path d="M5 3h3v14H5V3zm7 0h3v14h-3V3z"/>
                        </svg>
                    </button>
                    <button class="player-btn" id="next-btn" title="Next">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M11 2h2v12h-2V2zM2 2l7 6-7 6V2z"/>
                        </svg>
                    </button>
                </div>
                <div class="color-scheme">
                    <button class="scheme-btn" id="scheme-btn" title="Change Colors">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                            <circle cx="8" cy="8" r="3"/>
                        </svg>
                        <span>Change Vibe</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getProjectContent(projectId) {
    const project = PROJECTS[projectId];
    if (!project) return '<div class="project-content"><p>Project not found</p></div>';

    if (project.isAbout) {
        return generateAboutContent(project);
    } else if (project.isContact) {
        return generateContactContent(project);
    } else if (project.isMusic) {
        return generateMusicContent();
    } else {
        return generateProjectContent(project);
    }
}

// Apply background from appearance settings
function applyBackground() {
    const desktop = document.getElementById('desktop');
    if (!desktop || !APPEARANCE.backgroundUrl) return;

    const bgUrl = APPEARANCE.backgroundUrl;
    if (bgUrl.startsWith('http')) {
        desktop.style.background = `url('${bgUrl}') center center / cover no-repeat`;
        desktop.style.backgroundColor = '#3a6ea5';
    } else if (bgUrl === 'leopard-aurora') {
        desktop.style.background = 'linear-gradient(180deg, #2b1055 0%, #1a1a4a 20%, #2d3a6d 40%, #5c4b8a 55%, #7b4397 70%, #dc2430 85%, #2b1055 100%)';
    } else if (bgUrl === 'tiger') {
        desktop.style.background = 'linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)';
    }
}

// Render desktop icons dynamically
function renderDesktopIcons() {
    const container = document.getElementById('desktop-icons');
    if (!container) return;

    let html = '';

    // Add project icons from PROJECTS object (excluding special items)
    Object.entries(PROJECTS).forEach(([id, project]) => {
        if (project.isAbout || project.isContact || project.isMusic) return;
        if (project.visible === false) return;

        html += `
            <div class="desktop-icon" data-project="${id}">
                <div class="icon-image">
                    <img src="${getIconUrl(project.icon)}" alt="${project.title}">
                </div>
                <span class="icon-label">${project.title}</span>
            </div>
        `;
    });

    // Add system icons (About, Contact, Music)
    html += `
        <div class="desktop-icon" data-project="about">
            <div class="icon-image">
                <img src="${ICON_BASE_URL}contacts-icon.png" alt="About Me">
            </div>
            <span class="icon-label">About Me</span>
        </div>
        <div class="desktop-icon" data-project="contact">
            <div class="icon-image">
                <img src="${ICON_BASE_URL}mail-icon.png" alt="Contact">
            </div>
            <span class="icon-label">Contact</span>
        </div>
        <div class="desktop-icon" data-project="music">
            <div class="icon-image">
                <img src="${ICON_BASE_URL}facetime-icon.png" alt="Music Player">
            </div>
            <span class="icon-label">Music Player</span>
        </div>
    `;

    container.innerHTML = html;
}

// Initialize content loading and rendering
loadContent().then(() => {
    // Content is loaded, now render icons and apply background
    // These will be called when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            applyBackground();
            renderDesktopIcons();
        });
    } else {
        applyBackground();
        renderDesktopIcons();
    }
});
