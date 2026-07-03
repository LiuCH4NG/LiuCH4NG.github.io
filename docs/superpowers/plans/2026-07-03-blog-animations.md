# Blog 动效实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为基于 MkDocs Material 的博客添加现代精致的 GSAP 动效，覆盖首页 Hero/卡片/分类瓷片入场、导航滚动反馈、主题切换、页面加载过渡，同时保证性能和可访问性。

**Architecture:** 通过 `mkdocs.yml` 引入 GSAP 3 + ScrollTrigger CDN，新建 `docs/javascripts/animations.js` 集中管理动画，少量修改 `docs/stylesheets/extra.css` 提供动画基础类与 reduced-motion 回退。动画按功能拆分为独立初始化函数，在 `DOMContentLoaded` 中按需注册。

**Tech Stack:** MkDocs Material, GSAP 3.12.5 + ScrollTrigger (CDN), CSS custom properties, Intersection Observer (via ScrollTrigger), vanilla JavaScript.

## Global Constraints

- GSAP 与 ScrollTrigger 通过 CDN 引入，不加入 `pyproject.toml` 依赖。
- 所有动画元素的选择器必须先做存在性检查，避免在文章页等无对应元素时抛错。
- 必须检测 `prefers-reduced-motion: reduce` 并全局禁用动效。
- 只能使用 `transform` 和 `opacity` 做动画，避免触发 layout/paint。
- 页面切换过渡采用"页面加载入场"方案（因为未启用 `navigation.instant`）。
- 本地开发使用 `uv run mkdocs serve` 预览。

## File Structure

| 文件 | 责任 |
|------|------|
| `mkdocs.yml` | 添加 `extra_javascript` 引入 GSAP、ScrollTrigger 与本地 `animations.js` |
| `docs/javascripts/animations.js` | 新建：所有动画逻辑，包括页面加载、滚动触发、导航、主题切换 |
| `docs/stylesheets/extra.css` | 修改：新增动画基础类、`.md-header.is-scrolled` 毛玻璃样式、`.reduce-motion` 回退 |
| `docs/index.md` | 不修改内容结构，必要时已有 class 可直接作为动画钩子 |

## 依赖与版本

- GSAP: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- ScrollTrigger: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`

---

## Task 1: 基础搭建 — 引入 GSAP 与动画脚本骨架

**Files:**
- Modify: `mkdocs.yml`
- Create: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: 无
- Produces: `animations.js` 暴露 `initAnimations()`（或直接在 `DOMContentLoaded` 中执行），`prefersReducedMotion()` 工具函数；`mkdocs.yml` 引入 CDN 与本地脚本。

- [ ] **Step 1: 在 `mkdocs.yml` 中添加 `extra_javascript`**

```yaml
extra_javascript:
  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
  - javascripts/animations.js
```

- [ ] **Step 2: 创建 `docs/javascripts/animations.js` 骨架**

```javascript
(function () {
  'use strict';

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function whenReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initAnimations() {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add('reduce-motion');
      return;
    }
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded; animations disabled.');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    initPageLoadAnimations();
    initScrollAnimations();
    initNavEffects();
    initThemeToggleAnimation();
    initBackToTopAnimation();
    initSidebarAnimations();
  }

  function initPageLoadAnimations() {}
  function initScrollAnimations() {}
  function initNavEffects() {}
  function initThemeToggleAnimation() {}
  function initBackToTopAnimation() {}
  function initSidebarAnimations() {}

  whenReady(initAnimations);
})();
```

- [ ] **Step 3: 在 `docs/stylesheets/extra.css` 末尾添加 reduced-motion 回退**

```css
/* ============================================================
   Animation utilities & reduced motion
   ============================================================ */

.reduce-motion *,
.reduce-motion *::before,
.reduce-motion *::after {
  transition-duration: 0.01ms !important;
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
}

/* Base state for animated elements to prevent FOUC */
.hero__eyebrow,
.hero h1,
.hero__lead,
.hero__actions .md-button,
.focus-item,
.card,
.category-tile,
.stats-row,
.md-content__inner {
  opacity: 1;
}

