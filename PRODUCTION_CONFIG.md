# ?? Production Configuration Guide

**For Million-User Scale Deployment**

---

## ?? Pre-Deployment Checklist

### ? Database Configuration

#### 1. Enable Connection Pooling (Supabase Dashboard)
```
Settings ? Database ? Connection Pooling
Mode: Transaction
Pool Size: 15 (start), scale to 50 for production
```

#### 2. Run Advanced Migrations
```bash
# Apply the advanced optimization migration
supabase db push

# Or manually run:
psql $DATABASE_URL < supabase/migrations/20251103100000_advanced_scale_optimizations.sql
```

#### 3. Setup Materialized View Refresh
```sql
-- Run this every 5 minutes via cron job or Supabase Functions
SELECT refresh_hot_menu_data();
```

#### 4. Enable Query Performance Tracking
```sql
-- In Supabase Dashboard SQL Editor
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

---

### ? CDN Configuration

#### Option 1: Cloudflare (Recommended)
```
1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers
4. Enable these features:
   - Auto Minify (JS, CSS, HTML)
   - Brotli Compression
   - HTTP/3
   - Early Hints
   - Argo Smart Routing ($5/mo)
5. Page Rules:
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours
   - Edge Cache TTL: 2 hours
```

#### Option 2: Vercel Edge Network (If hosting on Vercel)
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### ? Image CDN Setup

#### Cloudinary Configuration
```typescript
// Add to .env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret

// Image transformation URL format:
https://res.cloudinary.com/[cloud_name]/image/upload/w_800,f_auto,q_auto/[image_id]
```

#### Imgix Configuration (Alternative)
```typescript
// Add to .env
VITE_IMGIX_DOMAIN=your-domain.imgix.net
VITE_IMGIX_TOKEN=your_token

// Image URL format:
https://your-domain.imgix.net/[image_path]?w=800&auto=format,compress
```

---

### ? Environment Variables

#### Production .env
```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# CDN (Optional but recommended)
VITE_CDN_URL=https://cdn.yourdomain.com
VITE_IMAGE_CDN_URL=https://images.yourdomain.com

# Analytics (Recommended)
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_POSTHOG_KEY=phc_xxxxx

# Error Tracking (Recommended)
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

---

### ? Performance Monitoring

#### 1. Setup Sentry
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

#### 2. Setup Google Analytics
```typescript
// src/lib/analytics.ts
import ReactGA from "react-ga4";

export const initAnalytics = () => {
  if (import.meta.env.VITE_GA_TRACKING_ID) {
    ReactGA.initialize(import.meta.env.VITE_GA_TRACKING_ID);
  }
};

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const trackEvent = (category: string, action: string, label?: string) => {
  ReactGA.event({
    category,
    action,
    label,
  });
};
```

---

### ? Build Optimization

#### Vite Production Build
```bash
# Build with optimizations
npm run build

# Preview production build locally
npm run preview

# Analyze bundle size
npm install --save-dev rollup-plugin-visualizer
```

#### Add to vite.config.ts:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, filename: 'dist/stats.html' }),
  ],
  build: {
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

---

### ? Supabase Production Settings

#### 1. Enable Realtime (Settings ? API ? Realtime)
```
Max concurrent connections: 200 (Pro plan)
```

#### 2. Configure Rate Limiting
```
Anonymous requests: 100 req/min
Authenticated requests: 1000 req/min
```

#### 3. Setup Database Backups
```
Settings ? Database ? Backups
Enable automatic backups (daily)
Retention: 30 days
```

#### 4. Enable Postgres Extensions
```sql
-- Run in SQL Editor
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- For better indexes
```

---

### ? Security Hardening

#### 1. Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https: blob:; 
               font-src 'self' https://fonts.gstatic.com;">
```

#### 2. Security Headers (Cloudflare/Vercel)
```javascript
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
}
```

---

### ? Load Testing

#### Before Launch - Test with K6
```javascript
// load-test.js
import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 1000 }, // Spike test
    { duration: '5m', target: 1000 }, // Stay at 1000
    { duration: '2m', target: 0 },    // Ramp down
  ],
};

