---
title: 8 个 Skills 注入 Claude Code，GSAP 官方终于看不下去 AI 的烂动效了
date: 2026-06-03
tags:
  - GSAP
  - Claude Code
  - AI 编程
  - Skills
---

# 8 个 Skills 注入 Claude Code，GSAP 官方终于看不下去 AI 的烂动效了

> 如果你用 Claude Code 写过 GSAP 动画，大概率收到过这种代码，它看起来完整，跑起来能用，但细节里全是坑。

![cover](../assets/wechat/gsap-skills/cover.png)

---

## 一句话总结

GSAP 官方给 Claude Code 和 Cursor 写了一套动效避坑指南，8 个模块覆盖了从基础 tween 到 React 清理的完整规范。装完之后，AI 写 GSAP 不再瞎蒙，而是照着官方推荐的方式来。

---

## AI 写的 GSAP，为什么总差点意思

我最近在研究 gsap-skills 这个项目时，翻了一下官方给 AI 列的错题本，发现里面记录的问题，跟我之前用 Claude Code 写动画时遇到的几乎一模一样。

下面这段代码，是我从一个实际项目里扒出来的 AI 输出，三句话 prompt 丢过去，Claude 30 秒就吐出来了。

```javascript
gsap.timeline().to(".box", {
  opacity: 0,                            // 坑 1，opacity 归零后元素还在，继续拦截点击
  transform: "translateX(100px)",        // 坑 2，raw CSS 字符串，没用 GSAP 的 x 别名
  scrollTrigger: { trigger: ".section" } // 坑 3，scrollTrigger 塞到 timeline 子动画里了
});
```

三个问题都很典型。

gsap-core 的 SKILL.md 里专门提醒过，AI 写动画时爱用 `opacity: 0` 做淡出。但 opacity 归零之后，元素其实还在页面上，只是看不见了。用户点过去，点击事件还是被它拦截。GSAP 的正确做法是用 `autoAlpha`，数值归零时它会自动把 `visibility` 也设成 `hidden`，元素彻底退场。

transform 的写法也一样。AI 喜欢输出 `transform: translateX(100px) rotate(45deg)` 这种 raw CSS 字符串。GSAP 团队反复强调的是，**永远用别名**。`x`、`y`、`scale`、`rotation` 这些属性走 GPU 加速，性能稳定，而且顺序固定。写成字符串交给浏览器解析，不同浏览器可能给出不同结果。

最麻烦的是 timeline 里的 scrollTrigger。我在 gsap-scrolltrigger 的 SKILL.md 里看到一条用红色标出来的禁令，**绝不能在 timeline 的子 tween 上声明 scrollTrigger**。但 AI 经常这么干，在 `gsap.timeline().to(...)` 的第二个参数里塞一个 `scrollTrigger` 配置。结果是滚动距离和时间轴进度打架，页面一滚动就开始抖。

这三个问题有个共同点，它们都不是 AI 不会写代码，而是 AI 不知道这些细节有多重要。大语言模型训练数据里堆满了各种前端教程，但它分不清哪些是过时的、哪些是最佳实践、哪些看起来对其实有坑。我看到官方管这种现象叫 **AI 动效垃圾**。

![chapter1](../assets/wechat/gsap-skills/chapter1.png)

---

## 一个收购事件，改写了前端动效的规则

2024 年 10 月，Webflow 宣布收购 GreenSock，把 GSAP 的整套动画技术纳入自己的网站体验平台。这件事本身不算大新闻，真正改变行业的是收购之后的一个决定。

Webflow 把之前所有收费的 Club GSAP 插件全部免费开放了。

SplitText、MorphSVG、Flip、Draggable、DrawSVG、MotionPath、ScrollSmoother，这些过去需要订阅 Club GSAP 才能用的插件，现在直接从公共 npm 仓库下载，不需要 `.npmrc`、不需要 auth token、不需要私有仓库配置，商业项目也可以免费用。