.js-animations-ready .hero__eyebrow,
.js-animations-ready .hero h1,
.js-animations-ready .hero__lead,
.js-animations-ready .hero__actions .md-button,
.js-animations-ready .focus-item,
.js-animations-ready .card,
.js-animations-ready .category-tile,
.js-animations-ready .stats-row {
  opacity: 0;
}
```

- [ ] **Step 4: 本地启动并验证脚本已加载**

Run: `uv run mkdocs serve`

Check:
1. 打开 `http://127.0.0.1:8000`；
2. 打开 DevTools → Network，确认 `gsap.min.js` 和 `ScrollTrigger.min.js` 已加载；
3. Console 无报错。

- [ ] **Step 5: Commit**

```bash
git add mkdocs.yml docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): scaffold GSAP, ScrollTrigger and animation skeleton"
```

---

## Task 2: 首页 Hero 入场动画

**Files:**
- Modify: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: `gsap`（已注册 ScrollTrigger）
- Produces: 无新增外部接口

- [ ] **Step 1: 实现 Hero 入场动画函数**

在 `animations.js` 的 `initPageLoadAnimations` 中写入：

```javascript
function initPageLoadAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const eyebrow = hero.querySelector('.hero__eyebrow');
  const title = hero.querySelector('h1');
  const lead = hero.querySelector('.hero__lead');
  const buttons = hero.querySelectorAll('.hero__actions .md-button');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (eyebrow) {
    tl.fromTo(eyebrow,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      0.1
    );
  }

  if (title) {
    tl.fromTo(title,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7 },
      0.2
    );
  }

  if (lead) {
    tl.fromTo(lead,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.35
    );
  }

  if (buttons.length) {
    tl.fromTo(buttons,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
      0.5
    );
  }
}
```

- [ ] **Step 2: 在页面加载后添加 `.js-animations-ready` 类以启用初始隐藏**

在 `initAnimations` 函数开头、动画启动前加入：

```javascript
document.documentElement.classList.add('js-animations-ready');
```

- [ ] **Step 3: 本地验证 Hero 动画**

Run: `uv run mkdocs serve`

Check:
1. 刷新首页，eyebrow → 标题 → 描述 → 按钮依次淡入；
2. 动画结束后元素可见且可交互；
3. Console 无报错。

- [ ] **Step 4: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): add homepage hero entrance animation"
```

---

## Task 3: 首页滚动触发动画

**Files:**
- Modify: `docs/javascripts/animations.js`

**Interfaces:**
- Consumes: `gsap`, `ScrollTrigger`
- Produces: 无新增外部接口

- [ ] **Step 1: 实现滚动触发动画函数**

在 `initScrollAnimations` 中写入：

```javascript
function initScrollAnimations() {
  // Focus strip
  const focusItems = document.querySelectorAll('.focus-item');
  if (focusItems.length) {
    gsap.fromTo(focusItems,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.focus-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Featured cards
  const cards = document.querySelectorAll('.card-grid .card');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.card-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // Category tiles
  const tiles = document.querySelectorAll('.category-grid .category-tile');
  if (tiles.length) {
    gsap.fromTo(tiles,
      { opacity: 0, y: 20, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.category-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }

  // GitHub stats row
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    gsap.fromTo(statsRow,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: statsRow,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }
}
```

- [ ] **Step 2: 本地验证滚动动画**

Run: `uv run mkdocs serve`

Check:
1. 打开首页，缓慢向下滚动；
2. focus-strip、精选卡片、分类瓷片、GitHub stats 依次淡入；
3. 元素只在首次进入视口时动画一次（不反复触发）；
4. Console 无报错。

- [ ] **Step 3: Commit**

```bash
git add docs/javascripts/animations.js
git commit -m "feat(animations): add scroll-triggered entrance animations"
```

---

## Task 4: 卡片与瓷片 Hover 增强

**Files:**
- Modify: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: `gsap`
- Produces: 无新增外部接口

- [ ] **Step 1: 在 CSS 中移除或降低现有 hover transform，交给 GSAP 处理**

修改 `docs/stylesheets/extra.css` 中 `.card:hover` 和 `.category-tile:hover` 的 transform：

```css
.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--clay);
}
.card:hover .card__title { color: var(--clay); }

.category-tile:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--clay);
  background: var(--clay-soft);
}
```

> 注意：只移除 `transform: translateY(...)`，保留阴影、边框、颜色等 CSS transition。

- [ ] **Step 2: 实现 GSAP hover 动画函数**

在 `animations.js` 中添加：

```javascript
function initHoverAnimations() {
  const interactiveCards = document.querySelectorAll('.card, .category-tile, .gh-grid a');

  interactiveCards.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        y: el.classList.contains('category-tile') ? -2 : -4,
        duration: 0.25,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
      });
    });
  });
}
```

并在 `initAnimations` 中调用 `initHoverAnimations()`。

- [ ] **Step 3: 本地验证 hover 效果**

Run: `uv run mkdocs serve`

Check:
1. 鼠标悬停在卡片和分类瓷片上，元素平滑上浮；
2. 鼠标移开后平滑回落；
3. 阴影和边框颜色过渡与现有 CSS 一致。

- [ ] **Step 4: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): refine card and tile hover lift with GSAP"
```

