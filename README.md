# 旅游管理与旅行分享

中文旅游信息管理应用，包含目的地、景点、美食、住宿、评论、收藏、投稿审核、游记和 AI 旅游顾问。

## 本地启动（Windows）

1. 安装 Node.js 24，在 travel-app 目录打开 PowerShell。
2. 运行 `npm ci` 安装依赖并生成 Prisma Client。
3. 首次安装复制 `.env.example` 为 `.env`，填写 DATABASE_URL 与随机认证密钥。已有 `.env` 不要覆盖。
4. 运行 `npm run db:migrate` 创建数据库并应用迁移。
5. 运行 `npm run dev`，打开 http://localhost:3000。
6. 首次管理员先在网站注册，再运行 `npm run admin:grant -- 你的邮箱`，重新登录。

数据库默认使用 `file:./dev.db`，路径相对于运行命令的 travel-app 目录。请始终从该目录执行命令。地图和 AI 密钥可以暂时留空；基本浏览功能仍可运行。

## 正式部署：有持久磁盘的单实例服务器

当前已实现的持久化方案是 SQLite + 本地媒体目录，适合单实例课程演示或小规模使用。服务器需有 Node.js 24、持久磁盘和 HTTPS 域名。

1. 上传源码，不上传 node_modules、测试数据库和个人 `.env`。
2. 配置生产 `.env`：DATABASE_URL 指向持久磁盘上的 SQLite 文件；UPLOADS_DIR 指向独立的持久媒体目录；AUTH_SECRET 使用随机密钥；NEXTAUTH_URL 填实际 HTTPS 地址。反向代理环境确认可信后设置 AUTH_TRUST_HOST=true。
3. 依次运行 `npm ci`、`npm run db:migrate`、`npm run build`。
4. 使用服务器的进程管理工具运行 `npm start`，通过 HTTPS 反向代理访问。每次更新源码后先备份，再运行迁移和构建、重启。
5. 将当前 `public/uploads` 中的历史图片整体复制到新 UPLOADS_DIR，保留原有子目录结构。

不要把本地 SQLite 与写入 public 的方案直接用于 Vercel 无状态函数。切换到 Vercel 前需另行接入托管数据库和对象存储；本次没有开通云服务，也未把未接入的 R2 配置描述为已上线。

## 备份和恢复

先停止网站进程，再同时备份 SQLite 文件及媒体目录；如存在同名 -wal、-shm 文件，一并保留。数据库与媒体应来自同一次停止期间。备份另存到独立磁盘，不提交 Git。

恢复时先停止应用，保留当前副本，然后把备份数据库和媒体复制回对应目录，确认环境变量路径，运行 `npm run db:migrate` 后启动。在独立目录验证恢复结果，再用于正式站点。不要在运行中的数据库文件上直接覆盖。

## 核查旅游数据

- `npm run data:audit`：只核查餐饮、住宿的来源分类，输出 poi-audit.json。
- `npm run data:audit -- --apply`：仅下架能唯一匹配来源且分类不符的记录，保留记录供后台修正。
- 未能匹配或外部服务失败的记录不会自动修改；输出 skipped 数量需要人工继续核查。
- 批量导入脚本已按风景名胜、餐饮服务、住宿服务分类并限定城市。历史脚本仍按城市跳过已存在目的地，不能作为完整的数据同步系统。

## 开发检查

```powershell
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

端到端测试使用独立 travel-e2e.db 和 3016 端口，自动应用所有迁移并建立仅供测试的账号，不修改 dev.db。默认使用已安装的 Google Chrome；其他环境可调整 playwright.config.ts 的浏览器 channel。

测试库可重复使用，测试前会补齐固定数据。不要把测试账号用于正常站点。CI 自动执行代码检查、类型检查、核心测试和生产构建。

## 当前边界

- AI 每用户每天 30 次、每进程最多 3 个并发；额度存于单进程内存，重启会重置，多实例部署前需改为共享持久限流。
- 评论编辑支持评分、标题、正文、到访日期，保留已有图片；编辑时的照片增删需后续完善。
- 本次未接入邮件发送服务，邮箱验证和找回密码仍待实现。
- AI 行程已加强输入与输出结构校验，完整行程编辑、交通耗时、预算校验、导出仍是后续功能。
- 回收站、通用审计日志、所有列表与评论的分页、外部 POI 与本地内容的统一去重仍待完善。