对普通开发者来说，这意味着高级动效的门槛归零了。对 AI 编程助手来说，这意味着一个更深层的变化。

以前大语言模型在生成代码时，由于无法在沙盒里配置 Club GSAP 的私有凭证，往往会主动回避推荐高级插件。它会说你可以用 GSAP 的基础功能实现类似效果，然后给出一个次优方案。现在，AI 可以毫无障碍地推荐、安装和使用全套 GSAP 工具链。

我发现的问题是，AI 写复杂动效的时候，出错概率也成倍上涨。以前它只是写点简单的 fade in fade out，错也错不到哪去。现在它敢给你上 MorphSVG 和 MotionPath 了，一旦按老习惯写，坑就深了。

**这就是为什么 GSAP 官方要在这个时间点推出 gsap-skills。** 当 AI 有能力生成更复杂的动效时，确保它生成的代码是对的，这件事突然变得很关键。

---

## gsap-skills 不是库，是给 AI 看的说明书

让我说清楚 gsap-skills 到底是什么。它不是一个 npm 包，也不是一段可以 import 的代码。它是一个 GitHub 仓库，里面装着 8 份 Markdown 文件，每份文件对应一个 GSAP 使用场景的最佳实践。

打开一份 SKILL.md，上面是 YAML 头，写清楚这技能叫啥、什么时候触发。下面是正文，一条条列该做什么、不该做什么，附代码示例。整份文件写得挺狠的，直接把 AI 最容易犯的错全部用 Do Not 列表标成红色。

8 个模块里，我觉得最该优先看的是这几个。

gsap-core 和 gsap-timeline 是基础，几乎所有 GSAP 项目都用得到。gsap-scrolltrigger 是最容易踩坑的，AI 在这个模块上的翻车率奇高。gsap-react 里的 useGSAP hook 必须看，用原生 useEffect 写 GSAP 在 React 里基本等于埋雷。

其他的，gsap-plugins 告诉你现在所有插件都免费了，SplitText、MorphSVG 可以直接让 AI 推荐。gsap-utils 是一些数学工具函数，像 clamp、mapRange 这些，写复杂交互时很顺手。gsap-performance 和 gsap-frameworks（Vue/Svelte 适配）则按需了解。

这些 SKILL.md 文件可以被 Claude Code、Cursor、GitHub Copilot、Windsurf、Google Antigravity 等 40 多种 AI 智能体读取。当你在 Claude Code 里输入 `/plugin marketplace add greensock/gsap-skills`，或者在终端里跑 `npx skills add https://github.com/greensock/gsap-skills`，这些规则就被注入到 AI 的上下文里了。

接下来 AI 再给你写 GSAP 代码时，它不再是基于训练数据里的前端教程瞎蒙，而是照着 GSAP 官方团队写的最佳实践来。

![chapter3](../assets/wechat/gsap-skills/chapter3.png)

---

## 几条最值得关注的反直觉规则

我没法把 8 份 SKILL.md 的内容全搬过来，但挑几个最容易被 AI 忽略、踩坑概率最高的规则讲一下。

### autoAlpha 替代 opacity

`autoAlpha: 0` 和 `opacity: 0` 看起来效果一样，但底层完全不同。opacity 归零时元素还在渲染树里，浏览器还要为它分配图层资源，而且它会继续拦截鼠标事件。autoAlpha 在归零时自动把 `visibility: hidden` 也加上，元素彻底从交互层移除。用 autoAlpha 的话，透明元素不会再占渲染资源，屏幕阅读器也不会读到已经隐藏的内容。

我之前就被 opacity 这个坑绊过。一个模态框关闭后，下面的按钮怎么点都没反应，排查了半天才发现是透明层还在上面挡着。换 autoAlpha 之后问题解决。

### timeline 的 position parameter

