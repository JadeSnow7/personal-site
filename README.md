# 胡傲东 · AI Engineering Hub

一个面向 AI Engineering 的个人编辑部与 runtime console，记录 Agent Runtime、AI Native Tools、Harness Engineering、Rust、LLM Application 以及 Forge Studio 相关的设计、实验和工程 notes。

站点目标 URL 配置为 `https://aodonghu.dev`。当前仓库只包含部署配置与构建产物生成路径，目标域名尚需在 Cloudflare Pages 中绑定，并完成线上浏览器验收；README 不代表站点已经部署。

## 技术栈

- Astro 6，static output
- React Islands（只在确有交互的局部使用）
- TypeScript strict
- MDX / Astro Content Collections
- Tailwind CSS 4 + `@tailwindcss/vite`
- Cloudflare Pages direct upload
- GitHub Actions

## Local Development

需要 Node.js 24（`.nvmrc` 已固定版本）和 npm。

```bash
npm ci
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

## Scripts

```bash
npm run dev      # 启动开发服务器
npm run check    # Astro 内容与 TypeScript 检查
npm run build    # 生成 dist/ 静态站点
npm run preview  # 预览 dist/ 构建结果
```

## Deployment

`.github/workflows/deploy.yml` 在 push 到 `main` 或手动 `workflow_dispatch` 时运行：

checkout → Node 24 → `npm ci` → `npm run check` → `npm run build` → Cloudflare Pages direct upload。

生产部署使用 `cloudflare/wrangler-action@v4`，命令为：

```bash
pages deploy dist --project-name=personal-site
```

workflow 具有生产部署并发控制；新的生产运行会取消同组中仍在进行的旧运行。

## Cloudflare Pages 准备

首次运行 workflow 前，需要：

1. 在 Cloudflare Pages 创建项目 `personal-site`。
2. 确认项目使用 Wrangler Direct Upload 和静态产物目录 `dist`。
3. 创建具备 Pages 部署权限的 Cloudflare API Token。
4. 在仓库 Settings → Secrets and variables → Actions 中添加：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. 在 Cloudflare Pages 项目中绑定目标自定义域名 `aodonghu.dev`。
6. 通过线上浏览器检查首页、博客详情、项目页、Agent 页面、静态资源、robots 和 sitemap。

Secrets 只通过 GitHub Actions Secrets 注入，不写入仓库，也不进入客户端代码。

## Information Architecture

- `/`：个人入口、精选项目、最新文章和 runtime console
- `/about`：工作原则
- `/blog`：可筛选的工程文章与静态详情页
- `/projects`：Content Collection 驱动的项目目录
- `/notes`：短篇 working memory
- `/agent`：明确标注为 simulated 的 AI interface
- `/lab`：schema-first 实验记录
- `/architecture`：当前系统与未来动态边界图
- `/books`：schema-first 阅读架
- `/now`：Now / Next / Later 状态板

## Architecture Boundary

```text
Astro static content (MDX / Content Collections / SEO)
                    │
       selective React Islands (local UI state)
                    │
     future / not connected: Cloudflare Workers
                    │
     future / not connected: External Agent Runtime
```

当前站点是静态输出。React Islands 只承担终端、标签过滤和模拟 Agent UI 等局部交互；Cloudflare Workers、真实 Agent Demo backend、GraphRAG、Personal AI Assistant、代码展示、可观测与验证系统均属于后续路线，并未在当前构建中接通。

路线按 Now / Next / Later 管理：当前维护内容与实验记录；下一阶段连接真实 Agent Demo API 边界并补充经过验证的代码展示；更长期探索 GraphRAG、Personal AI Assistant，以及具备可观测和验证证据的 runtime sessions。

## 当前边界

站点中的 Agent trace、GitHub activity 和部分项目内容可能是静态或模拟展示；当前没有真实模型调用或 `/api/chat` 后端。Cloudflare Pages 项目、域名绑定、GitHub Actions 远程运行和线上验收需要在外部平台完成后，才能作为已验证事实记录。
