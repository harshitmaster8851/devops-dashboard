# PipelinePulse

> A real-time DevOps observability dashboard that unifies CI/CD, Kubernetes, GitOps, and monitoring signals into a single operational control plane.

Modern DevOps workflows are fragmented across tools. Engineers context-switch between GitHub Actions, Kubernetes dashboards, Prometheus, ArgoCD, and log outputs just to answer one question: **is my deployment healthy?** PipelinePulse answers that in a single view — with no polling, no page refreshes, and no tab switching.

---

## Demo

> _Add a screenshot or screen recording GIF here once the UI is captured._

---

## Features

- **Live CI/CD visibility** — GitHub Actions workflow runs with status, branch, and commit context
- **Kubernetes pod health** — real-time pod phase tracking with immediate failure detection
- **GitOps deployment state** — ArgoCD application sync and health status
- **Prometheus metrics** — service-level SLO visibility at a glance
- **DORA metrics** — deployment frequency, change failure rate, lead time for changes, and MTTR
- **Live log streaming** — pod logs via `kubectl logs` streamed directly into the dashboard
- **Unified services view** — all pipeline, infra, and metric signals merged into one operational snapshot
- **Zero polling on the client** — Socket.IO persistent connection for instant, event-driven updates

---

## Architecture

```
https://drive.google.com/file/d/1bId_PmsQ4bXVZLEZZb1O5JuNtT9XLPFa/view?usp=drive_link
```

**Key engineering decisions:**

- **Streaming over polling** — the client never polls; Socket.IO pushes updates the moment data changes, reducing redundant API calls and latency
- **Separated aggregation from transport** — the Node.js layer and Socket.IO layer are decoupled so new data sources can be added without touching real-time logic
- **Redis as a buffer** — absorbs bursty upstream updates, keeps the frontend consistent even when external APIs are slow or temporarily unavailable

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Real-time | Socket.IO |
| Cache | Redis |
| Container orchestration | Kubernetes (Minikube) |
| GitOps | ArgoCD |
| Monitoring | Prometheus |

---

## Prerequisites

Make sure the following are available before running the project:

- Node.js and npm
- Redis running locally on `127.0.0.1:6379`
- `kubectl` configured with access to a running cluster (Minikube works)
- Prometheus running on `http://localhost:9090`
- ArgoCD available on `http://localhost:8080`
- A GitHub personal access token with `repo` and `actions:read` scopes

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name

ARGOCD_TOKEN=your_argocd_token
ARGOCD_URL=http://localhost:8080

PROMETHEUS_URL=http://localhost:9090

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

PORT=5000
```

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/harshitmaster8851/devops-dashboard.git
cd devops-dashboard
```

**2. Start the backend**

```bash
cd backend
npm install
npm start
```

Backend runs at: `http://localhost:5000`

**3. Start the frontend**

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Reference

### REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check — confirms the backend is running |
| `GET` | `/api/github/runs` | Returns normalized GitHub Actions workflow runs |
| `GET` | `/logs/:pod` | Streams logs for a specific Kubernetes pod |

### Socket.IO Events

The backend emits the following events to connected clients:

| Event | Payload |
|---|---|
| `githubData` | Latest GitHub Actions workflow runs |
| `k8sData` | Current Kubernetes pod states |
| `argoData` | ArgoCD application sync and health status |
| `metricsData` | Prometheus service-level metrics |
| `doraData` | Computed DORA metrics |

---

## How It Works

1. The backend fetches data from GitHub Actions, Kubernetes, ArgoCD, and Prometheus on a configurable interval
2. Raw API responses are normalized into consistent data structures and cached in Redis
3. Socket.IO pushes the latest snapshot to all connected frontend clients in real time
4. The React frontend merges incoming signals into a unified services view and DORA metrics panel

---

## DORA Metrics

The dashboard computes the four DORA metrics used to benchmark engineering delivery performance:

| Metric | What it measures |
|---|---|
| **Deployment frequency** | How often code is successfully deployed to production |
| **Lead time for changes** | Time from commit to production deployment |
| **Change failure rate** | Percentage of deployments that result in a failure or rollback |
| **MTTR** | Mean time to recover after a production incident |

---

## Learnings

Building this project made clear that observability engineering is fundamentally different from building dashboards. The hard part isn't rendering data — it's handling noisy, asynchronous, multi-source data gracefully and making it legible under incident pressure.

Debugging a distributed system across Kubernetes, WebSockets, multiple external APIs, and a caching layer also creates a recursive problem: you often need the observability tool you're building in order to finish building it.

---

## Roadmap

- [ ] Multi-cluster Kubernetes support
- [ ] OpenTelemetry distributed tracing (third observability pillar)
- [ ] Alertmanager integration — rule-based and anomaly-based alerting
- [ ] Historical trend views and time-range selectors
- [ ] Grafana-style drill-down panels per service
- [ ] Role-based access control
- [ ] Production deployment via Docker + Kubernetes manifests

---

## Contributing

Contributions are welcome.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
# Open a pull request
```

Please keep PRs focused — one feature or fix per PR makes review faster.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Author

Built by **Harshit Rastogi**  
B.Tech IT, USICT — GGSIPU Delhi  
GitHub: [@harshitmaster8851](https://github.com/harshitmaster8851)  
Oracle Certified Foundations Associate · Selected for Smart India Hackathon 2025
