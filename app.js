/**
 * LinkStash — app.js
 * Frontend logic
 */

// ════════════════════════════════════════════
// i18n
// ════════════════════════════════════════════
const I18N = {
    ja: {
        url_placeholder: "URLを貼り付けてEnterで登録...",
        add_btn_title: "登録",
        bookmarklet_title: "ブックマークレットの設定",
        bookmarklet_link: "⚡ 簡単登録",
        stat_count: "{n} 件",
        filter_title: "フィルター",
        filter_all: "すべて",
        filter_unread: "未読",
        filter_read: "既読",
        filter_important: "重要",
        tags_title: "タグ",
        manage_tags: "タグを管理",
        search_placeholder: "🔍 検索...",
        sort_newest: "新しい順",
        sort_oldest: "古い順",
        sort_title: "タイトル順",
        sort_priority: "重要度順",
        view_card: "カード表示",
        view_list: "リスト表示",
        export_title: "Markdownでダウンロード",
        empty_title: "リンクがありません",
        empty_sub: "上のURLバーにリンクを貼り付けて登録しましょう",
        modal_add_title: "リンクを登録",
        field_title: "タイトル",
        field_summary: "概要",
        field_tags: "タグ",
        tag_hint: "（クリックで選択 / 直接入力も可）",
        tag_add_placeholder: "タグを追加...",
        btn_add: "追加",
        field_priority: "重要度",
        field_memo: "メモ",
        memo_placeholder: "個人メモ（省略可）",
        btn_cancel: "キャンセル",
        btn_save: "登録する",
        modal_edit_title: "リンクを編集",
        field_status: "ステータス",
        status_unread: "未読",
        status_read: "既読",
        status_important: "重要",
        btn_update: "保存",
        btn_delete: "削除",
        no_title: "(タイトル不明)",
        status_toggle: "ステータス切替",
        copy_url: "URLをコピー",
        edit_link: "編集",
        toast_load_error: "データの読み込みに失敗しました",
        toast_fetch_error: "URL情報の取得に失敗しました",
        toast_saved: "登録しました!",
        toast_duplicate: "このURLはすでに登録されています",
        toast_save_error: "登録に失敗しました",
        toast_updated: "更新しました!",
        toast_update_error: "更新に失敗しました",
        toast_deleted: "削除しました",
        toast_delete_error: "削除に失敗しました",
        toast_copied: "URLをコピーしました",
        toast_exported: "Markdownをダウンロードしました",
        confirm_delete: "このリンクを削除しますか?",
    },
    en: {
        url_placeholder: "Paste a URL and press Enter...",
        add_btn_title: "Add",
        bookmarklet_title: "Bookmarklet setup",
        bookmarklet_link: "⚡ Quick Add",
        stat_count: "{n} links",
        filter_title: "Filters",
        filter_all: "All",
        filter_unread: "Unread",
        filter_read: "Read",
        filter_important: "Important",
        tags_title: "Tags",
        manage_tags: "Manage tags",
        search_placeholder: "🔍 Search...",
        sort_newest: "Newest first",
        sort_oldest: "Oldest first",
        sort_title: "By title",
        sort_priority: "By priority",
        view_card: "Card view",
        view_list: "List view",
        export_title: "Download as Markdown",
        empty_title: "No links yet",
        empty_sub: "Paste a URL in the bar above to get started",
        modal_add_title: "Add Link",
        field_title: "Title",
        field_summary: "Summary",
        field_tags: "Tags",
        tag_hint: "(click to select or type your own)",
        tag_add_placeholder: "Add tag...",
        btn_add: "Add",
        field_priority: "Priority",
        field_memo: "Memo",
        memo_placeholder: "Personal note (optional)",
        btn_cancel: "Cancel",
        btn_save: "Save",
        modal_edit_title: "Edit Link",
        field_status: "Status",
        status_unread: "Unread",
        status_read: "Read",
        status_important: "Important",
        btn_update: "Update",
        btn_delete: "Delete",
        no_title: "(No title)",
        status_toggle: "Toggle status",
        copy_url: "Copy URL",
        edit_link: "Edit",
        toast_load_error: "Failed to load data",
        toast_fetch_error: "Failed to fetch URL info",
        toast_saved: "Saved!",
        toast_duplicate: "This URL is already saved",
        toast_save_error: "Failed to save",
        toast_updated: "Updated!",
        toast_update_error: "Failed to update",
        toast_deleted: "Deleted",
        toast_delete_error: "Failed to delete",
        toast_copied: "URL copied",
        toast_exported: "Markdown downloaded",
        confirm_delete: "Delete this link?",
    },
};

