# 人生星球 LifeSphere v2 — 开发计划

基于 plan2.md + 用户反馈迭代。

---

## 一、技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 19 + TypeScript + Vite + Tailwind CSS v4 |
| 路由 | React Router v6（SPA 多页面跳转） |
| 后端 | Golang + Gin + GORM + SQLite |
| API | RESTful JSON |

前后端同放在 `lifesphere/` 目录下。

---

## 二、项目目录结构

```
lifesphere/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx           # 顶部固定导航 60px
│   │   │   ├── QuoteCarousel.tsx    # 语录轮播（仅首页）
│   │   │   ├── ContentCard.tsx      # 通用卡片
│   │   │   └── PageLayout.tsx       # 通用页面容器
│   │   ├── pages/
│   │   │   ├── Home.tsx             # 首页（语录轮播+简介）
│   │   │   ├── DailyReview.tsx      # 我的日复盘（年份侧栏+三卡片+书本视图）
│   │   │   ├── Investment.tsx       # 我的投资
│   │   │   ├── Reading.tsx          # 我的阅读
│   │   │   ├── Reflections.tsx      # 我的感悟
│   │   │   └── Settings.tsx         # 设置（仅语录管理）
│   │   ├── types/index.ts
│   │   ├── services/api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── main.go
│   ├── go.mod
│   ├── config/config.go
│   ├── database/
│   │   ├── db.go
│   │   └── migrate.go
│   ├── models/
│   │   ├── quote.go
│   │   ├── daily_log.go
│   │   ├── reflection.go
│   │   ├── todo.go
│   │   ├── investment.go
│   │   ├── reading.go
│   │   └── reflection_post.go
│   ├── handlers/
│   │   ├── quote_handler.go
│   │   ├── daily_handler.go
│   │   ├── investment_handler.go
│   │   ├── reading_handler.go
│   │   └── reflection_handler.go
│   └── routes/routes.go
```

---

## 三、设计规范

| 元素 | 值 |
|---|---|
| 背景 | `#FFFFFF` |
| 主文字 | `#333333` |
| 次要文字 | `#555555` |
| 轮播背景 | `#F8F9FA` |
| 导航高度 | 60px（固定顶部通栏） |
| 内容容器 | max-width 1200px，水平居中 |
| 卡片圆角 | 8px |
| 通用圆角 | 6px |
| 卡片阴影 | `0 2px 12px rgba(0,0,0,0.08)` |

风格：极简文艺，白底灰字，干净留白，无多余动画。

---

## 四、路由规划

| 路径 | 页面 | 说明 |
|---|---|---|
| `/` | Home | 唯一显示语录轮播的页面 |
| `/daily-review` | DailyReview | 我的日复盘 |
| `/investment` | Investment | 我的投资 |
| `/reading` | Reading | 我的阅读 |
| `/reflections` | Reflections | 我的感悟 |
| `/settings` | Settings | 设置（仅语录管理） |

---

## 五、导航栏 Navbar

- 固定顶部通栏，高度 60px
- 菜单**硬编码**（菜单管理功能已删除）
- 菜单项：首页 / 我的日复盘 / 我的投资 / 我的阅读 / 我的感悟
- 最右侧：设置按钮（齿轮图标 → `/settings`）

---

## 六、首页 Home

```
导航栏
─────────────────────────────
    名人语录轮播（全宽，#F8F9FA）
    ┌─────────────────────┐
    │   「语录内容」       │
    │   —— 作者名          │
    │   ● ○ ○ ○ ○         │
    └─────────────────────┘
    内容容器（max-width 1200px，居中）
    ┌─────────────────────┐
    │  个人简介            │
    │  站点说明            │
    └─────────────────────┘
```

---

## 七、我的日复盘（核心复杂页面）

### 布局结构

```
导航栏
─────────────────────────────
┌──────────────┬──────────────────────────────────────┐
│  左侧年份菜单  │  右侧内容区                          │
│  (240px)      │  (flex-1)                           │
│              │                                      │
│  ▶ 2026年    │  [默认展示三卡片视图]                 │
│    ├ 流水账   │  ┌─────────┐┌────────┐┌─────────┐  │
│    ├ 感悟     │  │ 流水账   ││ 感悟    ││ Todo    │  │
│    └ Todo     │  │ 3条     ││ 2条    ││ 5条     │  │
│              │  │ [新增]   ││ [新增]  ││ [新增]   │  │
│  ▶ 2025年    │  └─────────┘└────────┘└─────────┘  │
│    ├ 流水账   │  ┌──────────────────────────────────┐│
│    ├ 感悟     │  │       [ + 创建年份 ]              ││
│    └ Todo     │  └──────────────────────────────────┘│
│              │                                      │
│              │  [点击左侧子项时展示书本视图]          │
│              │  ┌──────────────────────────────┐    │
│              │  │ 2026 · 流水账               │    │
│              │  │  ┌─────────────────────────┐ │    │
│              │  │  │ 2026-03-15              │ │    │
│              │  │  │ 今天去了公园散步...      │ │    │
│              │  │  ├─────────────────────────┤ │    │
│              │  │  │ 2026-03-14              │ │    │
│              │  │  │ 看了一本好书...          │ │    │
│              │  │  └─────────────────────────┘ │    │
│              │  └──────────────────────────────┘    │
└──────────────┴──────────────────────────────────────┘
```