AI 写连续动画时喜欢堆 delay。A 动画延迟 1 秒，B 动画延迟 1.5 秒，C 动画延迟 2 秒。问题是，一旦你要调整 A 的时长，B 和 C 的延迟都要跟着改，多米诺骨牌一样。

gsap-timeline 的规范要求用 position parameter 替代 delay。`"+=0.5"` 表示上个动画结束 0.5 秒后触发，`"<"` 表示同时开始，`"<0.2"` 表示在上个动画开始 0.2 秒后触发。

我有一次改一个产品展示页，客户临时要把第一个动画从 0.8 秒改成 1.2 秒。当时用的全是手动 delay，改完一个时间后面全乱了，调了二十分钟。如果用的是 position parameter，改一个 duration 就行，后面的全部自动对齐。

```javascript
const tl = gsap.timeline({ defaults: { duration: 0.5, ease: "power2.out" } });
tl.to(".a", { x: 100 })
  .to(".b", { y: 50 }, "+=0.2")
  .to(".c", { opacity: 0 }, "<");
```

### scrollTrigger 只能绑在顶层

这条在 SKILL.md 里被标成了红色级别的禁忌。很多 AI 会在 `gsap.timeline().to(".box", { scrollTrigger: {...} })` 里嵌 scrollTrigger，结果滚动时 timeline 的进度和 scrollTrigger 的进度互相干扰，页面抖得没法看。

正确做法是把 scrollTrigger 绑在 timeline 的构造器上，或者绑在顶层的单个 tween 上，不要放在子动画里。我第一次遇到这个坑是在一个长页面项目里，页面滚动时整个 header 区域都在抖，排查了两个小时才发现 AI 把 scrollTrigger 塞进了子动画。

```javascript
// 错误
gsap.timeline().to(".box", { x: 100, scrollTrigger: { trigger: ".section" } });

// 正确
gsap.timeline({
  scrollTrigger: { trigger: ".section", start: "top center", scrub: true }
}).to(".box", { x: 100 });
```

### ScrollTrigger.batch 替代逐元素监听

当页面里有一堆卡片需要逐个进场动画时，AI 的本能是给每个卡片都绑一个 ScrollTrigger。50 张卡片就是 50 个监听器，低端设备上直接卡成 PPT。

gsap-scrolltrigger 的规范要求优先用 `ScrollTrigger.batch()`，把相近时间内进入视口的元素合并处理。性能表现比原生 IntersectionObserver 还好。我之前做过一个卡片列表页面，30 张卡片用 batch 之后，在千元安卓机上也能流畅运行。

### React 里必须用 useGSAP

gsap-react 的 SKILL.md 非常直接，**禁止用原生 useEffect 或 useLayoutEffect 声明 GSAP 动画**。必须用 `@gsap/react` 提供的 `useGSAP()` hook，它在组件卸载时会自动清理所有动画实例和监听器。

如果不这么做，React 组件频繁挂载卸载时，残留的动画实例会在已经销毁的 DOM 节点上继续运行，内存泄漏是迟早的事。我早期用 useEffect 写 GSAP 的时候，页面切换几次之后 Chrome 的内存占用就从 100MB 飙到 500MB，排查了好久才发现是动画没清理。

还有一个容易被忽略的是 `contextSafe`。当动画由异步事件触发，比如用户点击按钮，这个 tween 在 `useGSAP` 首次执行后才创建，默认不会被 hook 的清理机制覆盖。必须用 `contextSafe` 包装回调，确保它也能被安全回收。

### Vue 的 lazyLoadPlugin

gsap-frameworks 里有一个对大型项目很实用的策略。像 SplitText 这种重量级插件，如果整个应用只在两三个页面用得到，没必要在入口文件里全量引入。规范推荐写一个 `lazyLoadPlugin` 辅助函数，在组件的 `onMounted` 里动态 import，把初始包体积压到最小。