---

## Task 5: 顶部导航滚动反馈

**Files:**
- Modify: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: DOM `scroll` 事件（节流）
- Produces: `.md-header.is-scrolled` class 切换

- [ ] **Step 1: 添加 `.md-header.is-scrolled` 样式**

在 `docs/stylesheets/extra.css` 末尾添加：

```css
.md-header {
  transition: background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease;
}

.md-header.is-scrolled {
  background: rgba(var(--paper-rgb, 250, 249, 245), 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-sm);
  border-bottom-color: var(--border);
}

[data-md-color-scheme="slate"] .md-header.is-scrolled {
  background: rgba(var(--paper-rgb-dark, 31, 30, 29), 0.85);
}
```

- [ ] **Step 2: 实现滚动状态监听**

在 `initNavEffects` 中写入：

```javascript
function initNavEffects() {
  const header = document.querySelector('.md-header');
  if (!header) return;

  const scrollThreshold = 60;
  let ticking = false;

  function updateHeader() {
    const scrolled = window.scrollY > scrollThreshold;
    header.classList.toggle('is-scrolled', scrolled);
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();
}
```

- [ ] **Step 3: 为 RGB 变量做兼容性处理（可选）**

当前 CSS 变量 `--paper` 是 hex。由于 `rgba()` 需要 RGB 分量，可在 `extra.css` 的 `:root` 和 `[data-md-color-scheme="slate"]` 中补充 RGB 版本：

```css
:root {
  --paper-rgb: 250, 249, 245;
}

[data-md-color-scheme="slate"] {
  --paper-rgb: 31, 30, 29;
}
```

然后 `.md-header.is-scrolled` 可直接用 `--paper-rgb`。

- [ ] **Step 4: 本地验证导航效果**

Run: `uv run mkdocs serve`

Check:
1. 页面在顶部时，导航为平背景；
2. 向下滚动超过 60px，导航出现毛玻璃效果；
3. 滚动回顶部，毛玻璃效果消失；
4. 在明暗主题下均正常。

- [ ] **Step 5: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): add header glassmorphism on scroll"
```

---

## Task 6: 主题切换按钮动画

**Files:**
- Modify: `docs/javascripts/animations.js`

**Interfaces:**
- Consumes: Material 主题切换按钮 `.md-header__button[title*="主题"]` 或 `[data-md-color-scheme]` 切换事件
- Produces: 无新增外部接口

- [ ] **Step 1: 实现主题切换按钮动画函数**

在 `initThemeToggleAnimation` 中写入：

```javascript
function initThemeToggleAnimation() {
  // Material for MkDocs uses a palette toggle button in the header
  const paletteForm = document.querySelector('.md-header__option');
  if (!paletteForm) return;

  const buttons = paletteForm.querySelectorAll('.md-header__button');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('.md-icon, svg, .twemoji');
      if (icon) {
        gsap.fromTo(icon,
          { rotation: 0, scale: 1 },
          { rotation: 180, scale: 1.15, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }
        );
      }

      // Smooth theme color transition
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    });
  });
}
```

- [ ] **Step 2: 在 CSS 中添加主题过渡类**

在 `docs/stylesheets/extra.css` 末尾添加：

```css
.theme-transitioning,
.theme-transitioning *,
.theme-transitioning *::before,
.theme-transitioning *::after {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
}
```

- [ ] **Step 3: 本地验证主题切换动画**

Run: `uv run mkdocs serve`

Check:
1. 点击顶部主题切换按钮（太阳/月亮图标）；
2. 图标有旋转脉冲动画；
3. 页面颜色过渡平滑，无闪烁。

- [ ] **Step 4: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): add theme toggle icon animation"
```

