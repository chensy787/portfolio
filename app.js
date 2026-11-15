const introShell = document.querySelector('#introShell');
if (introShell && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  introShell.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    introShell.style.setProperty('--mx', `${x * 16}px`);
    introShell.style.setProperty('--my', `${y * 12}px`);
  });
}

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    siteNav.classList.toggle('open', !open);
  });
  siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    siteNav.classList.remove('open');
  }));
}

const header = document.querySelector('#siteHeader');
const sections = [...document.querySelectorAll('[data-section]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-25% 0px -62% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}

const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((node) => revealObserver.observe(node));
}

const toast = document.querySelector('.toast');
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    await navigator.clipboard.writeText(button.dataset.copy);
    if (toast) {
      toast.textContent = `已复制：${button.dataset.copy}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 1800);
    }
  });
});

const projectData = {
  device: {
    index: '01 / ENTERPRISE AGENT', title: '联想设备管理平台｜企业终端运维与 AI 助手',
    summary: '让企业 IT 管理员通过自然语言完成设备查询、告警定位、软件部署和远程任务。',
    problem: '终端数量多、信息分散、查询路径复杂，批量配置和远程操作又具有较高风险。',
    design: '将任务拆成意图识别、信息补充、平台查询、权限校验、用户确认、任务执行和结果反馈，并针对离线、超时、失败等情况设计兜底。',
    result: '完成核心任务闭环；平台上线一年覆盖 260+ 家企业，纳管终端超过 100 万台。'
  },
  rag: {
    index: '02 / LLM + RAG', title: 'STAR｜人事行政知识库 AI 助手',
    summary: '把分散制度与内部资料转化为可检索、可追溯、可维护的知识服务。',
    problem: '员工查找信息耗时，人事行政人员重复回答常见问题，知识更新后缺少稳定同步机制。',
    design: '设计员工问答与知识管理两端，补齐答案引用、原文跳转、停止生成、失败重试和用户反馈。',
    result: '形成“知识导入—内容维护—员工问答—反馈优化”的产品闭环。'
  },
  signal: {
    index: '03 / 0→1 AI PRODUCT', title: 'SignalProof｜AI 投资研究助手',
    summary: '帮助用户拆解观点、核对事实、判断信息时效性，并展示证据与风险。',
    problem: '市场观点与事实混杂、来源分散、信息时效不清，用户容易把缺少依据的内容当作确定结论。',
    design: '用 LLM 做问题拆解与解释，用规则处理时效、来源等级和字段一致性；展示支持、反对证据和未知项。',
    result: '从 0 到 1 完成产品方案与可运行 PoC，当前处于用户验证阶段。'
  }
};

const dialog = document.querySelector('#projectDialog');
if (dialog) {
  document.querySelectorAll('[data-project]').forEach((button) => button.addEventListener('click', () => {
    const data = projectData[button.dataset.project];
    dialog.querySelector('.dialog-index').textContent = data.index;
    dialog.querySelector('h3').textContent = data.title;
    dialog.querySelector('.dialog-summary').textContent = data.summary;
    ['problem', 'design', 'result'].forEach((field) => { dialog.querySelector(`[data-field="${field}"]`).textContent = data[field]; });
    dialog.showModal();
  }));
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}

// Initialize Lucide Icons across the app
if (typeof lucide !== 'undefined' && lucide.createIcons) {
  lucide.createIcons();
}