```typescript
async function lazyLoadPlugin(plugin) {
  const loader = pluginMap[plugin];
  const m = await loader();
  const p = m[plugin];
  gsap.registerPlugin(p);
  return p;
}
```

![chapter4](../assets/wechat/gsap-skills/chapter4.png)

---

## 三步用上它

看完规则，你可能想问，这东西怎么装进我的 Claude Code 或 Cursor 里。

**Claude Code**

在对话里输入 `/plugin marketplace add greensock/gsap-skills`，确认安装即可。之后 Claude 在处理任何 GSAP 相关请求时，都会自动引用这些规则。

**Cursor**

打开 Settings → Rules → Add Rule → Remote Rule，填入 `greensock/gsap-skills`。或者直接在终端跑

```bash
npx skills add https://github.com/greensock/gsap-skills
```

这个命令会自动检测你当前安装的 AI 智能体类型，把技能文件拷贝到对应目录。

**手动复制**

如果上面两种方式都不行，直接把 gsap-skills 仓库里的 `skills/` 目录复制到你智能体的技能目录就行。Claude Code 放在 `~/.claude/skills/`，Cursor 放在 `~/.cursor/skills/`，Copilot 放在 `~/.codex/skills/`。我装的时候 Claude Code 直接输命令就行，Cursor 走 Settings 稍微麻烦一点，但也就点几下鼠标的事。

装好之后的效果很直观。同一个 prompt，给这个 landing page 加一个滚动触发的卡片入场动画，之前 AI 可能会给你写一堆 `useEffect` 加手动 delay 的代码。有了 gsap-skills 之后，它会直接输出 `useGSAP` 加上 `ScrollTrigger.batch` 加上 `stagger` 的标准组合，而且不会把 scrollTrigger 嵌到 timeline 的子动画里。

---

## 交互设想，让 AI 不再盲目堆动效

gsap-skills 解决的是「AI 写出来的是对的」这个问题，但它没有解决另一个更深层的问题，AI 写出来的东西，为什么要这样动。

大语言模型缺乏审美约束。你给它的 prompt 越模糊，它越倾向于堆叠动画。在严肃的金融表单上加一个弹簧物理效果，在电商结算页面塞一个元素变形动画，这些看起来有动效但完全不合适的输出，就是我前面说的 AI 动效垃圾。

有一个很有意思的设计思路，叫 **交互设想**。它的机制很简单，在 AI 被允许写任何具体的 CSS 或 JavaScript 动画代码之前，它必须先写一句话，描述这个动画的设计美学、情感定位、转场物理模型，以及它为什么适合这个页面的业务逻辑。

举个例子。你给 AI 的指令是，给这个 SaaS 仪表盘加一个侧边栏加载动效。AI 不能直接写代码，它要先输出一段交互设想。

> 本方案采用一个干脆的 150ms ease-out 滑入加渐变效果，配合子菜单项 40ms 的极速 stagger 级联展开。整体转场克制且高效，避免给高频操作的用户带来冗长和粘滞的物理阻力感。

你读完觉得合适，点确认，AI 才会加载 gsap-core 和 gsap-performance 的规则去生成代码。如果觉得太重，你可以说再轻一点，AI 会调整设想再给你看。

这套方法把 AI 从一个拿到 prompt 就埋头写代码的复读机，变成了一个先跟你对齐审美方向、再动手实现的动效架构师。

![chapter6](../assets/wechat/gsap-skills/chapter6.png)

---

## 结尾

写完这篇文章，我的感受挺简单的。以前用 Claude Code 写 GSAP，得自己盯着它别乱用 opacity、别堆 delay、别把 scrollTrigger 塞错地方。现在有了官方 skills，这些脏活累活有人替我看着了。

而且插件全免费了。以前想玩 SplitText 还得先掏钱包，现在直接让 Claude 给你装上就行。

工具免费，规范官方，AI 能写。这三件事凑一块，做动效比以前省心太多了。