let currentLang = localStorage.getItem("linkstash-lang") || "ja";

function t(key, params) {
    const str = (I18N[currentLang] || I18N.ja)[key] || I18N.ja[key] || key;
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? _);
}

function applyI18n() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll("#sort-select option[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    const btn = document.getElementById("lang-toggle");
    if (btn) btn.innerHTML = currentLang === "ja"
        ? '<span class="lang-flag">🇯🇵</span> 日本語'
        : '<span class="lang-flag">🇺🇸</span> English';
    document.documentElement.lang = currentLang === "ja" ? "ja" : "en";
}

function toggleLang() {
    currentLang = currentLang === "ja" ? "en" : "ja";
    localStorage.setItem("linkstash-lang", currentLang);
    applyI18n();
    renderAll();
}

// ════════════════════════════════════════════
// Theme
// ════════════════════════════════════════════
let currentTheme = localStorage.getItem("linkstash-theme") || "dark";

function applyTheme() {
    document.documentElement.setAttribute("data-theme", currentTheme);
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.textContent = currentTheme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("linkstash-theme", currentTheme);
    applyTheme();
}

// ════════════════════════════════════════════
// State
// ════════════════════════════════════════════
const State = {
    links: [],
    allTags: [],
    selectedTags: [],
    statusFilter: "all",
    searchQuery: "",
    sortOrder: "newest",
    viewMode: "card",    // "card" | "list"
    pendingLink: null,   // 登録確認モーダル用
    editingLink: null,   // 編集モーダル用
    pendingTags: [],     // 登録モーダルで選択中のタグ
    editTags: [],        // 編集モーダルで選択中のタグ
};

// ════════════════════════════════════════════
// API ヘルパー
// ════════════════════════════════════════════
const api = {
    async get(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
        return res.json();
    },
    async post(path, body) {
        const res = await fetch(path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw Object.assign(new Error(data.error || "Error"), { status: res.status, data });
        return data;
    },
    async put(path, body) {
        const res = await fetch(path, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
        return res.json();
    },
    async del(path) {
        const res = await fetch(path, { method: "DELETE" });
        if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
        return res.json();
    },
};

// ════════════════════════════════════════════
// トースト通知
// ════════════════════════════════════════════
function showToast(message, type = "info", duration = 3000) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    const icons = { success: "✅", error: "❌", info: "ℹ️" };
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ""}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add("removing");
        toast.addEventListener("animationend", () => toast.remove());
    }, duration);
}

// ════════════════════════════════════════════
// プログレスバー
// ════════════════════════════════════════════
function setProgress(pct) {
    document.getElementById("progress-fill").style.width = pct + "%";
}

// ════════════════════════════════════════════
// データ読み込み
// ════════════════════════════════════════════
async function loadAll() {
    try {
        const [links, tags] = await Promise.all([
            api.get("/api/links"),
            api.get("/api/tags"),
        ]);
        State.links = links;
        State.allTags = tags;
        renderAll();
    } catch (e) {
        showToast(t("toast_load_error"), "error");
    }
}

