# 迎屿 · Yoni | 空间治愈生活站 (Spatial Cozy Life Station)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/zh-CN/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)

> **迎屿 (Yoni)** 是一款融合 **2D 治愈微缩景深插画** 与 **Three.js 3D 自由视角空间** 的沉浸式多功能个人生活站。以柔和的奶油风磨砂玻璃（Glassmorphism）为视觉基底，将日常高频工具（专注、手账、记账、音乐、小憩、日程）与立体空间互动有机结合，打造专注且放松的自习与陪伴空间。

---

## ✨ 核心特性

### 🖼️ 双模式自由切换 [ 2D | 3D ]
- **2D 插画微缩交互模式**：
  - 基于 1:1 治愈系 Diorama 微缩立体画幅，自适应视口居中呈现；
  - **物品点击直达**：点击画面中的电脑、台灯、绿植、手账、咖啡、挂钟、黑胶唱机等物品，直观唤起对应功能抽屉；
  - **实时灯光联动**：可实时开关桌面台灯，画面叠加柔和暖黄光晕。
- **3D 自由空间视角模式**：
  - 基于 Three.js 构建的 3D 房间空间；
  - 支持鼠标拖拽旋转、滚轮缩放自由巡览。

### 🪴 专注番茄钟 & 奇迹温室
- **心流番茄钟**：自定义倒计时与休息时间，支持沉浸式全屏白噪音陪伴；
- **植物浇水成长**：专注即可累积水分，培育窗台盆栽成长升级；
- **温室花卉图鉴**：累计专注时长可随机解锁纯白雏菊、粉色郁金香等 6 种稀有植物标本。

### 📖 拍立得手账生活日记
- **照片卡片网格**：图文结合记录每日灵感，支持拍立得风格复古展示；
- **心情色盘与天气标记**：记录当日心情与天气色彩；
- **AI 暖心治愈回应**：智能情绪感知系统，根据日记关键词给予温暖细腻的反馈与共鸣。

### 👛 极速日常记账本
- **轻量录入**：支持餐饮、学习、兼职等多维度分类与收支统计；
- **月度收支总览**：自动计算净结余与消费明细，直观呈现财务动向。

### 📻 复古黑胶机 & 环境白噪音
- **环境音效混音**：支持雨声（🌧️ 窗外细雨）、壁炉柴火（🔥 温暖噼啪声）独立开关与音量调节；
- **音乐播放**：内置轻音乐与外链支持，打造自习沉浸声场。

### 💻 小憩减压（数独 & 自由涂鸦板）
- **治愈数独**：智能九宫格逻辑填数，支持难度选择与高亮提示；
- **自由涂鸦画板**：支持画笔粗细、颜色选择与一键清空导出。

### 📅 桌面日历与待办清单
- **直观日历与打卡追踪**：展示连续自习天数与今日日程；
- **待办任务清单**：任务勾选完成、动态完成率进度条。

### 🎨 奶油美学与环境自选
- **7 款治愈系主题色**：奶油黄、蜜桃粉、薄荷绿、海盐蓝等一键平滑换肤；
- **窗外天色快速切换**：午后晴空 ☀️、晨曦初霞 🌅、橘红日落 🌇、宁静星夜 🌙、烟雨微芒 🌧️；
- **智能避让排版**：侧边抽屉展开时，中央卡片自动向左平滑移位，两不遮挡。

---

## 📂 项目结构

```text
MyProject/
├── index.html            # 主页面结构（一体式悬浮顶栏、2D/3D舞台、侧边抽屉集合）
├── style.css             # 奶油风玻璃质感样式、自适应排版与平移动画
├── app.js                # 核心逻辑驱动（状态持久化、热区交互、功能模块控制器）
├── ai.js                 # 日记情绪识别与治愈文本算法
├── room_cozy.jpg         # 2D 高清微缩景深主图
├── room.glb              # 3D 房间模型
├── extracted_trellis_texture.png # 3D 模型材质贴图
├── three.min.js          # Three.js 核心引擎库
├── GLTFLoader.js         # glTF / GLB 模型加载器
├── OrbitControls.js      # 3D 轨道相机交互控制器
├── manifest.json         # PWA 渐进式网页配置
├── icon-koala.svg        # 网站图标
└── audio/                # 环境音与音效资源文件夹
```

---

## 🚀 本地快速运行

本项目为纯前端静态项目，无需安装复杂的 Node.js 构建依赖，使用任意 Web 服务器即可运行：

### 方法一：通过 VSCode 插件（推荐）
1. 在 VSCode 中打开本项目文件夹；
2. 安装扩展 **Live Server**；
3. 右键 `index.html`，选择 **"Open with Live Server"** 即可启动。

### 方法二：通过本地 WAMP / XAMPP / Apache / Nginx
1. 将项目放在 Web 根目录（如 `C:/wamp64/www/MyProject`）；
2. 启动 Apache 服务；
3. 浏览器访问：`http://localhost/MyProject/`。

### 方法三：通过 Python 快速启动
在项目根目录下打开终端，执行：
```bash
# Python 3
python -m http.server 8080
```
打开浏览器访问 `http://localhost:8080`。

---

## 🛠️ 技术栈与实现机制

- **前端架构**：原生 HTML5 + CSS3 (Modern Flexbox / Grid / CSS Variables) + 原生 ES6+ JavaScript；
- **视觉风格**：Glassmorphism（背景虚化 `backdrop-filter: blur` + 柔光描边 + 奶油暖调配色）；
- **3D 渲染引擎**：Three.js (WebGLRenderer, OrbitControls, GLTFLoader)；
- **数据持久化**：浏览器 `localStorage` 自动存储用户设置、待办、手账日记与记账流水；
- **坐标检测与自适应**：原生 Hitbox 按钮与百分比坐标双保底点击算法。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。
