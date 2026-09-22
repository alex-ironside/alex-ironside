const PHONE_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"></rect><line x1="11" y1="18" x2="13" y2="18"></line></svg>';

const MONITOR_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function card(project) {
  const isLive = project.status === "live";

  const article = el("article", isLive ? "card" : "card card--wip");

  const top = el("div", "card__top");
  const tile = el("span", "tile", project.initial);
  tile.setAttribute("aria-hidden", "true");
  const badge = el("span", isLive ? "badge badge--live" : "badge badge--wip");
  const dot = el("span", "badge__dot");
  dot.setAttribute("aria-hidden", "true");
  badge.append(dot, document.createTextNode(isLive ? "Live" : "In progress"));
  top.append(tile, badge);

  const title = el("h3", null, project.title);
  const blurb = el("p", "card__blurb", project.blurb);

  const tags = el("ul", "tags");
  tags.setAttribute("aria-label", "Tech stack");
  for (const tag of project.tags) tags.append(el("li", null, tag));

  article.append(top, title, blurb, tags);

  if (project.note) {
    const note = el("p", "note");
    note.innerHTML = project.noteIcon === "desktop" ? MONITOR_ICON : PHONE_ICON;
    note.append(document.createTextNode(project.note));
    article.append(note);
  }

  if (project.live) {
    const link = el("a", "live-link");
    link.href = project.live;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(document.createTextNode("Open live app"));
    const arrow = el("span", "arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
    article.append(link);
  } else {
    article.append(el("span", "soon", "Deploying soon"));
  }

  return article;
}

async function render() {
  const grid = document.getElementById("project-grid");
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();
    grid.textContent = "";
    for (const p of projects) grid.append(card(p));
  } catch (err) {
    grid.innerHTML =
      'Could not load the project list. See them on <a href="https://github.com/alex-ironside">my GitHub profile</a>.';
    grid.className = "grid__loading";
  }
}

render();