// ════════════════════════════════════════════
// フィルター・ソート適用
// ════════════════════════════════════════════
function filteredLinks() {
    let links = [...State.links];

    // キーワード検索
    if (State.searchQuery) {
        const q = State.searchQuery.toLowerCase();
        links = links.filter(l =>
            (l.title || "").toLowerCase().includes(q) ||
            (l.summary || "").toLowerCase().includes(q) ||
            (l.url || "").toLowerCase().includes(q)
        );
    }

    // ステータスフィルター
    if (State.statusFilter !== "all") {
        links = links.filter(l => l.status === State.statusFilter);
    }

    // タグフィルター
    if (State.selectedTags.length > 0) {
        links = links.filter(l =>
            State.selectedTags.every(tag => (l.tags || []).includes(tag))
        );
    }

    // ソート
    if (State.sortOrder === "newest") {
        links.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (State.sortOrder === "oldest") {
        links.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (State.sortOrder === "title") {
        links.sort((a, b) => (a.title || "").localeCompare(b.title || "", "ja"));
    } else if (State.sortOrder === "priority") {
        links.sort((a, b) => {
            const diff = (b.priority || 0) - (a.priority || 0);
            if (diff !== 0) return diff;
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }

    return links;
}

// ════════════════════════════════════════════
// 全体レンダリング
// ════════════════════════════════════════════
function renderAll() {
    renderSidebar();
    renderCards();
    renderStats();
    renderActiveFilters();
}

// ── サイドバー ──
function renderSidebar() {
    // ステータスカウント
    document.getElementById("count-all").textContent = State.links.length;
    document.getElementById("count-unread").textContent = State.links.filter(l => l.status === "unread").length;
    document.getElementById("count-read").textContent = State.links.filter(l => l.status === "read").length;
    document.getElementById("count-important").textContent = State.links.filter(l => l.status === "important").length;

    // タグ一覧（使用数付き）
    const tagCounts = {};
    State.links.forEach(l => (l.tags || []).forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
    }));
    // カスタムタグも含める
    State.allTags.forEach(t => { if (!(t in tagCounts)) tagCounts[t] = 0; });

    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const ul = document.getElementById("tag-list");
    ul.innerHTML = "";
    sorted.forEach(([tag, count]) => {
        const li = document.createElement("li");
        li.className = "tag-sidebar-item" + (State.selectedTags.includes(tag) ? " selected" : "");
        li.innerHTML = `<span>#&nbsp;${escHtml(tag)}</span><span class="tag-sidebar-count">${count}</span>`;
        li.addEventListener("click", () => toggleTagFilter(tag));
        ul.appendChild(li);
    });
}

// ── カードグリッド / リスト 切り替えレンダリング ──
function renderCards() {
    const grid = document.getElementById("card-grid");
    const empty = document.getElementById("empty-state");
    const links = filteredLinks();

    // 表示モードをgridに反映
    grid.dataset.viewMode = State.viewMode;

    if (links.length === 0) {
        grid.innerHTML = "";
        empty.classList.remove("hidden");
        return;
    }
    empty.classList.add("hidden");

    if (State.viewMode === "list") {
        grid.innerHTML = links.map(l => buildListRow(l)).join("");
    } else {
        grid.innerHTML = links.map(l => buildCard(l)).join("");
    }

    // 共通イベント設定
    grid.querySelectorAll("[data-id]").forEach(el => {
        el.addEventListener("click", e => {
            if (e.target.closest(".card-action-btn") || e.target.closest(".card-tag") ||
                e.target.closest(".list-actions")) return;
            openLinkInBrowser(el.dataset.id);
        });
    });
    grid.querySelectorAll(".card-tag").forEach(el => {
        el.addEventListener("click", () => toggleTagFilter(el.dataset.tag));
    });
    grid.querySelectorAll(".copy-btn").forEach(el => {
        el.addEventListener("click", e => { e.stopPropagation(); copyUrl(el.dataset.id); });
    });
    grid.querySelectorAll(".edit-btn").forEach(el => {
        el.addEventListener("click", e => { e.stopPropagation(); openEditModal(el.dataset.id); });
    });
    grid.querySelectorAll(".status-btn").forEach(el => {
        el.addEventListener("click", e => { e.stopPropagation(); cycleStatus(el.dataset.id); });
    });
    // Star rating: click + hover preview
    grid.querySelectorAll(".star-rating").forEach(container => {
        const stars = container.querySelectorAll(".star-rating-star");
        stars.forEach(el => {
            el.addEventListener("click", e => {
                e.stopPropagation();
                setStarRating(el.dataset.linkId, parseInt(el.dataset.star));
            });
            el.addEventListener("mouseenter", () => {
                const hoverVal = parseInt(el.dataset.star);
                stars.forEach(s => {
                    s.classList.toggle("hover-preview", parseInt(s.dataset.star) <= hoverVal);
                });
            });
        });
        container.addEventListener("mouseleave", () => {
            stars.forEach(s => s.classList.remove("hover-preview"));
        });
    });
}

// ── リスト行 ──
function buildListRow(l) {
    const domain = (() => {
        try { return new URL(l.url).hostname.replace("www.", ""); } catch { return l.url; }
    })();
    const statusIcon =
        l.status === "important" ? "⭐" :
        l.status === "read"      ? "✅" : "⬜";
    const tags = (l.tags || []).map(t =>
        `<span class="card-tag" data-tag="${escHtml(t)}">#${escHtml(t)}</span>`
    ).join("");
    const date = l.created_at ? formatDate(l.created_at) : "";

    const priority = l.priority || 0;

    return `
<div class="list-row" data-id="${l.id}">
  <button class="card-action-btn status-btn${l.status === "important" ? " is-important" : l.status === "read" ? " is-read" : ""}"
          data-id="${l.id}" title="${t("status_toggle")}">${statusIcon}</button>
  <div class="list-title">${escHtml(l.title || t("no_title"))}</div>
  ${buildStars(l.id, priority, "list")}
  <div class="list-domain">${escHtml(domain)}</div>
  <div class="list-tags">${tags}</div>
  <div class="list-date">${date}</div>
  <div class="list-actions">
    <button class="card-action-btn copy-btn" data-id="${l.id}" title="${t("copy_url")}">📋</button>
    <button class="card-action-btn edit-btn" data-id="${l.id}" title="${t("edit_link")}">✎</button>
  </div>
</div>`;
}

function buildCard(l) {
    const domain = (() => {
        try { return new URL(l.url).hostname.replace("www.", ""); } catch { return l.url; }
    })();
    const statusClass = `status-${l.status || "unread"}`;
    const statusIcon =
        l.status === "important" ? "⭐" :
            l.status === "read" ? "✅" : "⬜";

    const thumb = l.thumbnail
        ? `<img class="card-thumb" src="${escHtml(l.thumbnail)}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
        : "";
    const placeholder = `<div class="card-thumb-placeholder" ${l.thumbnail ? 'style="display:none"' : ""}>🔗</div>`;

    const tags = (l.tags || []).map(t =>
        `<span class="card-tag" data-tag="${escHtml(t)}">#${escHtml(t)}</span>`
    ).join("");

    const memo = l.memo ? `<span class="card-memo-icon" title="${escHtml(l.memo)}">📝</span>` : "";
    const date = l.created_at ? formatDate(l.created_at) : "";
    const priority = l.priority || 0;

    return `
<div class="link-card ${statusClass}" data-id="${l.id}">
  <div class="card-status-bar"></div>
  ${thumb}${placeholder}
  <div class="card-body">
    <div class="card-domain">🌐 ${escHtml(domain)}</div>
    <div class="card-title">${escHtml(l.title || t("no_title"))}</div>
    <div class="card-summary">${escHtml(l.summary || "")}</div>
    <div class="card-tags">${tags}</div>
  </div>
  <div class="card-footer">
    <span class="card-date">${date}</span>
    ${memo}
    <div class="card-footer-right">
      ${buildStars(l.id, priority, "card")}
      <div class="card-actions">
        <button class="card-action-btn status-btn ${l.status === "important" ? "is-important" : l.status === "read" ? "is-read" : ""}"
                data-id="${l.id}" title="${t("status_toggle")}">${statusIcon}</button>
        <button class="card-action-btn copy-btn" data-id="${l.id}" title="${t("copy_url")}">📋</button>
        <button class="card-action-btn edit-btn" data-id="${l.id}" title="${t("edit_link")}">✎</button>
      </div>
    </div>
  </div>
</div>`;
}

// ── ヘッダー統計 ──
function renderStats() {
    document.getElementById("stat-count").textContent = t("stat_count", { n: State.links.length });
}

// ── アクティブフィルター表示 ──
function renderActiveFilters() {
    const container = document.getElementById("active-filters");
    container.innerHTML = "";
    State.selectedTags.forEach(tag => {
        const chip = document.createElement("div");
        chip.className = "active-filter-chip";
        chip.innerHTML = `#${escHtml(tag)} <span class="remove-chip">✕</span>`;
        chip.querySelector(".remove-chip").addEventListener("click", () => {
            State.selectedTags = State.selectedTags.filter(t => t !== tag);
            renderAll();
        });
        container.appendChild(chip);
    });
}

// ════════════════════════════════════════════
// タグフィルター切替
// ════════════════════════════════════════════
function toggleTagFilter(tag) {
    if (State.selectedTags.includes(tag)) {
        State.selectedTags = State.selectedTags.filter(t => t !== tag);
    } else {
        State.selectedTags.push(tag);
    }
    renderAll();
}

// ════════════════════════════════════════════
// URL登録フロー
// ════════════════════════════════════════════
async function startAddLink(url) {
    if (!url) return;
    url = url.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
    }

    // ローディング表示
    const addBtn = document.getElementById("add-btn");
    addBtn.classList.add("loading");
    document.getElementById("add-btn-icon").textContent = "⟳";
    setProgress(30);

    try {
        const info = await api.post("/api/fetch", { url });
        State.pendingLink = info;
        State.pendingTags = [...(info.suggested_tags || [])];
        openAddModal(info);
    } catch (e) {
        showToast(t("toast_fetch_error"), "error");
    } finally {
        addBtn.classList.remove("loading");
        document.getElementById("add-btn-icon").textContent = "＋";
        document.getElementById("url-input").value = "";
        setProgress(0);
    }
}

