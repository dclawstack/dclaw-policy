# Troubleshooting

Common issues and solutions for DClaw Policy.

## Quick Diagnostics

```bash
# Check app pods
kubectl get pods -n dclaw-policy

# Check logs
kubectl logs -n dclaw-policy deployment/dclaw-policy-backend

# Check database
kubectl get clusters -n dclaw-policy
```

## Sections

- [Common Issues](./common-issues)
- [FAQ](./faq)
