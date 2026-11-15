# 技术方案（2026-11-15 更新）

## 当前实现

| 层级 | 实际技术 |
|---|---|
| 框架 | Next.js 16.4.6 App Router、React 19 |
| 语言 | TypeScript 严格模式 |
| 样式 | Tailwind CSS 4、已复制到源码中的 shadcn/ui 组件 |
| 数据库 | SQLite，Prisma 7.10.1 + libSQL adapter |
| 认证 | NextAuth v5 Credentials + JWT，bcrypt 12 轮 |
| 校验 | Zod 4，服务端校验输入和 AI 行程结构 |
| 图片 | sharp 实际解码、重新编码 WebP、独立缩略图 |
| 地图 | 高德 Web 服务及 JS API |
| AI | FlyAI CLI，execFile 参数数组调用，登录后使用 |
| 检查 | ESLint、TypeScript、Node 核心测试、Playwright Chrome 回归 |

## 请求与数据边界

页面位于 travel-app/src/app，可复用组件位于 src/components，服务端业务函数位于 src/lib。数据变更使用 Server Actions；文件读取与认证回调保留 Route Handlers。

/admin 路由由 Next.js 16 的 src/proxy.ts 拦截，后台 layout 与敏感 Action 仍检查管理员身份。JWT 回调重新校验当前用户、角色和密码指纹；改密后旧会话失效。密码指纹机制上线时，旧格式登录态需要重新登录。

收藏具有用户与目标复合唯一约束，接口接收明确的目标状态；游记点赞记录和计数在同一数据库事务中更新。住宿投稿支持提交人、待审、通过和拒绝原因。

## 持久化与部署

已实现的方案为单实例、有持久磁盘的 Node.js 服务器。DATABASE_URL 与 UPLOADS_DIR 应指向持久目录。生产环境必须明确提供 DATABASE_URL。

托管 PostgreSQL、Cloudflare R2 和 Vercel 仍属于可选迁移方向，当前并未接通。不能按照旧文档直接将本地文件持久化逻辑部署到无状态函数。具体操作见 travel-app/README.md。

## 迁移纪律

所有表结构变更保留在 prisma/migrations。2026-11-15 已核对并补齐现有库中已建表但未记录的历史迁移，新增住宿审核字段及收藏唯一约束，未重置业务库。全新隔离测试库能完整重放全部迁移。

后续迁移前需备份，遇到 drift 不直接 reset。Prisma Client 通过 npm 安装后的 postinstall 或 npm run db:generate 生成。