// ════════════════════════════════════════════
// 登録確認モーダル
// ════════════════════════════════════════════
function openAddModal(info) {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.remove("hidden");

    // プレビュー
    const thumb = document.getElementById("preview-thumb");
    if (info.thumbnail) {
        thumb.src = info.thumbnail;
        thumb.classList.remove("hidden");
    } else {
        thumb.classList.add("hidden");
    }
    document.getElementById("preview-url").textContent = info.url;
    document.getElementById("edit-title").value = info.title || "";
    document.getElementById("edit-summary").value = info.summary || "";
    document.getElementById("edit-memo").value = "";

    // 重要度（星）
    renderAddStars(0);

    // タグ候補
    renderSuggestedTags();
    renderPendingSelectedTags();
}

function renderSuggestedTags() {
    const info = State.pendingLink;
    const container = document.getElementById("suggested-tags");
    container.innerHTML = "";
    (info?.suggested_tags || []).forEach(tag => {
        const chip = document.createElement("button");
        chip.className = "suggest-chip" + (State.pendingTags.includes(tag) ? " selected" : "");
        chip.textContent = `#${tag}`;
        chip.addEventListener("click", () => {
            if (State.pendingTags.includes(tag)) {
                State.pendingTags = State.pendingTags.filter(t => t !== tag);
            } else {
                State.pendingTags.push(tag);
            }
            renderSuggestedTags();
            renderPendingSelectedTags();
        });
        container.appendChild(chip);
    });
}