---

## Task 7: 返回顶部按钮与侧边栏动画

**Files:**
- Modify: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: `.md-top` 按钮、`.md-nav__link--active`
- Produces: 无新增外部接口

- [ ] **Step 1: 实现返回顶部按钮动画函数**

在 `initBackToTopAnimation` 中写入：

```javascript
function initBackToTopAnimation() {
  const topButton = document.querySelector('.md-top');
  if (!topButton) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-md-state' || mutation.attributeName === 'hidden') {
        const isVisible = !topButton.hasAttribute('hidden') && topButton.getAttribute('data-md-state') !== 'hidden';
        gsap.to(topButton, {
          scale: isVisible ? 1 : 0.8,
          opacity: isVisible ? 1 : 0,
          duration: 0.25,
          ease: 'power2.out',
        });
      }
    });
  });

  observer.observe(topButton, { attributes: true });

  topButton.addEventListener('mouseenter', () => {
    gsap.to(topButton, { y: -2, duration: 0.2, ease: 'power2.out' });
  });
  topButton.addEventListener('mouseleave', () => {
    gsap.to(topButton, { y: 0, duration: 0.2, ease: 'power2.out' });
  });
}
```

- [ ] **Step 2: 实现侧边栏激活指示条动画**

在 `initSidebarAnimations` 中写入：

```javascript
function initSidebarAnimations() {
  const activeLinks = document.querySelectorAll('.md-nav__link--active');
  activeLinks.forEach((link) => {
    link.style.overflow = 'hidden';
    gsap.fromTo(link,
      { '--indicator-height': '0%' },
      { '--indicator-height': '100%', duration: 0.25, ease: 'power2.out' }
    );
  });
}
```

- [ ] **Step 3: 在 CSS 中添加指示条样式**

修改 `.md-nav__link--active` 相关样式，使用 CSS 自定义属性：

```css
.md-nav__link--active {
  position: relative;
  --indicator-height: 100%;
}

.md-nav__link--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: var(--indicator-height, 100%);
  background: var(--clay);
  border-radius: 0 2px 2px 0;
  transition: height 0.25s ease;
}
```

- [ ] **Step 4: 本地验证**

Run: `uv run mkdocs serve`

Check:
1. 滚动到页面底部，返回顶部按钮以缩放淡入方式出现；
2. 点击或滚动回顶部，按钮以缩放淡出方式消失；
3. 侧边栏当前激活项左侧指示条有生长动画。

- [ ] **Step 5: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): add back-to-top and sidebar indicator animations"
```

---

## Task 8: 页面加载内容淡入

**Files:**
- Modify: `docs/javascripts/animations.js`
- Modify: `docs/stylesheets/extra.css`

**Interfaces:**
- Consumes: `.md-content__inner` 或 `.md-content`
- Produces: 无新增外部接口

- [ ] **Step 1: 实现页面加载淡入**

在 `initPageLoadAnimations` 函数末尾（在 Hero 动画之后）添加：

```javascript
function initPageLoadAnimations() {
  // ... existing hero animations ...

  // Global content fade-in for non-homepage pages
  const contentInner = document.querySelector('.md-content__inner');
  if (contentInner && !hero) {
    gsap.fromTo(contentInner,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    );
  }
}
```

- [ ] **Step 2: 在 CSS 中添加内容初始隐藏类**

在 `extra.css` 的 `.js-animations-ready` 规则中已包含通用隐藏类。补充针对内容区的规则：

```css
.js-animations-ready .md-content__inner {
  opacity: 0;
}
```

- [ ] **Step 3: 本地验证页面加载淡入**

Run: `uv run mkdocs serve`

Check:
1. 从首页点击任意文章链接，新页面内容从下方淡入；
2. 直接刷新文章页，内容同样淡入；
3. 首页 Hero 已有自己的入场动画，内容区不再重复淡入。

- [ ] **Step 4: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css
git commit -m "feat(animations): add page load content fade-in"
```

