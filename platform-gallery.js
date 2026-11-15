/**
 * Sharon Chen | 联想设备管理平台·模块一级界面证据画廊 (Platform Gallery)
 * 沉浸式查看 14 张覆盖 260+ 企业、100 万+ 终端的企业级系统一级界面
 */

(function () {
  'use strict';

  // 14 张模块一级界面数据
  const GALLERY_DATA = [
    {
      id: 'ui-home',
      module: '首页看板',
      title: '平台首页看板（通用版）',
      desc: '展示纳管设备总数（342台在线/64离线/2高危）、设备类型分布及核心告警聚合，支持一键发起快捷运维。',
      src: 'assets/platform-ui/01-home.png'
    },
    {
      id: 'ui-devices',
      module: '设备管理',
      title: '设备列表与状态监控',
      desc: '纳管终端设备清单，呈现设备名称、IP/MAC、资产标签、系统版本与实时在线/离线健康状态。',
      src: 'assets/platform-ui/02-devices.png'
    },
    {
      id: 'ui-device-groups',
      module: '设备管理',
      title: '设备分组与分权纳管',
      desc: '按企业部门（研发/财务/销售）与物理机房多级划分设备组，支持组粒度的批量策略下发与权限隔离。',
      src: 'assets/platform-ui/02-device-groups.png'
    },
    {
      id: 'ui-alarm-records',
      module: '设备告警',
      title: '告警记录监控中心',
      desc: '实时汇聚硬件故障、蓝屏死机、CPU/内存满载告警，提供告警级别过滤、工单转化与一键排查。',
      src: 'assets/platform-ui/03-alarm-records.png'
    },
    {
      id: 'ui-hardware-changes',
      module: '设备告警',
      title: '硬件变更审计中心',
      desc: '对企业资产硬件（内存条增减、硬盘更换、显卡变更）进行硬件级严格审计，防止核心资产流失。',
      src: 'assets/platform-ui/03-hardware-changes.png'
    },
    {
      id: 'ui-app-deploy',
      module: '应用部署',
      title: '应用与软件批量静默分发',
      desc: '支持企业白名单软件静默安装包打包、版本控制、目标终端批量推送与安装就绪状态流转。',
      src: 'assets/platform-ui/04-app-deploy.png'
    },
    {
      id: 'ui-system-update',
      module: '系统更新',
      title: '操作系统与驱动推送',
      desc: '管理 Windows 操作系统大版本与联想原厂底层硬件驱动包分发，含前置就绪预检探针。',
      src: 'assets/platform-ui/05-system-update.png'
    },
    {
      id: 'ui-system-update-devices',
      module: '系统更新',
      title: '更新包目标设备列表',
      desc: '细粒度查看指定更新补丁包所覆盖的全部终端清单、当前下发进度与错误日志。',
      src: 'assets/platform-ui/05-system-update-devices.png'
    },
    {
      id: 'ui-patch-update',
      module: '补丁更新',
      title: '安全漏洞与补丁更新',
      desc: '同步 CVE 安全公告，支持紧急高危漏洞补丁对企业全网终端一键批量下发强制更新。',
      src: 'assets/platform-ui/06-patch-update.png'
    },
    {
      id: 'ui-task-mgmt',
      module: '任务管理',
      title: '异步任务调度中心',
      desc: '对跨数千台终端的并发任务进行状态追踪，包含任务执行中、已完成、重试机制与失败一键回退。',
      src: 'assets/platform-ui/07-task-mgmt.png'
    },
    {
      id: 'ui-warranty',
      module: '资产保修',
      title: '联想原厂保修状态查询',
      desc: '对接联想售后数据中枢，批量查询设备序列号（SN）出厂日期、在保期限与原厂维保套餐。',
      src: 'assets/platform-ui/08-warranty.png'
    },
    {
      id: 'ui-bios-lock',
      module: 'BIOS锁机',
      title: '台式机远程 BIOS 底层锁机',
      desc: 'L3 级极高危操作：通过带外管理与底层协议锁定设备 BIOS，防止失窃终端流出或数据泄露。',
      src: 'assets/platform-ui/09-bios-lock.png'
    },
    {
      id: 'ui-bios-logs',
      module: 'BIOS锁机',
      title: 'BIOS 锁机操作审计凭证',
      desc: '完整的操作日志追踪，包含操作人、审批流编号、HITL 签名凭据与执行时间戳，实现不可篡改审计。',
      src: 'assets/platform-ui/09-bios-logs.png'
    },
    {
      id: 'ui-clear',
      module: '一键清除',
      title: '数据远程一键脱敏清除',
      desc: '离职或资产回收场景，执行企业机密数据远程彻底抹除，防止商业数据残留。',
      src: 'assets/platform-ui/10-clear.png'
    }
  ];

  let currentIndex = 0;
  let currentFilter = '全部';

  // 提取去重后的模块列表
  const MODULES = ['全部', ...new Set(GALLERY_DATA.map((d) => d.module))];

  // 动态构建画廊 DOM
  function createGalleryDOM() {
    if (document.getElementById('platformGalleryModal')) return;

    const modal = document.createElement('div');
    modal.className = 'platform-gallery-modal';
    modal.id = 'platformGalleryModal';
    modal.innerHTML = `
      <div class="platform-gallery-shell" id="platformGalleryShell">
        <div class="gallery-header">
          <div class="gallery-title-box">
            <div class="gallery-title-icon"><i data-lucide="layout-grid"></i></div>
            <div class="gallery-title-text">
              <h3>联想设备管理平台 · 模块一级界面图谱 <span class="tag-scale">纳管 100 万+ 终端商用底座</span></h3>
              <p>覆盖 260+ 企业客户真实落地的管理控制台一级界面证据（共 14 张核心模块视图）</p>
            </div>
          </div>
          <div class="gallery-header-actions">
            <a href="lenovo-agent-ui-design.html" target="_blank" class="gallery-raw-btn" style="background: linear-gradient(135deg, #0066ff, #0050d8); color: #ffffff; border-color: rgba(255,255,255,0.3); font-weight: 600;" title="新窗口打开 AI 运维助手白底高保真交互画板 (8个状态)">
              <i data-lucide="sparkles" style="width:13px;height:13px;"></i> AI 助手 PoC 画板 (8 Screens) ↗
            </a>
            <a href="#" target="_blank" class="gallery-raw-btn" id="galleryRawBtn" title="新标签页查看高清原图">
              <i data-lucide="external-link" style="width:13px;height:13px;"></i> 查看原图
            </a>
            <button class="gallery-close-btn" id="galleryCloseBtn" aria-label="关闭画廊" title="关闭 (ESC)">
              <i data-lucide="x"></i>
            </button>
          </div>
        </div>

        <div class="gallery-tab-bar" id="galleryTabBar"></div>

        <div class="gallery-stage">
          <button class="gallery-nav-btn prev" id="galleryPrevBtn" aria-label="上一张">
            <i data-lucide="chevron-left"></i>
          </button>
          <div class="gallery-img-wrap">
            <img src="" alt="" class="gallery-main-img" id="galleryMainImg" />
          </div>
          <button class="gallery-nav-btn next" id="galleryNextBtn" aria-label="下一张">
            <i data-lucide="chevron-right"></i>
          </button>
        </div>

        <div class="gallery-info-bar">
          <div class="gallery-info-desc">
            <div class="info-title-row">
              <span class="info-module-badge" id="galleryInfoModule"></span>
              <strong id="galleryInfoTitle"></strong>
            </div>
            <p id="galleryInfoDesc"></p>
          </div>
          <div class="gallery-counter" id="galleryCounter">01 / 14</div>
        </div>

        <div class="gallery-thumb-strip" id="galleryThumbStrip"></div>
      </div>
    `;

    document.body.appendChild(modal);

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // 渲染 Tab 栏
  function renderTabs() {
    const bar = document.getElementById('galleryTabBar');
    if (!bar) return;
    bar.innerHTML = '';

    MODULES.forEach((mod) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `gallery-tab-item ${mod === currentFilter ? 'active' : ''}`;
      const count = mod === '全部' ? GALLERY_DATA.length : GALLERY_DATA.filter((d) => d.module === mod).length;
      btn.textContent = `${mod} (${count})`;
      btn.addEventListener('click', () => {
        currentFilter = mod;
        renderTabs();
        // 如果当前图片不在该分类中，切换至该分类的第一张
        if (currentFilter !== '全部' && GALLERY_DATA[currentIndex].module !== currentFilter) {
          const firstIndex = GALLERY_DATA.findIndex((d) => d.module === currentFilter);
          if (firstIndex !== -1) {
            updateView(firstIndex);
          }
        }
      });
      bar.appendChild(btn);
    });
  }

  // 渲染缩略图导轨
  function renderThumbnails() {
    const strip = document.getElementById('galleryThumbStrip');
    if (!strip) return;
    strip.innerHTML = '';

    GALLERY_DATA.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `gallery-thumb-item ${idx === currentIndex ? 'active' : ''}`;
      thumb.dataset.index = idx;
      thumb.innerHTML = `
        <img src="${item.src}" alt="${item.title}" loading="lazy" />
        <span class="thumb-label">${item.title}</span>
      `;
      thumb.addEventListener('click', () => {
        updateView(idx);
      });
      strip.appendChild(thumb);
    });
  }

  // 更新主视口视图
  function updateView(newIndex) {
    if (newIndex < 0) newIndex = GALLERY_DATA.length - 1;
    if (newIndex >= GALLERY_DATA.length) newIndex = 0;

    currentIndex = newIndex;
    const item = GALLERY_DATA[currentIndex];

    const img = document.getElementById('galleryMainImg');
    const infoModule = document.getElementById('galleryInfoModule');
    const infoTitle = document.getElementById('galleryInfoTitle');
    const infoDesc = document.getElementById('galleryInfoDesc');
    const counter = document.getElementById('galleryCounter');
    const rawBtn = document.getElementById('galleryRawBtn');

    if (img) {
      img.style.opacity = '0.3';
      img.src = item.src;
      img.alt = item.title;
      img.onload = () => { img.style.opacity = '1'; };
    }

    if (infoModule) infoModule.textContent = item.module;
    if (infoTitle) infoTitle.textContent = item.title;
    if (infoDesc) infoDesc.textContent = item.desc;
    if (counter) counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(GALLERY_DATA.length).padStart(2, '0')}`;
    if (rawBtn) rawBtn.href = item.src;

    // 缩略图激活状态更新与平滑滚动到可见区域
    const thumbs = document.querySelectorAll('.gallery-thumb-item');
    thumbs.forEach((t, i) => {
      const isActive = i === currentIndex;
      t.classList.toggle('active', isActive);
      if (isActive) {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });

    // 如果当前选中的分类 Tab 不是“全部”，同步匹配
    if (currentFilter !== '全部' && item.module !== currentFilter) {
      currentFilter = item.module;
      renderTabs();
    }
  }

  // 打开画廊
  function openGallery(initialIndex = 0) {
    createGalleryDOM();
    renderTabs();
    renderThumbnails();
    updateView(initialIndex);

    const modal = document.getElementById('platformGalleryModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // 禁止页面主背景滚动
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // 关闭画廊
  function closeGallery() {
    const modal = document.getElementById('platformGalleryModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // 绑定事件
  function init() {
    // 触发按钮绑定（支持点击右下角按钮或整张卡片）
    document.addEventListener('click', (e) => {
      const triggerBtn = e.target.closest('#openPlatformGalleryBtn') || e.target.closest('#openPlatformGalleryCard');
      if (triggerBtn) {
        e.preventDefault();
        openGallery(0);
        return;
      }

      // 关闭按钮
      if (e.target.closest('#galleryCloseBtn')) {
        closeGallery();
        return;
      }

      // 点击遮罩空白背景关闭
      if (e.target.id === 'platformGalleryModal') {
        closeGallery();
        return;
      }

      // 上一张/下一张
      if (e.target.closest('#galleryPrevBtn')) {
        updateView(currentIndex - 1);
        return;
      }
      if (e.target.closest('#galleryNextBtn')) {
        updateView(currentIndex + 1);
        return;
      }
    });

    // 键盘支持 (ESC 关闭，左右方向键切换)
    window.addEventListener('keydown', (e) => {
      const modal = document.getElementById('platformGalleryModal');
      if (!modal || !modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowLeft') {
        updateView(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateView(currentIndex + 1);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