function renderPendingSelectedTags() {
    const container = document.getElementById("selected-tags");
    container.innerHTML = "";
    State.pendingTags.forEach(tag => {
        const chip = document.createElement("span");
        chip.className = "selected-chip";
        chip.innerHTML = `#${escHtml(tag)} <span class="remove-tag">✕</span>`;
        chip.querySelector(".remove-tag").addEventListener("click", () => {
            State.pendingTags = State.pendingTags.filter(t => t !== tag);
            renderSuggestedTags();
            renderPendingSelectedTags();
        });
        container.appendChild(chip);
    });
}

function closeAddModal() {
    document.getElementById("modal-overlay").classList.add("hidden");
    State.pendingLink = null;
    State.pendingTags = [];
}

async function saveNewLink() {
    if (!State.pendingLink) return;
    const title = document.getElementById("edit-title").value.trim();
    const summary = document.getElementById("edit-summary").value.trim();
    const memo = document.getElementById("edit-memo").value.trim();
    setProgress(60);
    try {
        const addPriority = parseInt(document.getElementById("add-priority-stars")?.dataset.value || "0");
        const newLink = await api.post("/api/links", {
            url: State.pendingLink.url,
            title: title || State.pendingLink.title,
            summary: summary || State.pendingLink.summary,
            thumbnail: State.pendingLink.thumbnail,
            tags: State.pendingTags,
            priority: addPriority,
            memo,
        });
        State.links.unshift(newLink);
        // タグ一覧を更新
        State.allTags = [...new Set([...State.allTags, ...State.pendingTags])].sort();
        closeAddModal();
        renderAll();
        showToast(t("toast_saved"), "success");
    } catch (e) {
        if (e.status === 409) {
            showToast(t("toast_duplicate"), "error");
        } else {
            showToast(t("toast_save_error"), "error");
        }
    } finally {
        setProgress(0);
    }
}

