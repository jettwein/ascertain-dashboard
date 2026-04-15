---
paths:
  - "terraform/**"
  - "infra/**"
  - "cdk/**"
  - "cloudformation/**"
  - "docker-compose*.yml"
  - "Dockerfile*"
  - ".github/workflows/**"
  - "**/*.tf"
---

# Infrastructure Rules

- Infrastructure changes must be reviewed by a human before applying
- Never hardcode secrets, credentials, or account IDs — use variables or secret managers
- Dockerfiles: use specific image tags, never `latest`
- CI/CD: pin action versions to commit SHAs, not tags (supply chain safety)
- Terraform: use remote state, never local
- All infrastructure changes should be tested in a non-production environment first
- Document the "why" for non-obvious configuration (resource sizing, timeout values, retry policies)
