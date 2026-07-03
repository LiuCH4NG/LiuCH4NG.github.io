# Blog 动效设计方案

## 1. 背景与目标

为基于 MkDocs Material 的个人博客增加现代精致的动效，提升首页与全局导航的视觉质感，同时不打扰阅读体验。

**设计目标**：
- 让首页 Hero、卡片、分类瓷片有层次地入场；
- 让页面加载和导航交互更连贯；
- 保持现有 Anthropic 暖色主题的克制氛围；
- 尊重用户系统偏好 `prefers-reduced-motion`；
- 不引入过度复杂的维护成本。

## 2. 动画语言

| 属性 | 取值 | 说明 |
|------|------|------|
| 主入场 | `translateY(20-28px) → 0` + `opacity(0 → 1)` | 轻盈上升，避免横向或过度夸张的位移 |
| 缓动（入场） | `power3.out` | 柔和减速，产品感强 |
| 缓动（交互） | `power2.out` | 快速响应的 hover/切换 |
| 持续时间 | 0.6–0.9s（入场）；0.2–0.35s（交互） | 符合"显著且优雅"的调性 |
| Stagger 间隔 | 0.08–0.12s | 元素依次落位，不拥挤 |
| Hover | `translateY(-3px ~ -4px)` + 阴影/边框高亮 | 在现有 CSS hover 基础上做 GSAP 微增强 |

## 3. 范围

### 3.1 本次实现

- **首页 Hero**：eyebrow、标题、描述、按钮依次 stagger 入场；
- **首页 Focus-strip**：三个 focus-item 滚动触发 stagger 入场；
- **首页精选卡片（.card）**：滚动触发 stagger 淡入上移；
- **首页分类瓷片（.category-tile）**：滚动触发 stagger 淡入 + 轻微缩放；
- **GitHub stats 区域**：整行滚动淡入；
- **顶部导航**：滚动时背景毛玻璃化 + 阴影加深；
- **主题切换按钮**：图标旋转脉冲动画；
- **返回顶部按钮**：出现/消失缩放淡入；
- **侧边栏**：激活指示条生长动画、子菜单展开过渡；
- **页面加载**：每次新页面加载后，主内容区从下方 16px 淡入。

### 3.2 不做

- 文章详情页内的代码块、图片、目录动效（本次范围外）；
- 粒子、canvas、WebGL 等重型背景效果；
- 鼠标跟随/磁吸等复杂交互；
- 自动播放的循环动画或跑马灯。

## 4. 详细设计

### 4.1 首页 Hero 入场

触发：页面 `DOMContentLoaded` 后自动播放。

| 元素 | 动画 | 延迟 | 持续时间 |
|------|------|------|----------|
| `.hero__eyebrow` | opacity + translateY | 0.1s | 0.5s |
| `.hero h1` | opacity + translateY | 0.2s | 0.7s |
| `.hero__lead` | opacity + translateY | 0.35s | 0.6s |
| `.hero__actions .md-button` | opacity + translateY | 0.5s 起，stagger 0.08s | 0.5s |

### 4.2 Focus-strip 入场

触发：ScrollTrigger，元素进入视口 20% 时。

- 三个 `.focus-item` 依次从下方 20px 淡入；
- stagger 0.1s，持续时间 0.7s。

### 4.3 精选卡片入场

触发：ScrollTrigger，卡片网格进入视口时。

- 每张 `.card` 从下方 28px 淡入；
- stagger 0.1s，持续时间 0.75s；
- 顺序为自然 DOM 顺序（从左到右、从上到下）。

### 4.4 分类瓷片入场

触发：ScrollTrigger。

- 每个 `.category-tile` 从下方 20px 淡入，并伴随 `scale(0.96 → 1)`；
- stagger 0.08s，持续时间 0.65s。

### 4.5 卡片/瓷片 Hover 增强

在现有 CSS hover 基础上，GSAP 接管做更细腻的过渡：

- 移入：`translateY(-4px)`，阴影加深，边框颜色变为 `--clay`，0.25s；
- 移出：平滑回弹，0.35s。

### 4.6 顶部导航滚动反馈

- 向下滚动超过 60px 时，给 `.md-header` 添加 `.is-scrolled` 类；
- 该类启用 `backdrop-filter: blur(12px)` 和更深的底部阴影；
- 背景色透明度略微降低，营造毛玻璃效果；
- CSS transition 控制 0.3s，GSAP/JS 只负责切换 class。

### 4.7 主题切换动画

