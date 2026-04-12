import { CVData } from '../hooks/useCV';

function esc(s: string | undefined | null): string {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function fmtDate(d: string | undefined): string {
  if (!d) return '';
  const parts = d.split('-');
  const months = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return (months[parseInt(parts[1]) - 1] || '') + '. ' + parts[0];
}

function photoTag(photo: string | null, shape: string, size: number): string {
  if (!photo) return '';
  const radius = shape === 'circle' ? '50%' : shape === 'rect' ? '4px' : '8px';
  return `<img src="${photo}" style="width:${size}px;height:${size}px;border-radius:${radius};object-fit:cover;display:block;" />`;
}

function initials(first: string, last: string): string {
  return ((first || '').charAt(0) + (last || '').charAt(0)).toUpperCase() || 'CV';
}

// ─── MODERN ────────────────────────────────────────────────────────────────
function renderModern(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const col = data.color || '#1B7A7A';
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const avatar = photo
    ? `<div class="avatar">${photoTag(photo, 'circle', 100)}</div>`
    : `<div class="avatar initials">${esc(initials(p.firstName, p.lastName))}</div>`;

  const contactItems = [
    p.email   ? `<div class="ci"><span>✉</span>${esc(p.email)}</div>` : '',
    p.phone   ? `<div class="ci"><span>✆</span>${esc(p.phone)}</div>` : '',
    p.address ? `<div class="ci"><span>⌖</span>${esc(p.address)}</div>` : '',
    p.linkedin? `<div class="ci"><span>in</span>${esc(p.linkedin)}</div>` : '',
  ].join('');

  const skillsHtml = data.skills.map(s =>
    `<div class="skill-item"><div class="skill-name">${esc(s)}</div><div class="skill-bar"><div class="skill-fill"></div></div></div>`
  ).join('');

  const langsHtml = data.languages.map(l =>
    `<div class="skill-name">${esc(l.name)}${l.level ? ` <span style="opacity:.7;font-size:10px;">— ${esc(l.level)}</span>` : ''}</div>`
  ).join('');

  const expHtml = data.experience.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="entry-title">${esc(e.jobTitle)}</span><span class="entry-date">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
      <div class="entry-org" style="color:${col}">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
      ${e.description ? `<div class="entry-desc">${esc(e.description)}</div>` : ''}
    </div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="entry-title">${esc(e.degree)}</span><span class="entry-date">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
      <div class="entry-org" style="color:${col}">${esc(e.school)}${e.mention ? ' · ' + esc(e.mention) : ''}</div>
    </div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{display:flex;min-height:100%;}
      .sidebar{width:200px;min-height:100vh;background:${col};color:#fff;padding:24px 16px;flex-shrink:0;}
      .main{flex:1;padding:28px 24px;}
      .avatar{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:700;margin:0 auto 12px;overflow:hidden;}
      .name-s{text-align:center;font-size:14px;font-weight:700;margin-bottom:3px;}
      .role-s{text-align:center;font-size:10px;opacity:.8;margin-bottom:20px;line-height:1.4;}
      .sec-title-s{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;opacity:.7;margin:16px 0 8px;border-top:1px solid rgba(255,255,255,.2);padding-top:10px;}
      .ci{font-size:10px;opacity:.85;margin-bottom:5px;display:flex;gap:6px;align-items:flex-start;line-height:1.4;}
      .ci span{opacity:.6;flex-shrink:0;}
      .skill-item{margin-bottom:7px;}
      .skill-name{font-size:10px;margin-bottom:3px;}
      .skill-bar{height:3px;background:rgba(255,255,255,.2);border-radius:2px;}
      .skill-fill{width:78%;height:100%;background:rgba(255,255,255,.7);border-radius:2px;}
      .main-name{font-size:24px;font-weight:700;letter-spacing:-.5px;margin-bottom:3px;color:#1a2332;}
      .main-role{font-size:12px;color:${col};margin-bottom:12px;}
      .summary{font-size:11px;color:#444;line-height:1.6;margin-bottom:20px;}
      .sec-title-m{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${col};border-bottom:2px solid ${col};padding-bottom:4px;margin-bottom:12px;}
      .entry{margin-bottom:12px;}
      .entry-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:2px;}
      .entry-title{font-size:12px;font-weight:700;color:#1a2332;}
      .entry-date{font-size:10px;color:#888;}
      .entry-org{font-size:11px;margin-bottom:3px;}
      .entry-desc{font-size:10px;color:#555;line-height:1.5;margin-top:3px;}
      .section{margin-bottom:20px;}
    </style>
    <div class="sidebar">
      ${avatar}
      <div class="name-s">${esc(fullName)}</div>
      <div class="role-s">${esc(p.profileTitle)}</div>
      ${contactItems ? `<div class="sec-title-s">Contact</div>${contactItems}` : ''}
      ${data.skills.length ? `<div class="sec-title-s">Compétences</div>${skillsHtml}` : ''}
      ${data.languages.length ? `<div class="sec-title-s">Langues</div>${langsHtml}` : ''}
      ${data.hobbies ? `<div class="sec-title-s">Loisirs</div><div style="font-size:10px;opacity:.85;line-height:1.5;">${esc(data.hobbies)}</div>` : ''}
    </div>
    <div class="main">
      <div class="main-name">${esc(fullName)}</div>
      <div class="main-role">${esc(p.profileTitle)}</div>
      ${p.summary ? `<div class="summary">${esc(p.summary)}</div>` : ''}
      ${expHtml ? `<div class="section"><div class="sec-title-m">Expérience</div>${expHtml}</div>` : ''}
      ${eduHtml ? `<div class="section"><div class="sec-title-m">Formation</div>${eduHtml}</div>` : ''}
    </div>`;
}

// ─── PROFESSIONAL ───────────────────────────────────────────────────────────
function renderProfessional(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const col = data.color || '#1B7A7A';
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const photoBlock = photo
    ? `<div class="hphoto">${photoTag(photo, 'square', 100)}</div>`
    : `<div class="hphoto initials">${esc(initials(p.firstName, p.lastName))}</div>`;

  const expHtml = data.experience.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.jobTitle)}</span><span class="edate">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.company)}${e.location ? ' · ' + esc(e.location) : ''}</div>
    ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}</div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.degree)}</span><span class="edate">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.school)}${e.mention ? ' · ' + esc(e.mention) : ''}</div></div>`
  ).join('');

  const skillsHtml = data.skills.length
    ? data.skills.map(s => `<span class="stag">${esc(s)}</span>`).join('')
    : '';

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{padding:32px 36px;}
      .header{display:flex;align-items:center;gap:20px;padding-bottom:16px;border-bottom:3px solid ${col};margin-bottom:20px;}
      .hphoto{width:100px;height:100px;border-radius:8px;background:#e8f4f4;overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:${col};flex-shrink:0;border:2px solid ${col};}
      .hname{font-size:26px;font-weight:700;letter-spacing:-.5px;color:#1a2332;margin-bottom:3px;}
      .hrole{font-size:13px;color:${col};margin-bottom:8px;}
      .hcontact{display:flex;flex-wrap:wrap;gap:12px;}
      .hci{font-size:10px;color:#555;}
      .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${col};border-bottom:1.5px solid ${col};padding-bottom:3px;margin:0 0 10px;}
      .section{margin-bottom:18px;}
      .entry{margin-bottom:10px;}
      .entry-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1px;}
      .etitle{font-size:12px;font-weight:700;color:#1a2332;}
      .edate{font-size:10px;color:#888;}
      .eorg{font-size:11px;color:${col};margin-bottom:2px;}
      .edesc{font-size:10px;color:#555;line-height:1.5;}
      .stag{display:inline-block;padding:3px 10px;border:1px solid ${col};color:${col};font-size:10px;font-weight:600;margin:0 4px 4px 0;}
      .summary{font-size:11px;color:#444;line-height:1.6;margin-bottom:18px;}
    </style>
    <div class="header">
      ${photoBlock}
      <div>
        <div class="hname">${esc(fullName)}</div>
        <div class="hrole">${esc(p.profileTitle)}</div>
        <div class="hcontact">
          ${p.email   ? `<span class="hci">✉ ${esc(p.email)}</span>` : ''}
          ${p.phone   ? `<span class="hci">✆ ${esc(p.phone)}</span>` : ''}
          ${p.address ? `<span class="hci">⌖ ${esc(p.address)}</span>` : ''}
        </div>
      </div>
    </div>
    ${p.summary ? `<div class="summary">${esc(p.summary)}</div>` : ''}
    ${expHtml ? `<div class="section"><div class="sec-title">Expérience professionnelle</div>${expHtml}</div>` : ''}
    ${eduHtml ? `<div class="section"><div class="sec-title">Formation</div>${eduHtml}</div>` : ''}
    ${skillsHtml ? `<div class="section"><div class="sec-title">Compétences</div>${skillsHtml}</div>` : ''}`;
}

// ─── CREATIVE ───────────────────────────────────────────────────────────────
function renderCreative(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const col = data.color || '#1B7A7A';
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const avatarBlock = photo
    ? `<div class="cavatar">${photoTag(photo, 'square', 100)}</div>`
    : `<div class="cavatar initials">${esc(initials(p.firstName, p.lastName))}</div>`;

  const expHtml = data.experience.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.jobTitle)}</span><span class="edate">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.company)}</div>
    ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}</div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.degree)}</span><span class="edate">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.school)}</div></div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      .top{background:${col};color:#fff;padding:28px 32px;display:flex;align-items:center;gap:20px;}
      .cavatar{width:100px;height:100px;border-radius:12px;background:rgba(255,255,255,.25);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;flex-shrink:0;}
      .cname{font-size:24px;font-weight:700;margin-bottom:3px;}
      .crole{font-size:12px;opacity:.85;margin-bottom:8px;}
      .ccontact{font-size:10px;opacity:.8;line-height:1.8;}
      .body{padding:24px 32px;}
      .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${col};margin:0 0 10px;}
      .section{margin-bottom:18px;padding-bottom:18px;border-bottom:1px solid #eee;}
      .section:last-child{border-bottom:none;}
      .entry{margin-bottom:10px;}
      .entry-row{display:flex;justify-content:space-between;align-items:baseline;}
      .etitle{font-size:12px;font-weight:700;color:#1a2332;}
      .edate{font-size:10px;color:#888;}
      .eorg{font-size:11px;color:${col};margin:2px 0;}
      .edesc{font-size:10px;color:#555;line-height:1.5;}
      .stag{display:inline-block;padding:4px 12px;background:${col}18;border:1px solid ${col}44;color:${col};font-size:10px;margin:0 4px 4px 0;border-radius:2px;}
    </style>
    <div class="top">
      ${avatarBlock}
      <div>
        <div class="cname">${esc(fullName)}</div>
        <div class="crole">${esc(p.profileTitle)}</div>
        <div class="ccontact">
          ${[p.email, p.phone, p.address].filter(Boolean).map(esc).join(' · ')}
        </div>
      </div>
    </div>
    <div class="body">
      ${p.summary ? `<div class="section"><div class="sec-title">Profil</div><p style="font-size:11px;color:#444;line-height:1.6;">${esc(p.summary)}</p></div>` : ''}
      ${expHtml ? `<div class="section"><div class="sec-title">Expérience</div>${expHtml}</div>` : ''}
      ${eduHtml ? `<div class="section"><div class="sec-title">Formation</div>${eduHtml}</div>` : ''}
      ${data.skills.length ? `<div class="section"><div class="sec-title">Compétences</div>${data.skills.map(s => `<span class="stag">${esc(s)}</span>`).join('')}</div>` : ''}
    </div>`;
}

// ─── SIMPLE ─────────────────────────────────────────────────────────────────
function renderSimple(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const col = data.color || '#1B7A7A';
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const photoBlock = photo
    ? `<div class="sphoto">${photoTag(photo, 'circle', 90)}</div>`
    : `<div class="sphoto initials">${esc(initials(p.firstName, p.lastName))}</div>`;

  const expHtml = data.experience.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.jobTitle)}</span><span class="edate">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.company)}</div>
    ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}</div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry"><div class="entry-row"><span class="etitle">${esc(e.degree)}</span><span class="edate">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
    <div class="eorg">${esc(e.school)}</div></div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{padding:36px 44px;border-left:4px solid ${col};}
      .header{display:flex;align-items:flex-start;gap:18px;margin-bottom:24px;}
      .sphoto{width:90px;height:90px;border-radius:50%;border:2px solid ${col};overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;color:${col};background:#e8f4f4;flex-shrink:0;}
      .sname{font-size:26px;font-weight:700;color:#1a2332;margin-bottom:3px;}
      .srole{font-size:12px;color:${col};margin-bottom:6px;}
      .scontact{font-size:10px;color:#555;line-height:1.8;}
      .divider{height:1px;background:#e0e0e0;margin:16px 0;}
      .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${col};margin:0 0 10px;}
      .section{margin-bottom:18px;}
      .entry{margin-bottom:10px;}
      .entry-row{display:flex;justify-content:space-between;align-items:baseline;}
      .etitle{font-size:12px;font-weight:700;color:#1a2332;}
      .edate{font-size:10px;color:#888;}
      .eorg{font-size:11px;color:${col};margin:2px 0;}
      .edesc{font-size:10px;color:#555;line-height:1.5;}
    </style>
    <div class="header">
      ${photoBlock}
      <div>
        <div class="sname">${esc(fullName)}</div>
        <div class="srole">${esc(p.profileTitle)}</div>
        <div class="scontact">
          ${[p.email, p.phone, p.address].filter(Boolean).map(esc).join('<br>')}
        </div>
      </div>
    </div>
    <div class="divider"></div>
    ${p.summary ? `<div class="section"><div class="sec-title">Profil</div><p style="font-size:11px;color:#444;line-height:1.6;">${esc(p.summary)}</p></div>` : ''}
    ${expHtml ? `<div class="section"><div class="sec-title">Expérience</div>${expHtml}</div>` : ''}
    ${eduHtml ? `<div class="section"><div class="sec-title">Formation</div>${eduHtml}</div>` : ''}
    ${data.skills.length ? `<div class="section"><div class="sec-title">Compétences</div><p style="font-size:11px;color:#444;line-height:1.8;">${data.skills.map(esc).join(' · ')}</p></div>` : ''}`;
}

// ─── CANADIAN ───────────────────────────────────────────────────────────────
function renderCanadian(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const col = data.color || '#D00000';
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const photoBlock = photo
    ? `<div class="caphoto">${photoTag(photo, 'square', 110)}</div>`
    : '';

  const expHtml = data.experience.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="etitle">${esc(e.jobTitle)}</span><span class="edate">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
      <div class="eorg">${esc(e.company)}${e.location ? ', ' + esc(e.location) : ''}</div>
      ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}
    </div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="etitle">${esc(e.degree)}</span><span class="edate">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
      <div class="eorg">${esc(e.school)}</div>
    </div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{padding:28px 36px;}
      .header{display:flex;align-items:flex-start;gap:16px;padding-bottom:14px;border-top:5px solid ${col};padding-top:14px;margin-bottom:6px;}
      .caphoto{width:110px;height:110px;border-radius:6px;overflow:hidden;border:2px solid ${col};flex-shrink:0;}
      .hinfo{flex:1;}
      .hname{font-size:28px;font-weight:700;letter-spacing:-.5px;color:#1a2332;margin-bottom:3px;}
      .hrole{font-size:13px;color:${col};margin-bottom:6px;}
      .hcontact{font-size:10px;color:#555;line-height:1.8;}
      .divider{height:1px;background:#e0e0e0;margin:12px 0 16px;}
      .summary{font-size:11px;color:#444;line-height:1.6;margin-bottom:18px;background:#f9f9f9;padding:10px 12px;border-left:3px solid ${col};}
      .skills-box{background:#f9f9f9;padding:10px 12px;margin-bottom:18px;}
      .stag{display:inline-block;padding:3px 10px;background:#fff;border:1px solid ${col}44;color:${col};font-size:10px;margin:0 4px 4px 0;}
      .sec-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${col};border-bottom:2px solid ${col};padding-bottom:4px;margin:0 0 10px;}
      .section{margin-bottom:18px;}
      .entry{margin-bottom:10px;}
      .entry-row{display:flex;justify-content:space-between;align-items:baseline;}
      .etitle{font-size:12px;font-weight:700;color:#1a2332;}
      .edate{font-size:10px;color:#888;}
      .eorg{font-size:11px;color:${col};margin:2px 0;}
      .edesc{font-size:10px;color:#555;line-height:1.5;}
    </style>
    <div class="header">
      <div class="hinfo">
        <div class="hname">${esc(fullName)}</div>
        <div class="hrole">${esc(p.profileTitle)}</div>
        <div class="hcontact">${[p.email, p.phone, p.address].filter(Boolean).map(esc).join(' | ')}</div>
      </div>
      ${photoBlock}
    </div>
    <div class="divider"></div>
    ${p.summary ? `<div class="summary">${esc(p.summary)}</div>` : ''}
    ${data.skills.length ? `<div class="skills-box">${data.skills.map(s => `<span class="stag">${esc(s)}</span>`).join('')}</div>` : ''}
    ${expHtml ? `<div class="section"><div class="sec-title">Expérience professionnelle</div>${expHtml}</div>` : ''}
    ${eduHtml ? `<div class="section"><div class="sec-title">Formation</div>${eduHtml}</div>` : ''}`;
}

// ─── EUROPASS ───────────────────────────────────────────────────────────────
function renderEuropass(data: CVData, photo: string | null): string {
  const p = data.personalInfo;
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';
  const photoBlock = photo
    ? `<div class="ephoto">${photoTag(photo, 'rect', 84)}</div>`
    : '';

  const expHtml = data.experience.map(e =>
    `<div class="etable">
      <div class="edate-col">${fmtDate(e.startDate)}<br>${e.current ? 'Présent' : fmtDate(e.endDate)}</div>
      <div class="einfo-col">
        <div class="etitle">${esc(e.jobTitle)}</div>
        <div class="eorg">${esc(e.company)}${e.location ? ', ' + esc(e.location) : ''}</div>
        ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}
      </div>
    </div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="etable">
      <div class="edate-col">${e.current ? 'En cours' : fmtDate(e.endDate)}</div>
      <div class="einfo-col">
        <div class="etitle">${esc(e.degree)}</div>
        <div class="eorg">${esc(e.school)}</div>
      </div>
    </div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif;}
      body{font-size:11px;}
      .eu-header{background:#003399;color:#fff;padding:14px 20px;display:flex;align-items:center;gap:12px;}
      .eu-star{color:#FFCC00;font-size:20px;margin-right:4px;}
      .eu-title{font-size:11px;font-weight:700;letter-spacing:.05em;}
      .eu-subtitle{font-size:9px;opacity:.7;}
      .ephoto{width:84px;height:100px;border:2px solid rgba(255,255,255,.4);overflow:hidden;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
      .pblock{background:#f5f5f5;padding:12px 16px;margin:0;display:flex;gap:14px;border-bottom:3px solid #003399;}
      .pinfo{flex:1;}
      .pname{font-size:16px;font-weight:700;color:#003399;margin-bottom:3px;}
      .prole{font-size:11px;color:#444;margin-bottom:6px;}
      .pci{font-size:10px;color:#555;line-height:1.8;}
      .body{padding:14px 16px;}
      .sec-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#003399;background:#e8eeff;padding:5px 10px;margin-bottom:8px;border-left:4px solid #003399;}
      .section{margin-bottom:14px;}
      .etable{display:flex;gap:12px;margin-bottom:8px;}
      .edate-col{width:72px;flex-shrink:0;font-size:10px;color:#888;text-align:right;}
      .einfo-col{flex:1;border-left:1px solid #ccc;padding-left:10px;}
      .etitle{font-size:11px;font-weight:700;color:#1a2332;}
      .eorg{font-size:10px;color:#003399;margin:2px 0;}
      .edesc{font-size:10px;color:#555;line-height:1.5;}
    </style>
    <div class="eu-header">
      <span class="eu-star">★</span>
      <div>
        <div class="eu-title">Curriculum Vitae</div>
        <div class="eu-subtitle">Europass</div>
      </div>
      <div style="margin-left:auto;">${photoBlock}</div>
    </div>
    <div class="pblock">
      <div class="pinfo">
        <div class="pname">${esc(fullName)}</div>
        <div class="prole">${esc(p.profileTitle)}</div>
        <div class="pci">
          ${p.email   ? `✉ ${esc(p.email)}<br>` : ''}
          ${p.phone   ? `✆ ${esc(p.phone)}<br>` : ''}
          ${p.address ? `⌖ ${esc(p.address)}<br>` : ''}
          ${p.linkedin? `in ${esc(p.linkedin)}<br>` : ''}
        </div>
      </div>
    </div>
    <div class="body">
      ${p.summary ? `<div class="section"><div class="sec-title">Profil personnel</div><p style="font-size:11px;color:#444;line-height:1.6;padding:0 2px;">${esc(p.summary)}</p></div>` : ''}
      ${expHtml ? `<div class="section"><div class="sec-title">Expérience professionnelle</div>${expHtml}</div>` : ''}
      ${eduHtml ? `<div class="section"><div class="sec-title">Éducation et formation</div>${eduHtml}</div>` : ''}
      ${data.skills.length ? `<div class="section"><div class="sec-title">Compétences</div><p style="padding:0 2px;line-height:1.8;color:#333;">${data.skills.map(esc).join(' · ')}</p></div>` : ''}
    </div>`;
}

// ─── ATS ────────────────────────────────────────────────────────────────────
function renderATS(data: CVData): string {
  const p = data.personalInfo;
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Votre Nom';

  const expHtml = data.experience.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="etitle">${esc(e.jobTitle)}</span><span class="edate">${fmtDate(e.startDate)} – ${e.current ? 'Présent' : fmtDate(e.endDate)}</span></div>
      <div class="eorg">${esc(e.company)}${e.location ? ', ' + esc(e.location) : ''}</div>
      ${e.description ? `<div class="edesc">${esc(e.description)}</div>` : ''}
    </div>`
  ).join('');

  const eduHtml = data.education.map(e =>
    `<div class="entry">
      <div class="entry-row"><span class="etitle">${esc(e.degree)}</span><span class="edate">${e.current ? 'En cours' : fmtDate(e.endDate)}</span></div>
      <div class="eorg">${esc(e.school)}${e.mention ? ' — ' + esc(e.mention) : ''}</div>
    </div>`
  ).join('');

  return `
    <style>
      *{margin:0;padding:0;box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;}
      body{padding:28px 32px;font-size:11pt;color:#000;line-height:1.5;}
      .aname{font-size:18pt;font-weight:700;margin-bottom:2px;}
      .arole{font-size:11pt;color:#333;margin-bottom:5px;}
      .contact{font-size:10pt;color:#222;margin-bottom:10px;line-height:1.8;}
      hr{border:none;border-top:1px solid #000;margin:8px 0 10px;}
      .sec-title{font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid #000;padding-bottom:2px;margin:0 0 8px;}
      .section{margin-bottom:14px;}
      .entry{margin-bottom:10px;}
      .entry-row{display:flex;justify-content:space-between;}
      .etitle{font-weight:700;font-size:10.5pt;}
      .edate{font-size:10pt;color:#444;}
      .eorg{font-size:10pt;color:#222;margin:1px 0;}
      .edesc{font-size:10pt;color:#333;line-height:1.5;margin-top:2px;}
    </style>
    <div class="aname">${esc(fullName)}</div>
    ${p.profileTitle ? `<div class="arole">${esc(p.profileTitle)}</div>` : ''}
    <div class="contact">
      ${[p.email, p.phone, p.address, p.linkedin].filter(Boolean).map(esc).join(' | ')}
    </div>
    <hr>
    ${p.summary ? `<div class="section"><div class="sec-title">Profil</div><p style="font-size:10.5pt;">${esc(p.summary)}</p></div>` : ''}
    ${expHtml ? `<div class="section"><div class="sec-title">Expérience</div>${expHtml}</div>` : ''}
    ${eduHtml ? `<div class="section"><div class="sec-title">Formation</div>${eduHtml}</div>` : ''}
    ${data.skills.length ? `<div class="section"><div class="sec-title">Compétences</div><p style="font-size:10.5pt;line-height:1.8;">${data.skills.map(esc).join(' · ')}</p></div>` : ''}
    ${data.languages.length ? `<div class="section"><div class="sec-title">Langues</div><p style="font-size:10.5pt;line-height:1.8;">${data.languages.map(l => esc(l.name) + (l.level ? ` (${esc(l.level)})` : '')).join(' · ')}</p></div>` : ''}`;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function buildCVHtml(data: CVData, photo: string | null): string {
  const body = (() => {
    switch (data.template) {
      case 'professional': return renderProfessional(data, photo);
      case 'creative':     return renderCreative(data, photo);
      case 'simple':       return renderSimple(data, photo);
      case 'canadian':     return renderCanadian(data, photo);
      case 'europass':     return renderEuropass(data, photo);
      case 'ats':          return renderATS(data);
      default:             return renderModern(data, photo);
    }
  })();

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=794, initial-scale=1">
  <style>
    html,body{margin:0;padding:0;width:794px;min-height:1123px;background:#fff;}
    :root{--cv-primary:${data.color || '#1B7A7A'};}
  </style>
</head>
<body>${body}</body>
</html>`;
}