// ════════════════════════════════════════════
// 編集モーダル
// ════════════════════════════════════════════
function openEditModal(id) {
    const link = State.links.find(l => l.id === id);
    if (!link) return;
    State.editingLink = link;
    State.editTags = [...(link.tags || [])];

    document.getElementById("edit-link-title").value = link.title || "";
    document.getElementById("edit-link-summary").value = link.summary || "";
    document.getElementById("edit-link-memo").value = link.memo || "";

    // ステータス
    ["unread", "read", "important"].forEach(s => {
        const radio = document.querySelector(`input[name="edit-status"][value="${s}"]`);
        if (radio) radio.checked = link.status === s;
    });

    // 重要度（星）
    renderEditStars(link.priority || 0);

    renderEditSelectedTags();
    document.getElementById("edit-modal-overlay").classList.remove("hidden");
}

function renderEditSelectedTags() {
    const container = document.getElementById("edit-selected-tags");
    container.innerHTML = "";
    State.editTags.forEach(tag => {
        const chip = document.createElement("span");
        chip.className = "selected-chip";
        chip.innerHTML = `#${escHtml(tag)} <span class="remove-tag">✕</span>`;
        chip.querySelector(".remove-tag").addEventListener("click", () => {
            State.editTags = State.editTags.filter(t => t !== tag);
            renderEditSelectedTags();
        });
        container.appendChild(chip);
    });
}

function renderEditStars(current) {
    const container = document.getElementById("edit-priority-stars");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const span = document.createElement("span");
        span.className = "star-rating-star edit-star" + (i <= current ? " filled" : "");
        span.textContent = "\u2733";  // placeholder, replaced below
        span.innerHTML = "&#9733;";
        span.dataset.star = i;
        span.addEventListener("click", () => {
            // Toggle off if same star
            const cur = parseInt(container.dataset.value || "0");
            const newVal = cur === i ? 0 : i;
            container.dataset.value = newVal;
            renderEditStars(newVal);
        });
        container.appendChild(span);
    }
    container.dataset.value = current;
}

function renderAddStars(current) {
    const container = document.getElementById("add-priority-stars");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const span = document.createElement("span");
        span.className = "star-rating-star edit-star" + (i <= current ? " filled" : "");
        span.innerHTML = "&#9733;";
        span.dataset.star = i;
        span.addEventListener("click", () => {
            const cur = parseInt(container.dataset.value || "0");
            const newVal = cur === i ? 0 : i;
            container.dataset.value = newVal;
            renderAddStars(newVal);
        });
        container.appendChild(span);
    }
    container.dataset.value = current;
}

function closeEditModal() {
    document.getElementById("edit-modal-overlay").classList.add("hidden");
    State.editingLink = null;
    State.editTags = [];
}

