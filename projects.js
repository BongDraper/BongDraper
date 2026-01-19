// Project Data for Max Gaudelli Portfolio

const PROJECTS = {
    tmobile: {
        title: "T-Mobile Copa '24",
        client: "T-Mobile",
        agency: "Dentsu Creative",
        role: "Associate Creative Director",
        year: "2024",
        description: `A feature spot running throughout Copa America 2024, celebrating the passion and rituals that unite soccer fans. The campaign captured authentic gameday moments—the superstitions, the lucky jerseys, the traditions passed down through generations.

This was a collaboration with Samsung for the launch of the Galaxy S24 and S24+, seamlessly integrating mobile technology into the fan experience.`,
        media: null, // Placeholder for video/image
        credits: [
            { role: "Associate Creative Director", name: "Max Gaudelli" },
            { role: "Client", name: "T-Mobile" },
            { role: "Agency", name: "Dentsu Creative" }
        ]
    },
    samsung: {
        title: "Samsung Galaxy S24",
        client: "Samsung",
        agency: "Dentsu Creative",
        role: "Associate Creative Director",
        year: "2024",
        description: `Launch campaign for the Samsung Galaxy S24 and S24+, integrated with T-Mobile's Copa America sponsorship. The work showcased how the new Galaxy devices enhance the way fans capture and share the beautiful game.`,
        media: null,
        credits: [
            { role: "Associate Creative Director", name: "Max Gaudelli" },
            { role: "Client", name: "Samsung" },
            { role: "Agency", name: "Dentsu Creative" }
        ]
    },
    shibuya: {
        title: "Virtual Shibuya",
        client: "au by KDDI",
        agency: "Ogilvy Tokyo",
        role: "Associate Copywriter",
        year: "2021",
        description: `When Shibuya Ward—home to Japan's largest Halloween celebrations—asked people not to gather as a COVID preventative measure, we didn't cancel the party. We moved it online.

Teaming up with au by KDDI, we recreated Shibuya block by block as a virtual twin. Over 400,000 participants joined the digital Halloween celebration, generating over $20 million in media exposure.

The project proved that community gatherings could transcend physical limitations, creating a new paradigm for public events.`,
        media: null,
        credits: [
            { role: "Copywriter", name: "Max Gaudelli" },
            { role: "Client", name: "au by KDDI" },
            { role: "Agency", name: "Ogilvy Tokyo" }
        ]
    },
    heineken: {
        title: "Heineken",
        client: "Heineken",
        agency: "Ogilvy",
        role: "Copywriter",
        year: "2022-2024",
        description: `Brand storytelling and campaign work for Heineken, crafting narratives that connect with diverse audiences across markets.`,
        media: null,
        credits: [
            { role: "Copywriter", name: "Max Gaudelli" },
            { role: "Client", name: "Heineken" },
            { role: "Agency", name: "Ogilvy" }
        ]
    },
    audi: {
        title: "Audi",
        client: "Audi",
        agency: "Ogilvy",
        role: "Copywriter",
        year: "2022-2024",
        description: `Automotive brand work for Audi, developing copy that captures the precision engineering and forward-thinking design philosophy of the brand.`,
        media: null,
        credits: [
            { role: "Copywriter", name: "Max Gaudelli" },
            { role: "Client", name: "Audi" },
            { role: "Agency", name: "Ogilvy" }
        ]
    },
    kfc: {
        title: "KFC",
        client: "KFC",
        agency: "Ogilvy",
        role: "Copywriter",
        year: "2022-2024",
        description: `Campaign work for KFC, bringing the Colonel's legacy to new audiences with fresh creative approaches while honoring the brand's heritage.`,
        media: null,
        credits: [
            { role: "Copywriter", name: "Max Gaudelli" },
            { role: "Client", name: "KFC" },
            { role: "Agency", name: "Ogilvy" }
        ]
    },
    about: {
        title: "About Me",
        isAbout: true,
        name: "Max Gaudelli",
        role: "Associate Creative Director",
        location: "Brooklyn, NY",
        tagline: "A haiku writer and a good friend with good music.",
        bio: `Mexican-Argentinian creative based in the United States. Currently an Associate Creative Director at Dentsu Creative New York, working with legacy brands to connect with diverse audiences.

D&AD Shift '25 Mentor, helping shape the next generation of creative talent.

My work spans General Market and Hispanic advertising, with experience across agencies in Mexico City, Buenos Aires, Tokyo, and New York.`,
        experience: [
            { role: "Associate Creative Director", place: "Dentsu Creative NY", year: "2024-Present" },
            { role: "Senior Copywriter", place: "Ogilvy Miami & Mexico", year: "2022-2024" },
            { role: "Copywriter", place: "DDB New York", year: "2022" },
            { role: "Associate Copywriter", place: "Ogilvy Tokyo", year: "2020-2022" },
            { role: "Associate Copywriter", place: "LaFusión Buenos Aires", year: "2018-2020" },
            { role: "Culture Intern", place: "VICE Media Mexico", year: "2014-2016" }
        ]
    },
    contact: {
        title: "Contact",
        isContact: true,
        links: [
            { label: "LinkedIn", url: "https://www.linkedin.com/in/mgaudelli/", icon: "linkedin" },
            { label: "Email", url: "mailto:hello@maxgaudelli.com", icon: "email" }
        ]
    }
};

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
                <div class="project-media">
                    ${project.media ? `<img src="${project.media}" alt="${project.title}">` : 'Media coming soon'}
                </div>
                <div class="project-description">
                    ${project.description.split('\n\n').map(p => `<p style="margin-bottom: 16px;">${p}</p>`).join('')}
                </div>
                ${project.credits ? `
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
                ${project.experience.map(exp => `
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

function getProjectContent(projectId) {
    const project = PROJECTS[projectId];
    if (!project) return '<div class="project-content"><p>Project not found</p></div>';

    if (project.isAbout) {
        return generateAboutContent(project);
    } else if (project.isContact) {
        return generateContactContent(project);
    } else {
        return generateProjectContent(project);
    }
}
