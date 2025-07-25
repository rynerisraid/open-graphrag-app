一、用户体系共通（Phase 0）

---

目标：前端、后端共用一张 users 表，实现单点登录与权限校验。

1. 统一数据库

- 选择 PostgreSQL 作为中心库（2 项目都已依赖 Postgres，几乎零迁移）。
- 创建独立 schema（如 core_auth）。
- 在 fast-graphrag 的 models/auth.py 内保留用户 ORM；

在 next-graphrag 里使用 NextAuth.js 的 adapter-postgres 指向同一表。

1. 统一密码与会话

- 登出与刷新：继续由 NextAuth 管理 HTTP-Only cookie，会话采用 JWT Strategy。
- FastAPI 侧新增中间件：验证来自前端的 Authorization: Bearer `<JWT>`；若成功解析 sub 即视为登录。
- 两端共用同一 JWT secret 与 issuer。

1. 权限同步

- user.roles/plan 等附加字段由后端管理；前端请求受保护 API 时下发 JWT-claim 即可。
- 若不想让前端直接连中心库，可把后端暴露 /auth/introspect 用于令牌换取用户信息。

---

二、工作空间（知识库）管理（Phase 1）

---

目标：让用户在前端创建/切换「Workspace」，后端持久化并隔离数据。

1. 数据模型（fast-graphrag）

workspace(id, name, owner_id, visibility, created_at, …)

workspace_member(id, workspace_id, user_id, role)

1. REST/GraphQL 接口

POST /api/workspace – 新建

GET /api/workspace/{id} – 详情、成员

PATCH /api/workspace/{id} – 更新

GET /api/workspace?mine – 我的列表

1. 前端集成

- dash 路由已有 /dash/workspace/[id]；补充调用新 API 并用 SWR/React-Query 缓存。
- 在 (dash)/sidebar 中提供 Workspace 列表与切换。
- 在聊天页 URL 中透传 ?workspace_id= 让后端知道检索范围。

---

三、文件上传 ⟶ 文本抽取（Phase 2）

---

1. 上传流\* next-graphrag 保持 /api/file/upload/[workspace_id]（已存在 dash API）。

- 文件直接 PUT 至 fast-graphrag 的 S3/MinIO 或本地卷；响应返回 file_id。

1. 后端抽取

- Celery 任务 extract_text(file_id)：
- 根据 MIME 类型调用 pdfminer, tesserocr, pandoc…
- 输出分块文本，持久到 text_units 表（现有 parquet 写入逻辑可移植）。
- 任务完成后，触发下一阶段 build_graph(workspace_id)（可通过 Celery chain）。

1. 状态跟踪

- jobs 表已存在；保持 status=pending|running|completed|failed。
- 前端轮询 /api/jobs/{id} 或通过 Server-Sent Events 推送进度条。

---

四、GraphRAG 知识图谱构建（Phase 3）

---

1. 构建流程

extract_text ➜ sentence_embedding ➜ entity/relation 抽取 ➜ neo4j / sqlite-graph 存储 ➜ faiss/pgvector 索引

（fast-graphrag 已有 services/kg_builder.py，只需把 workspace_id 作为分区键）

1. 多租户隔离

- 图数据库按 workspace_id 打前缀，或单独库（Neo4j 端可用多 DB 功能）。
- 向量库可用 pgvector 分区或 HNSW 索引按列过滤。

---

五、前端查询与结果融合（Phase 4）

---

1. 查询 API（fast-graphrag）

POST /api/chat

Body: { workspace_id, query, mode: "rag" | "graph_rag" | "auto" }

返回：answer, citations, graph_json(optional)

1. 推理模式

- rag: 仅检索向量文档
- graph_rag: 先调用知识图谱语义查询 Cypher/SPARQL**C**y**p**h**er**/**SP**A**RQ**L + 向量 rerank
- auto: 将用户问题跑 LLM 判断意图（普通 QA vs 需要 KG），走不同 pipeline。

1. 前端 UI

- 在聊天框旁添加「知识来源」切换，显示图三栏：原文-图谱-LLM 答案。
- 如果返回 graph_json，用 mermaid.js 或 vis-network 渲染可视图谱洞察。

---

六、部署/运维（Phase 5）

---

1. 服务划分\* next-graphrag: Vercel / Docker (8000)

- fast-graphrag API: Docker-Gunicorn (9000)
- Celery Worker: Docker (处理队列)
- Redis/RabbitMQ: 消息队列
- PostgreSQL + pgvector
- Neo4j（可选，若图查询复杂）

1. 网络与安全

- 同域名子路径 /app /api，或使用 Traefik/Nginx 合并反向代理。
- JWT 走 HTTPS；文件存储用预签名 URL。

1. 监控

- Prometheus + Grafana（API 延迟、任务吞吐）
- Sentry 捕获前后端异常。

---

实施里程碑

---

M0（1 天）: 共用 Postgres + JWT 中间件

M1（3 天）: Workspace CRUD + 前端切换

M2（5 天）: 文件上传 ➜ 文本抽取任务链

M3（5 天）: 图谱构建与多租户隔离

M4（4 天）: 前端查询融合 + UI 交互

M5（2 天）: CI/CD + 监控上线

此方案在确保最小侵入的同时，实现了：\* 单一用户认证

- 基于 Workspace 的数据隔离
- 可扩展的文件 → 知识图谱异步流水线
- 前端对 GraphRAG 结果的可视化及模式切换

若后续需做深度耦合（例如合并仓库、共享 monorepo、统一 docker-compose 等），可在上述基础逐步推进。