async function saveEditLink() {
    if (!State.editingLink) return;
    const id = State.editingLink.id;
    const status = document.querySelector('input[name="edit-status"]:checked')?.value || "unread";
    const editPriority = parseInt(document.getElementById("edit-priority-stars")?.dataset.value || "0");
    const body = {
        title: document.getElementById("edit-link-title").value.trim(),
        summary: document.getElementById("edit-link-summary").value.trim(),
        memo: document.getElementById("edit-link-memo").value.trim(),
        tags: State.editTags,
        status,
        priority: editPriority,
    };
    try {
        const updated = await api.put(`/api/links/${id}`, body);
        const idx = State.links.findIndex(l => l.id === id);
        if (idx >= 0) State.links[idx] = updated;
        State.allTags = [...new Set([...State.allTags, ...State.editTags])].sort();
        closeEditModal();
        renderAll();
        showToast(t("toast_updated"), "success");
    } catch (e) {
        showToast(t("toast_update_error"), "error");
    }
}

async function deleteLink() {
    if (!State.editingLink) return;
    const id = State.editingLink.id;
    if (!confirm(t("confirm_delete"))) return;
    try {
        await api.del(`/api/links/${id}`);
        State.links = State.links.filter(l => l.id !== id);
        closeEditModal();
        renderAll();
        showToast(t("toast_deleted"), "info");
    } catch (e) {
        showToast(t("toast_delete_error"), "error");
    }
}

// ════════════════════════════════════════════
// ステータスサイクル（カードから直接）
// ════════════════════════════════════════════
async function cycleStatus(id) {
    const link = State.links.find(l => l.id === id);
    if (!link) return;
    const cycle = { unread: "read", read: "important", important: "unread" };
    const next = cycle[link.status] || "unread";
    try {
        const updated = await api.put(`/api/links/${id}`, { status: next });
        const idx = State.links.findIndex(l => l.id === id);
        if (idx >= 0) State.links[idx] = updated;
        renderAll();
    } catch (e) {
        showToast(t("toast_update_error"), "error");
    }
}

// ════════════════════════════════════════════
// コピー・ブラウザ起動
// ════════════════════════════════════════════
function copyUrl(id) {
    const link = State.links.find(l => l.id === id);
    if (!link) return;
    navigator.clipboard.writeText(link.url).then(() => {
        showToast(t("toast_copied"), "success", 1500);
    });
}

function openLinkInBrowser(id) {
    const link = State.links.find(l => l.id === id);
    if (!link) return;
    window.open(link.url, "_blank", "noopener,noreferrer");
}

// ════════════════════════════════════════════
// 星レーティング
// ════════════════════════════════════════════
function buildStars(linkId, current, context = "card") {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const filled = i <= current;
        stars.push(
            `<span class="star-rating-star ${filled ? "filled" : ""}" data-star="${i}" data-link-id="${linkId}" data-context="${context}">&#9733;</span>`
        );
    }
    return `<span class="star-rating" data-link-id="${linkId}" data-context="${context}">${stars.join("")}</span>`;
}

async function setStarRating(id, rating) {
    const link = State.links.find(l => l.id === id);
    if (!link) return;
    // Toggle off if clicking the same star
    const newRating = link.priority === rating ? 0 : rating;
    try {
        const updated = await api.put(`/api/links/${id}`, { priority: newRating });
        const idx = State.links.findIndex(l => l.id === id);
        if (idx >= 0) State.links[idx] = updated;
        renderAll();
    } catch (e) {
        showToast(t("toast_update_error"), "error");
    }
}