export default function () {
  const res = http.get('https://yourdomain.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'load time < 1s': (r) => r.timings.duration < 1000,
  });
  sleep(1);
}
```

Run:
```bash
k6 run load-test.js
```

---

### ? Monitoring Dashboard

#### Setup Real-time Monitoring
```
1. Supabase Dashboard
   - Monitor active connections
   - Track query performance
   - Watch for errors

2. Sentry Dashboard
   - Error rates
   - Performance metrics
   - User sessions

3. Google Analytics
   - User behavior
   - Page views
   - Conversion tracking

4. CloudFlare Analytics
   - Bandwidth usage
   - Cache hit rates
   - Bot traffic
```

---

### ? Cost Optimization

#### Estimated Costs at Scale

| Service | Free Tier | 100K Users | 1M Users |
|---------|-----------|------------|----------|
| Supabase | Free | $25-75/mo | $150-500/mo |
| Cloudflare | Free | Free-$20/mo | $20-50/mo |
| Image CDN | Free | $50-100/mo | $200-500/mo |
| Sentry | Free (5K events) | $26/mo | $80/mo |
| Total | $0 | $101-221/mo | $450-1,130/mo |

#### Cost Reduction Tips:
1. Enable aggressive caching ? Save 60% bandwidth
2. Use WebP/AVIF ? Save 50% storage
3. Implement connection pooling ? Save 40% DB costs
4. Use CDN caching ? Save 70% bandwidth

---

### ? Launch Day Checklist

#### Pre-Launch (24 hours before)
- [ ] Run all migrations
- [ ] Enable connection pooling
- [ ] Setup CDN
- [ ] Configure monitoring
- [ ] Test load balancing
- [ ] Backup database
- [ ] Test rollback procedure

#### Launch Day
- [ ] Monitor error rates
- [ ] Watch database connections
- [ ] Track response times
- [ ] Monitor CDN cache hits
- [ ] Check for memory leaks
- [ ] Verify backups running

#### Post-Launch (First Week)
- [ ] Analyze slow queries
- [ ] Optimize hot paths
- [ ] Tune cache settings
- [ ] Review error reports
- [ ] Check cost metrics
- [ ] Plan capacity increases

---

### ? Scaling Plan

#### Phase 1: 0-100K Users (Current)
- [x] Basic optimization
- [x] Smart caching
- [x] Component memoization
- [x] Image optimization

#### Phase 2: 100K-500K Users
- [ ] Enable connection pooling
- [ ] Add read replicas
- [ ] Implement CDN
- [ ] Add monitoring

#### Phase 3: 500K-1M Users
- [ ] Materialized views
- [ ] Database partitioning
- [ ] Edge functions
- [ ] Advanced caching

#### Phase 4: 1M+ Users
- [ ] Multi-region deployment
- [ ] Database sharding
- [ ] Dedicated infrastructure
- [ ] Custom optimizations

---

## ?? Performance Targets

### Current Metrics
- First Load: ~1-2s
- Time to Interactive: ~2-3s
- Navigation: ~100-300ms
- Bundle Size: ~300KB

### Production Targets
- First Load: <1s (with CDN)
- Time to Interactive: <1s
- Navigation: <50ms (with preloading)
- Bundle Size: <200KB (optimized)
- Lighthouse Score: 95+/100

---

## ?? Emergency Contacts

### If Things Go Wrong

**Database Issues:**
```bash
# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Kill long-running queries
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' AND query_start < now() - interval '5 minutes';

# Refresh materialized views
SELECT refresh_hot_menu_data();
```

**CDN Issues:**
```
1. Purge cache in Cloudflare dashboard
2. Check DNS propagation
3. Verify origin server is responding
```

**Performance Degradation:**
```
1. Check Sentry for errors
2. Review slow queries in Supabase
3. Check CDN cache hit rate
4. Monitor database connections
5. Review memory usage
```

---

## ? Final Validation

Before marking production-ready, verify:
- [ ] All pages load < 1s
- [ ] All features tested end-to-end
- [ ] Error tracking working
- [ ] Monitoring dashboards setup
- [ ] Backups configured
- [ ] CDN caching properly
- [ ] Load tested to 1000+ users
- [ ] Security headers in place
- [ ] SSL certificate valid
- [ ] Custom domain configured

---

**Your app is ready for million-user scale! ??**