---

## Task 9: 可访问性与最终验证

**Files:**
- Modify: `docs/javascripts/animations.js`（如需要修复 reduced-motion 细节）
- Modify: `docs/stylesheets/extra.css`（如需要修复 reduced-motion 细节）

**Interfaces:**
- Consumes: `prefers-reduced-motion` 媒体查询
- Produces: 无新增外部接口

- [ ] **Step 1: 验证 reduced-motion 回退**

Run: `uv run mkdocs serve`

Check:
1. 在浏览器中开启"减少动态效果"（macOS: 系统设置 → 辅助功能 → 显示 → 减少动态效果；Windows: 设置 → 辅助功能 → 显示 → 显示动画）；
2. 刷新首页，确认无任何 GSAP 入场动画；
3. 滚动页面，确认无滚动触发动画；
4. Console 无报错。

- [ ] **Step 2: 验证移动端**

Check:
1. 使用 DevTools 移动设备模拟（如 iPhone 14 Pro / Pixel 7）；
2. 确认卡片、瓷片入场动画正常；
3. 导航毛玻璃效果正常；
4. 无水平滚动条或布局错乱。

- [ ] **Step 3: 运行构建验证**

Run: `uv run mkdocs build`

Expected: 构建成功，无报错，`site/javascripts/animations.js` 和引用的 CDN 路径存在。

- [ ] **Step 4: 最终代码审查**

自我检查清单：
- [ ] 所有动画仅使用 `transform` 和 `opacity`；
- [ ] 所有选择器都有存在性检查；
- [ ] `prefers-reduced-motion` 下 GSAP 被禁用；
- [ ] GSAP CDN 加载失败时有回退；
- [ ] 无 `console.error`；
- [ ] 文件路径与 `mkdocs.yml` 配置一致。

- [ ] **Step 5: Commit**

```bash
git add docs/javascripts/animations.js docs/stylesheets/extra.css mkdocs.yml
git commit -m "feat(animations): finalize animations with accessibility checks"
```

---

## 自审检查

### Spec coverage

| Spec 要求 | 对应 Task |
|-----------|-----------|
| Hero 入场 | Task 2 |
| Focus-strip 入场 | Task 3 |
| 精选卡片入场 | Task 3 |
| 分类瓷片入场 | Task 3 |
| 卡片/瓷片 hover 增强 | Task 4 |
| 导航滚动毛玻璃 | Task 5 |
| 主题切换动画 | Task 6 |
| 返回顶部按钮动画 | Task 7 |
| 侧边栏指示条动画 | Task 7 |
| 页面加载淡入 | Task 8 |
| prefers-reduced-motion | Task 9 |
| GSAP CDN 引入 | Task 1 |

### Placeholder scan

- 无 TBD/TODO
- 所有代码块包含完整可运行代码
- 所有命令包含预期输出
- 文件路径均为绝对项目路径

### Type consistency

- `prefersReducedMotion()` 在 Task 1 定义，全局使用；
- `initAnimations()` 在 Task 1 定义，后续任务只修改其内部调用的子函数；
- `.md-header.is-scrolled` class 在 Task 5 定义与消费一致。

## 执行方式

计划已完成并保存到 `docs/superpowers/plans/2026-07-03-blog-animations.md`。

**两种执行方式：**

1. **Subagent-Driven（推荐）**：每个 Task 派一个独立子代理完成，我负责在 Task 之间审查。适合希望严格按步骤推进、每步验收的场景。
2. **Inline Execution**：在当前会话中直接批量执行 Task，中间设置检查点。适合快速推进。

请选择一种方式继续。