- 点击主题切换按钮时，图标执行 180° 旋转 + `scale(1 → 1.15 → 1)` 脉冲，0.2s；
- 同时给页面根元素添加短暂的主题过渡 class，让背景色/文字色在 0.3s 内渐变；
- 不阻断 Material 原有的主题切换逻辑。

### 4.8 返回顶部按钮

- 出现：`scale(0.8 → 1)` + `opacity(0 → 1)`，0.25s；
- 消失：反向，0.2s；
- hover：额外 `translateY(-2px)`。

### 4.9 侧边栏交互

- 当前激活项 `.md-nav__link--active` 的左侧指示条从高度 0 生长到 100%，0.25s；
- 子菜单展开/折叠使用 CSS `max-height` + `opacity` 过渡，0.2s。

### 4.10 页面加载过渡

由于当前 `mkdocs.yml` 未启用 `navigation.instant`，页面跳转是整页刷新。因此采用"页面加载入场"方案：

- 每次新页面 `DOMContentLoaded` 后，`.md-content` 从下方 16px 淡入；
- 持续时间 0.5s，缓动 `power2.out`；
- 首页 Hero 的自动入场动画与内容淡入协调，避免重复动画。

> 未来若启用 `navigation.instant`，可在此基础上监听 Instant 导航事件，升级为真正的旧页淡出 + 新页上滑淡入。

## 5. 技术方案

### 5.1 依赖

通过 `mkdocs.yml` 的 `extra_javascript` 引入：

```yaml
extra_javascript:
  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js
  - https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js
  - javascripts/animations.js
```

### 5.2 文件变更

```text
docs/
├── javascripts/
│   └── animations.js      # 新建：所有动画逻辑
├── stylesheets/
│   └── extra.css          # 修改：新增动画基础类、毛玻璃类、减少动效样式
└── index.md               # 可选：为关键元素添加动画钩子类
mkdocs.yml                 # 修改：添加 extra_javascript
```

### 5.3 animations.js 结构

```javascript
// 1. 工具函数
function prefersReducedMotion() { ... }

// 2. 页面加载动画
function initPageLoadAnimations() { ... }

// 3. 滚动触发动画（ScrollTrigger）
function initScrollAnimations() { ... }

// 4. 导航与主题交互
function initNavEffects() { ... }
function initThemeToggleAnimation() { ... }

// 5. 初始化入口
document.addEventListener('DOMContentLoaded', () => {
  if (prefersReducedMotion()) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  initPageLoadAnimations();
  initScrollAnimations();
  initNavEffects();
  initThemeToggleAnimation();
});
```

### 5.4 关键实现原则

- 动画元素仅在动画期间使用 `will-change`，动画结束后移除；
- 滚动触发完全交给 ScrollTrigger，不额外监听 `scroll`；
- hover 动画使用短时长 tween，避免性能浪费；
- 所有选择器先做存在性检查，防止在文章页等无对应元素时报错；
- 如果 GSAP CDN 加载失败，页面保持完全可用。

## 6. 性能与可访问性

### 6.1 性能

- 仅对可见元素做动画，ScrollTrigger 会自动管理；
- 使用 `transform` 和 `opacity`，避免触发 layout/paint；
- 移动设备上动画表现与桌面一致，不因性能降级而丢失效果。

### 6.2 可访问性

- 检测 `prefers-reduced-motion: reduce`：
  - 禁用所有 GSAP 动画；
  - 给 `<html>` 添加 `.reduce-motion` 类；
  - CSS 中所有过渡时间降到最低，hover 位移归零。
- 不引入自动播放的闪烁、快速旋转或可能引发前庭功能障碍的动画。

### 6.3 回退

- 无 JS 环境：页面内容正常显示，无入场动画；
- GSAP 加载失败：保留原有 CSS hover 和过渡效果。

## 7. 验收标准

- [ ] 首页 Hero 元素按顺序依次入场，无抖动；
- [ ] 滚动到 focus-strip、卡片、分类瓷片时，元素依次淡入；
- [ ] 卡片/瓷片 hover 时上浮和阴影过渡细腻平滑；
- [ ] 滚动页面时顶部导航出现毛玻璃效果，回顶后恢复；
- [ ] 点击主题切换按钮时图标有旋转脉冲；
- [ ] 每次页面加载后内容区从下方淡入；
- [ ] 在 `prefers-reduced-motion: reduce` 下所有动效禁用；
- [ ] 本地 `uv run mkdocs serve` 预览无控制台报错。

## 8. 后续可扩展

- 启用 `navigation.instant` 后，升级为真正的页面切换过渡；
- 为文章详情页的目录、代码块、图片增加阅读辅助动效；
- 增加阅读进度条或章节高亮动画。