// ════════════════════════════════════════════
// ユーティリティ
// ════════════════════════════════════════════
function escHtml(str) {
    return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function formatDate(iso) {
    try {
        const d = new Date(iso);
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    } catch { return ""; }
}

// ════════════════════════════════════════════
// イベント設定
// ════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
    // URL入力 → Enter で登録
    const urlInput = document.getElementById("url-input");
    urlInput.addEventListener("keydown", e => {
        if (e.key === "Enter") startAddLink(urlInput.value);
    });
    document.getElementById("add-btn").addEventListener("click", () => {
        startAddLink(urlInput.value);
    });

    // URL貼り付け（ペースト時に自動起動オプション）
    urlInput.addEventListener("paste", e => {
        // 少し待って値を取得してから自動起動
        setTimeout(() => {
            if (urlInput.value.trim()) startAddLink(urlInput.value);
        }, 100);
    });

    // 登録モーダル
    document.getElementById("modal-close").addEventListener("click", closeAddModal);
    document.getElementById("modal-cancel").addEventListener("click", closeAddModal);
    document.getElementById("modal-save").addEventListener("click", saveNewLink);
    document.getElementById("modal-overlay").addEventListener("click", e => {
        if (e.target === document.getElementById("modal-overlay")) closeAddModal();
    });

    // 登録モーダル タグ入力
    const tagInput = document.getElementById("tag-input");
    document.getElementById("tag-add-btn").addEventListener("click", () => {
        const v = tagInput.value.trim();
        if (v && !State.pendingTags.includes(v)) {
            State.pendingTags.push(v);
            renderSuggestedTags();
            renderPendingSelectedTags();
        }
        tagInput.value = "";
    });
    tagInput.addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("tag-add-btn").click();
    });

    // 編集モーダル
    document.getElementById("edit-modal-close").addEventListener("click", closeEditModal);
    document.getElementById("edit-modal-cancel").addEventListener("click", closeEditModal);
    document.getElementById("edit-modal-save").addEventListener("click", saveEditLink);
    document.getElementById("edit-modal-delete").addEventListener("click", deleteLink);
    document.getElementById("edit-modal-overlay").addEventListener("click", e => {
        if (e.target === document.getElementById("edit-modal-overlay")) closeEditModal();
    });

    // 編集モーダル タグ入力
    const editTagInput = document.getElementById("edit-tag-input");
    document.getElementById("edit-tag-add-btn").addEventListener("click", () => {
        const v = editTagInput.value.trim();
        if (v && !State.editTags.includes(v)) {
            State.editTags.push(v);
            renderEditSelectedTags();
        }
        editTagInput.value = "";
    });
    editTagInput.addEventListener("keydown", e => {
        if (e.key === "Enter") document.getElementById("edit-tag-add-btn").click();
    });

    // ステータスフィルター
    document.querySelectorAll(".filter-item").forEach(el => {
        el.addEventListener("click", () => {
            document.querySelectorAll(".filter-item").forEach(x => x.classList.remove("active"));
            el.classList.add("active");
            State.statusFilter = el.dataset.status;
            renderAll();
        });
    });

    // 検索
    document.getElementById("search-input").addEventListener("input", e => {
        State.searchQuery = e.target.value.trim();
        renderAll();
    });

    // ソート
    document.getElementById("sort-select").addEventListener("change", e => {
        State.sortOrder = e.target.value;
        renderAll();
    });

    // 表示切替（カード / リスト）
    document.getElementById("view-card-btn").addEventListener("click", () => {
        State.viewMode = "card";
        document.getElementById("view-card-btn").classList.add("active");
        document.getElementById("view-list-btn").classList.remove("active");
        renderCards();
    });
    document.getElementById("view-list-btn").addEventListener("click", () => {
        State.viewMode = "list";
        document.getElementById("view-list-btn").classList.add("active");
        document.getElementById("view-card-btn").classList.remove("active");
        renderCards();
    });

    // Markdownエクスポート
    document.getElementById("export-btn").addEventListener("click", () => {
        const params = new URLSearchParams();
        if (State.selectedTags.length > 0) {
            params.set("tags", State.selectedTags.join(","));
        }
        const url = "/api/export/markdown" + (params.toString() ? "?" + params.toString() : "");
        const a = document.createElement("a");
        a.href = url;
        a.click();
        showToast(t("toast_exported"), "success", 2000);
    });

    // Escキーでモーダルを閉じる
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeAddModal();
            closeEditModal();
        }
    });

    // 言語切替
    document.getElementById("lang-toggle").addEventListener("click", toggleLang);
    applyI18n();

    // テーマ切替
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    applyTheme();

    // 初期データ読み込み
    loadAll().then(() => {
        // ブックマークレットからのURL自動登録（?url=... パラメータ対応）
        const params = new URLSearchParams(window.location.search);
        const autoUrl = params.get("url");
        if (autoUrl) {
            // URLバーに表示してから登録フローを起動
            urlInput.value = autoUrl;
            // 履歴からクエリパラメータを除去（戻ったときに再登録しないように）
            history.replaceState(null, "", "/");
            startAddLink(autoUrl);
        }
    });
});
