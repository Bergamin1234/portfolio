/**
 * ==========================================================================
 * PORTFOLIO CMS LOADER — Syncs dynamic edits from portfolio-data.json
 * Managed via Bergamin Hub (https://bergamin-hub.vercel.app)
 * ==========================================================================
 */

(function () {
  'use strict';

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function hydratePortfolioFromCMS() {
    try {
      const res = await fetch(`portfolio-data.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || typeof data !== 'object') return;

      // Expose phrases for typing animation if present
      if (data.profile && Array.isArray(data.profile.typingPhrases) && data.profile.typingPhrases.length) {
        window.__PORTFOLIO_TYPING_PHRASES__ = data.profile.typingPhrases;
      }

      // 1. Profile & Bio
      if (data.profile) {
        const badgeSpan = document.querySelector('.hero-badge span');
        if (badgeSpan && data.profile.badge) badgeSpan.textContent = data.profile.badge;

        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc && data.profile.heroDescription) heroDesc.textContent = data.profile.heroDescription;

        const bioHeadline = document.querySelector('.bio-headline');
        if (bioHeadline && data.profile.aboutHeadline) bioHeadline.textContent = data.profile.aboutHeadline;

        const bioText = document.querySelector('.bio-text');
        if (bioText && data.profile.aboutBio) bioText.textContent = `"${data.profile.aboutBio}"`;
      }

      // 2. Courses
      if (Array.isArray(data.courses) && data.courses.length) {
        const grid = document.querySelector('.courses-grid');
        if (grid) {
          grid.innerHTML = data.courses
            .map(
              (c) => `
              <div class="course-card glass-card reveal-fade revealed">
                <div class="course-icon ${esc(c.colorClass || 'bg-web')}"><i class="${esc(c.icon || 'fa-solid fa-certificate')}"></i></div>
                <div class="course-body">
                  <span class="course-platform">${esc(c.platform)}</span>
                  <h4 class="course-title">${esc(c.title)}</h4>
                  <p class="course-desc">${esc(c.description)}</p>
                  <div class="course-tags">
                    ${(c.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
                  </div>
                </div>
              </div>`
            )
            .join('');
        }
      }

      // 3. Experiences
      if (Array.isArray(data.experiences) && data.experiences.length) {
        const timeline = document.querySelector('.timeline-container');
        if (timeline) {
          timeline.innerHTML = data.experiences
            .map(
              (exp) => `
              <div class="timeline-item reveal-fade revealed">
                <div class="timeline-marker">
                  <span class="marker-dot ${exp.isCurrent ? 'active-dot' : ''}"></span>
                  ${exp.isCurrent ? '<span class="marker-pulse"></span>' : ''}
                </div>
                <div class="timeline-card glass-card">
                  <div class="card-badge-row">
                    <span class="badge ${exp.isCurrent ? 'badge-current' : 'badge-period'}">${esc(exp.period)}</span>
                    <span class="badge badge-role">${esc(exp.category)}</span>
                  </div>
                  <h3 class="experience-company">${esc(exp.company)}</h3>
                  <h4 class="experience-role">${esc(exp.role)}</h4>
                  <p class="experience-description">${esc(exp.description)}</p>
                  <div class="experience-skills">
                    ${(exp.skills || []).map((s) => `<span class="skill-chip"><i class="fa-solid fa-check"></i> ${esc(s)}</span>`).join('')}
                  </div>
                </div>
              </div>`
            )
            .join('');
        }
      }

      // 4. Soft & Hard Skills
      if (Array.isArray(data.softSkills) && data.softSkills.length) {
        const pillsGrid = document.querySelector('.pills-grid');
        if (pillsGrid) {
          pillsGrid.innerHTML = data.softSkills
            .map(
              (skill) => `
              <div class="skill-pill">
                <span class="pill-icon"><i class="fa-solid fa-circle-check"></i></span>
                <span class="pill-name">${esc(skill)}</span>
              </div>`
            )
            .join('');
        }
      }

      if (Array.isArray(data.hardSkills) && data.hardSkills.length) {
        const hardList = document.querySelector('.hard-skills-list');
        if (hardList) {
          hardList.innerHTML = data.hardSkills
            .map(
              (skill) => `
              <div class="hard-skill-card">
                <div class="hard-skill-header">
                  <div class="hard-skill-info">
                    <i class="${esc(skill.icon || 'fa-solid fa-code')} skill-logo ${esc(skill.colorClass || 'text-cyan')}"></i>
                    <div>
                      <strong>${esc(skill.name)}</strong>
                      <span class="skill-cat">${esc(skill.category)}</span>
                    </div>
                  </div>
                  <span class="skill-level-badge">${esc(skill.level)}</span>
                </div>
              </div>`
            )
            .join('');
        }
      }

      // 5. Public Projects
      if (Array.isArray(data.projects) && data.projects.length) {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
          projectsGrid.innerHTML = data.projects
            .map((p) => {
              const liveLink = p.liveUrl
                ? `<a href="${esc(p.liveUrl)}" target="_blank" rel="noopener noreferrer" class="link-arrow" style="margin-right:1.1rem;"><span>Acessar Site</span><i class="fa-solid fa-globe"></i></a>`
                : '';
              const repoLink = p.repoUrl
                ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener noreferrer" class="link-arrow"><span>Repositório Público</span><i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
                : '';
              return `
                <div class="project-card glass-card reveal-fade revealed">
                  <div class="project-badge"><i class="fa-solid fa-lock-open"></i> Público</div>
                  <div class="project-header">
                    <i class="${esc(p.icon || 'fa-solid fa-globe')} project-type-icon"></i>
                    <div class="project-links">
                      ${p.repoUrl ? `<a href="${esc(p.repoUrl)}" target="_blank" rel="noopener noreferrer" class="icon-link" title="Ver repositório público no GitHub" aria-label="Ver projeto no GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
                    </div>
                  </div>
                  <h3 class="project-title">${esc(p.title)}</h3>
                  <p class="project-description">${esc(p.description)}</p>
                  <div class="project-tags">
                    ${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
                  </div>
                  <div class="project-footer" style="display:flex;flex-wrap:wrap;gap:0.75rem;align-items:center;">
                    ${liveLink}${repoLink}
                  </div>
                </div>`;
            })
            .join('');
        }
      }
    } catch {
      // Silently fallback to static HTML content if offline or file://
    }
  }

  document.addEventListener('DOMContentLoaded', hydratePortfolioFromCMS);
})();
