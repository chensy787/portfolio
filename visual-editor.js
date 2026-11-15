/**
 * Sharon 作品集可视化编辑与删除工具 (Visual Inspector & Editor)
 * 作用：让用户像在 Codex / Figma 中一样，直接在网页上悬停查看、一键点击删除模块、双击改文字
 */

(function () {
  // 1. 创建固定在页面上的删除按钮与高亮框
  const deleteBadge = document.createElement('div');
  deleteBadge.id = 've-delete-badge';
  deleteBadge.innerHTML = '🗑️ 删除此模块';
  Object.assign(deleteBadge.style, {
    position: 'fixed',
    zIndex: '2147483647',
    background: '#ef4444',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.45)',
    cursor: 'pointer',
    display: 'none',
    pointerEvents: 'auto',
    border: '1px solid rgba(255,255,255,0.9)',
    transition: 'transform 0.15s ease'
  });
  deleteBadge.onmouseenter = () => { deleteBadge.style.transform = 'scale(1.08)'; };
  deleteBadge.onmouseleave = () => { deleteBadge.style.transform = 'scale(1)'; };
  document.body.appendChild(deleteBadge);

  // 2. 创建悬浮底部控制条
  const editorRoot = document.createElement('div');
  editorRoot.id = 'visual-editor-container';
  editorRoot.innerHTML = `
    <style>
      #visual-editor-container {
        position: fixed;
        bottom: 24px;
        left: 24px;
        right: auto;
        z-index: 2147483646;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .ve-pill {
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(15, 23, 42, 0.92);
        backdrop-filter: blur(14px);
        color: #fff;
        padding: 10px 18px;
        border-radius: 999px;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.15);
        cursor: pointer;
        font-size: 13.5px;
        font-weight: 600;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        user-select: none;
      }
      .ve-pill:hover {
        transform: translateY(-2px);
        background: #0f172a;
      }
      .ve-panel {
        display: none;
        align-items: center;
        gap: 12px;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(16px);
        color: #fff;
        padding: 8px 16px;
        border-radius: 16px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.18);
        font-size: 13px;
      }
      .ve-panel.active {
        display: flex;
      }
      .ve-btn {
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
        padding: 5px 12px;
        border-radius: 8px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .ve-btn:hover {
        background: rgba(255, 255, 255, 0.22);
      }
      .ve-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ve-btn-exit {
        background: #ef4444;
        border: none;
      }
      .ve-btn-exit:hover {
        background: #dc2626;
      }

      /* 悬停高亮 */
      .ve-hover-target {
        outline: 3px dashed #2563eb !important;
        outline-offset: 4px !important;
        transition: outline 0.15s ease;
      }
    </style>
    
    <div class="ve-pill" id="veOpenBtn">
      <span>🛠️ 开启可视化编辑/删除模式</span>
    </div>

    <div class="ve-panel" id="vePanel">
      <span style="color: #38bdf8; font-weight:700;">🎯 编辑模式生效中</span>
      <span style="color: #cbd5e1; font-size: 12px;">鼠标指向模块点击红按钮【🗑️ 删除】，双击可改字</span>
      <button class="ve-btn" id="veUndoBtn" disabled>↩️ 撤销 (<span id="veUndoCount">0</span>)</button>
      <button class="ve-btn" id="veExportBtn">📋 复制已删清单</button>
      <button class="ve-btn ve-btn-exit" id="veCloseBtn">退出编辑</button>
    </div>
  `;
  document.body.appendChild(editorRoot);

  const openBtn = document.getElementById('veOpenBtn');
  const panel = document.getElementById('vePanel');
  const closeBtn = document.getElementById('veCloseBtn');
  const undoBtn = document.getElementById('veUndoBtn');
  const undoCountSpan = document.getElementById('veUndoCount');
  const exportBtn = document.getElementById('veExportBtn');

  let isEditing = false;
  let currentTarget = null;
  const deletedHistory = [];
  const deletedDescriptions = [];

  openBtn.addEventListener('click', () => {
    isEditing = true;
    openBtn.style.display = 'none';
    panel.classList.add('active');
  });

  closeBtn.addEventListener('click', () => {
    isEditing = false;
    panel.classList.remove('active');
    openBtn.style.display = 'flex';
    clearHover();
  });

  function clearHover() {
    if (currentTarget) {
      currentTarget.classList.remove('ve-hover-target');
      currentTarget = null;
    }
    deleteBadge.style.display = 'none';
  }

  function describeElement(el) {
    if (!el) return '未知模块';
    const tag = el.tagName.toLowerCase();
    const h = el.querySelector('h1, h2, h3, h4');
    if (h && h.textContent.trim()) {
      return `【${h.textContent.trim().substring(0, 18)}】模块`;
    }
    if (el.className) {
      return `${tag}.${el.className.split(' ')[0]}`;
    }
    return tag;
  }

  // 鼠标移动到目标上定位删除按钮
  document.addEventListener('mouseover', (e) => {
    if (!isEditing) return;
    if (e.target === deleteBadge || e.target.closest('#visual-editor-container')) return;

    // 匹配语义块
    const target = e.target.closest(
      'section, article, .career, .career-item, .profile-card, .project-card, .strength-card, .proof-strip, .contact-panel, .exec-stat-card, .contrast-card, .mech-card, .golden-card, .chat-mock-card, .rollout-card, header, footer'
    ) || e.target;

    if (target === document.body || target === document.documentElement) return;

    if (currentTarget && currentTarget !== target) {
      currentTarget.classList.remove('ve-hover-target');
    }

    currentTarget = target;
    currentTarget.classList.add('ve-hover-target');

    // 修复定位：采用 position: fixed，直接基于 viewport 定位，确保 100% 出现
    const rect = target.getBoundingClientRect();
    const topPos = Math.max(10, rect.top + 8);
    const leftPos = Math.max(10, rect.right - 120);
    deleteBadge.style.top = `${topPos}px`;
    deleteBadge.style.left = `${leftPos}px`;
    deleteBadge.style.display = 'block';
  });

  // 点击红色的删除按钮
  deleteBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!currentTarget) return;

    const el = currentTarget;
    const desc = describeElement(el);

    deletedHistory.push({
      element: el,
      parent: el.parentNode,
      nextSibling: el.nextSibling,
      desc: desc
    });
    deletedDescriptions.push(desc);

    el.style.transition = 'all 0.25s ease';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.96)';
    setTimeout(() => {
      el.remove();
      clearHover();
      updateUndoState();
    }, 200);
  });

  // 撤销删除
  undoBtn.addEventListener('click', () => {
    if (deletedHistory.length === 0) return;
    const item = deletedHistory.pop();
    deletedDescriptions.pop();

    if (item.nextSibling && item.parent.contains(item.nextSibling)) {
      item.parent.insertBefore(item.element, item.nextSibling);
    } else {
      item.parent.appendChild(item.element);
    }

    item.element.style.opacity = '1';
    item.element.style.transform = 'scale(1)';
    updateUndoState();
  });

  function updateUndoState() {
    undoCountSpan.textContent = deletedHistory.length;
    undoBtn.disabled = deletedHistory.length === 0;
  }

  // 复制清单
  exportBtn.addEventListener('click', async () => {
    if (deletedDescriptions.length === 0) {
      alert('当前还没有删除任何模块哦！');
      return;
    }
    const text = '我想在代码中永久删除以下模块：\n' + deletedDescriptions.map((d, i) => `${i + 1}. ${d}`).join('\n');
    await navigator.clipboard.writeText(text);
    alert('已复制删除清单！发给我就能永久同步更新代码。');
  });

  // 双击文字直接编辑
  document.addEventListener('dblclick', (e) => {
    if (!isEditing) return;
    const textEl = e.target;
    if (['H1','H2','H3','H4','P','SPAN','STRONG','A','LI'].includes(textEl.tagName)) {
      textEl.contentEditable = 'true';
      textEl.focus();
      textEl.style.outline = '2px solid #38bdf8';
      textEl.addEventListener('blur', () => {
        textEl.contentEditable = 'false';
        textEl.style.outline = '';
      }, { once: true });
    }
  });
})();