### 左侧年份菜单

- 展示所有已创建的年份列表
- 每个年份可展开/折叠（▶/▼），展开后显示三个子项：流水账、感悟、Todo
- 点击年份 → 右侧显示该年份的**三卡片视图**
- 点击子项（如 2026 → 流水账）→ 右侧显示该年份下该类型所有条目，**书本式布局**

### 右侧三卡片视图（点击年份时）

- 三卡片等分并排（`flex-1`）
- 每张卡片：类型名称 + 条目数量 + **[新增]** 按钮
- [新增] 点击 → 弹出创建表单，字段包含：
  - 内容（textarea）
  - 日期（自动当天，可改）
  - **年份标签**（自动归属当前选中年份）
- 卡片下方有 **[+ 创建年份]** 按钮 → 创建新的年份（例如从 2026 创建 2027），新年份出现在左侧菜单

### 右侧书本视图（点击子项时）

- 展示该年份 + 该类型的所有条目
- 卡片按日期倒序排列，像书页一样
- 每条可编辑/删除

### 数据流

- 每条日复盘数据（流水账/感悟/Todo）都有一个 `year` 字段
- 左侧年份列表从数据中聚合得出（`SELECT DISTINCT year`）
- 新增条目时自动归属当前选中年份

---

## 八、内容页面（投资/阅读/感悟）统一布局

```
导航栏
─────────────────────────────
居中容器（max-width 1200px）
┌──────────────────────────┐
│  我的投资              [+新增] │
├──────────────────────────┤
│  ┌──────────────────────┐│
│  │ 卡片（标题+内容+时间） ││
│  │ [编辑] [删除]          ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ ...                   ││
│  └──────────────────────┘│
└──────────────────────────┘
```

---

## 九、设置页面 Settings

```
导航栏
─────────────────────────────
居中容器（max-width 1200px）
┌──────────────────────────┐
│  名人语录管理              │
│  ┌──────────────────────┐│
│  │ 语录1  [编辑] [删除]  ││
│  │ 语录2  [编辑] [删除]  ││
│  │ [+ 新增语录]          ││
│  └──────────────────────┘│
└──────────────────────────┘
```

---

## 十、数据模型

### Quote（名人语录）
```go
type Quote struct {
  ID      uint   `gorm:"primaryKey" json:"id"`
  Content string `json:"content"`
  Author  string `json:"author"`
}
```

### DailyLog（流水账）
```go
type DailyLog struct {
  ID      uint   `gorm:"primaryKey" json:"id"`
  Content string `json:"content"`
  Date    string `json:"date"`       // YYYY-MM-DD
  Year    int    `json:"year"`       // 归属年份，如 2026
}
```

### DailyReflection（感悟条目）
```go
type DailyReflection struct {
  ID      uint   `gorm:"primaryKey" json:"id"`
  Content string `json:"content"`
  Date    string `json:"date"`
  Year    int    `json:"year"`
}
```

### Todo（待办条目）
```go
type Todo struct {
  ID      uint   `gorm:"primaryKey" json:"id"`
  Content string `json:"content"`
  Done    bool   `json:"done"`
  Date    string `json:"date"`
  Year    int    `json:"year"`
}
```

### Investment / Reading / ReflectionPost
```go
// 统一结构
type Xxx struct {
  ID      uint   `gorm:"primaryKey" json:"id"`
  Title   string `json:"title"`
  Content string `json:"content"`
}
```

---

## 十一、API 设计

### 语录
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/quotes | 列表 |
| GET | /api/quotes/random | 随机一条 |
| POST | /api/quotes | 新增 |
| PUT | /api/quotes/:id | 编辑 |
| DELETE | /api/quotes/:id | 删除 |

### 日复盘三大类（同模式，路径前缀不同）
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/daily-logs | 全部列表（支持 `?year=2026` 筛选） |
| GET | /api/daily-logs/years | 获取所有年份（`[2026, 2025, ...]`） |
| POST | /api/daily-logs | 新增 |
| PUT | /api/daily-logs/:id | 编辑 |
| DELETE | /api/daily-logs/:id | 删除 |

同理 `/api/daily-reflections`、`/api/todos`。

### 投资 / 阅读 / 感悟
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /api/investments | 列表 |
| POST | /api/investments | 新增 |
| PUT | /api/investments/:id | 编辑 |
| DELETE | /api/investments/:id | 删除 |

同理 `/api/readings`、`/api/reflections`。

---

## 十二、开发阶段

### Phase 1：项目初始化
- 前端：Vite + React + TS + Tailwind + 目录搭建
- 后端：Go module + Gin + GORM + SQLite + 目录搭建
- Tailwind 设计规范配置

### Phase 2：后端核心
- 数据库连接 + 自动迁移
- 全部 Model → Handler → Route

### Phase 3：前端通用组件
- Navbar、QuoteCarousel、ContentCard、PageLayout
- api.ts 封装

### Phase 4：前端页面
- Settings（语录 CRUD）
- Home（轮播+简介）
- Investment / Reading / Reflections（卡片列表，可复用）
- **DailyReview**（年份侧栏 + 三卡片 + 书本视图，最复杂）

### Phase 5：联调
- 前后端对接
- 样式审查，确保符合设计规范
