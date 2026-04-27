# TravelMemory Deployment – Lessons Learned

## Overview

This document captures the key technical lessons learned while deploying the TravelMemory application on AWS EC2.

The application consists of:

- React frontend
- Node.js backend
- MongoDB
- NGINX reverse proxy
- AWS Application Load Balancer (ALB)

Although the application was eventually deployed successfully, multiple integration challenges surfaced across networking, routing, and infrastructure layers. This document summarizes those learnings for future deployments.

---

## Final Architecture

```text
Browser
   ↓
ALB
   ↓
Frontend EC2 (NGINX)
   ↓
Backend EC2 (Node.js API)
   ↓
MongoDB
```

---

# 1. Infrastructure Connectivity Does Not Guarantee Application Connectivity

Initially, backend EC2 was reachable via SSH:

```bash
ssh ubuntu@backend-server
```

This created the assumption that the application should also be reachable.

That assumption was incorrect.

The Node.js application was running only on localhost:

```javascript
app.listen(PORT)
```

This prevented other servers from reaching the application.

### Fix

```javascript
app.listen(PORT, "0.0.0.0")
```

### Key Learning

Always validate:

- Server availability
- Application process
- Listening ports
- Network accessibility

These are separate validation steps.

---

# 2. Security Groups Should Be Layer-Specific

Initially, the same security group was used across:

- ALB
- Frontend EC2
- Backend EC2

This made troubleshooting difficult.

## Final Design

### ALB Security Group

Allowed:

- Port 80
- Port 443

### Frontend Security Group

Allowed:

- Port 80 from ALB

### Backend Security Group

Allowed:

- Port 3001 from frontend servers

### Key Learning

Separate security groups improve:

- Security
- Troubleshooting
- Architecture clarity

---

# 3. ALB and NGINX Should Not Share Routing Responsibility

Initially:

- ALB handled `/api`
- NGINX handled `/api`

This caused repeated:

```text
503 Service Unavailable
```

errors.

## Final Design

### ALB Responsibility

- HTTPS termination
- Forward traffic to frontend EC2

### NGINX Responsibility

- Serve React application
- Forward API requests to backend

### Key Learning

Avoid overlapping routing logic across multiple layers.

Each layer should have a clear responsibility.

---

# 4. NGINX `proxy_pass` Trailing Slash Behavior Matters

Initial configuration:

```nginx
proxy_pass http://172.31.x.x:3001/;
```

This converted:

```text
/api/trip
```

into:

```text
/trip
```

Backend routes stopped working because Express expected:

```text
/api/trip
```

## Fix

```nginx
proxy_pass http://172.31.x.x:3001;
```

### Key Learning

Small configuration details can cause major routing failures.

Always verify path forwarding behavior.

---

# 5. Frontend Should Not Call Backend IP Directly

Initial frontend API calls used:

```javascript
http://backend-ip:3001
```

Problems caused:

- CORS issues
- Tight infrastructure coupling
- Poor portability

## Final Approach

```javascript
axios.get("/api/trip")
```

NGINX handles backend routing internally.

### Key Learning

Frontend applications should never depend on backend infrastructure IPs.

Use relative API paths whenever possible.

---

# 6. Health Checks Need Dedicated Endpoints

ALB was marking instances unhealthy because health checks were not configured properly.

## Fix

Backend:

```javascript
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
```

NGINX:

```nginx
location /health {
    return 200 'OK';
}
```

### Key Learning

Health checks should be:

- Lightweight
- Fast
- Independent of business logic

---

# 7. React Routing Requires NGINX Support

Refreshing routes such as:

```text
/experiencedetails/:id
```

caused:

```text
404 Not Found
```

because NGINX attempted to locate physical files.

## Fix

```nginx
location / {
    try_files $uri /index.html;
}
```

### Key Learning

Single Page Applications require server-side routing support.

---

# 8. Logging Reduced Debugging Time

Adding request logging helped identify routing issues quickly.

```javascript
console.log(`Incoming Request: ${req.method} ${req.url}`)
```

This helped detect:

- Incorrect routes
- Path rewriting issues
- API forwarding failures

### Key Learning

Always add logs during deployment troubleshooting.

Logs provide faster answers than assumptions.

---

# 9. Debugging Should Be Done Layer by Layer

The most effective debugging approach was validating each layer individually.

## Validation Flow

```text
1. Backend localhost testing
2. Backend private IP testing
3. Frontend → Backend connectivity
4. NGINX validation
5. ALB validation
6. Domain validation
```

### Key Learning

Do not troubleshoot everything through the public domain first.

Validate each layer independently.

---

# Final Outcome

The application is now deployed successfully with:

- Clean frontend/backend separation
- Reverse proxy routing
- Proper health checks
- Secure network access
- Scalable architecture

---

# Summary

This deployment reinforced several important engineering principles:

- Keep infrastructure responsibilities separate
- Avoid hardcoded infrastructure dependencies
- Validate systems incrementally
- Keep routing simple
- Use logs for troubleshooting
- Understand complete request flow

Most failures were caused by integration issues between infrastructure layers—not application logic.

Understanding how requests move through the architecture was the biggest takeaway from this deployment.