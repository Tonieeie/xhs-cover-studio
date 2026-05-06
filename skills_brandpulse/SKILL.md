# Skill: BrandPulse 小红书封面生成器

## 目标
用户给 AI 一张图片，AI 用固定模板（`cover-template.html`）生成一张统一风格的小红书封面。
**核心约束：除了中间那张图，任何视觉元素都不能改。**

---

## 输入
- 一张用户图片（任何长宽比、任何来源）。
- （可选）顶部标签文字，比如 "Brandpulse · Journal"。默认隐藏。

## 输出
- 一张 **1200 × 1600 px**（3:4）的 PNG/JPG，作为小红书封面。

---

## 模板文件
- `cover-template.html` — 主模板（Frame 03 · 灰色渐变四面画框 / Gray Gradient Passe-partout）
- `assets/logo.jpg` — 品牌 Logo（永远不动）
- `assets/photo.jpg` — 当前封面用的图（每次被替换）

---

## AI 执行流程

### Step 1. 接收用户图片
把用户提供的图片保存为 `assets/photo.jpg`（覆盖旧文件）。

### Step 2. 检查模板
打开 `cover-template.html`，确认：
- `#cover-photo` 的 `src` 指向 `assets/photo.jpg`
- 其他元素（`#cover-canvas` 渐变画框 / `.tag` / `.lockup`）**完全不动**
- `:root` 里的 CSS 变量**完全不动**（除非用户明确要求调整）

### Step 3. 渲染并导出
- 在浏览器/无头浏览器里加载 `cover-template.html`
- 截取 `#cover-canvas` 元素，分辨率 **1200 × 1600**
- 保存为 PNG（默认）或 JPG（质量 92）
- 命名：`output/cover-{timestamp}.png`

### Step 4. 交付
把成品图返回给用户。

---

## 严格的"不要做"清单

AI 在执行此 skill 时**绝对不可以**：

1. ❌ 修改灰色渐变画框的颜色、角度、厚度
2. ❌ 修改 Logo 的位置、大小、滤镜
3. ❌ 修改 wordmark "Brandpulse" 的字体、大小、颜色
4. ❌ 修改照片的内嵌位置（top/right/bottom/left）
5. ❌ 修改 canvas 尺寸或长宽比
6. ❌ 加新文字（标题、副标题、emoji 等）
7. ❌ 替换字体
8. ❌ 给图片加滤镜或调色
9. ❌ "优化"或"改进"模板

**唯一允许做的事：换 `#cover-photo` 的 `src`。**

---

## 用户可显式请求的调整（仅当明确要求时）

这些都是 `:root` 上的 CSS 变量，改值不改规则：

| 变量 | 默认 | 含义 |
|---|---|---|
| `--frame-top` | `80px` | 上边框厚度 |
| `--frame-side` | `80px` | 左右边框厚度 |
| `--frame-bottom` | `240px` | 下边框厚度（容纳 logo lockup） |
| `--frame-grad-from` | `#5a5e63` | 渐变起始色（取自 logo 背景偏亮处） |
| `--frame-grad-to` | `#25282c` | 渐变结束色（取自 logo 背景偏暗处） |
| `--frame-grad-angle` | `145deg` | 渐变方向（左上 → 右下） |
| `--logo-size` | `160px` | Logo 直径 |
| `--logo-inset-x` | `80px` | Logo 距右边距 |
| `--logo-inset-y` | `40px` | Logo 距底边距 |
| `--wordmark-size` | `72px` | 品牌名字号 |
| `--tag-text` | `''` | 顶部小标签文字（空字符串=隐藏） |

---

## 元素角色标记（给 AI 的语义）

模板里每个元素都带 `data-ai-role` 属性：

- `data-ai-role="user-photo"` → **可改 src**，仅此一项
- `data-ai-role="locked"` → 完全锁定，跳过
- `data-ai-role="optional"` → 仅当用户明确要求时启用

AI 解析模板时应优先扫描 `data-ai-role`，按规则处理。

---

## 测试用例

### 用例 1：基本调用
> 用户："给这张图做一个封面" + [一张风景图]

→ AI: 保存图到 `assets/photo.jpg` → 渲染 → 导出 1200×1600 PNG。

### 用例 2：带顶部标签
> 用户："封面，加个 Journal 标签"

→ AI: 同上，但把 `--tag-text` 设为 `'Brandpulse · Journal'`。

### 用例 3：用户要求改样式
> 用户："边框窄一点"

→ AI: 把 `--frame-top` / `--frame-side` 从 `60px` 改为 `48px`（按比例缩 `--frame-bottom`）。**不改其他任何东西。**

---

## 未来扩展（v2）

- 支持 Frame 01（画廊框）和 Frame 02（L 角半框）作为可选模板
- 批量模式：给一组图，一次性生成一组统一封面
- 自动判断主体位置，调整 logo 落点（如主体在右下角则 logo 移到左上）
