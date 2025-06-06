# Car Dealer Application - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Data Structure](#data-structure)
4. [API Integration](#api-integration)
5. [Multi-Tenant System](#multi-tenant-system)
6. [Content Management](#content-management)
7. [Security](#security)
8. [Development Setup](#development-setup)
9. [Deployment](#deployment)

## Project Overview

This is a comprehensive car dealership platform built with Next.js, featuring a multi-tenant architecture where each dealership operates independently while sharing common content. The platform supports multiple languages, real-time updates, and a robust content management system.

### Key Features
- Multi-tenant architecture
- Multi-language support
- Real-time inventory management
- Content management system
- Store-specific services and parts
- Global article system
- User authentication and authorization
- Order management
- Analytics and reporting

## Architecture

### System Components

1. **Main VPC (64.227.112.249:1337)**
   - Central Strapi instance
   - Global content management
   - Store registry
   - Authentication service
   - Article management

2. **Store-Specific VPCs (DigitalOcean Droplets)**
   - Individual Strapi instances
   - Store-specific databases
   - Isolated services and parts
   - Independent order management
   - Custom configurations

### Technology Stack
```typescript
{
  frontend: {
    framework: "Next.js 14",
    language: "TypeScript",
    styling: "Tailwind CSS",
    stateManagement: "React Context",
    i18n: "next-intl"
  },
  backend: {
    cms: "Strapi",
    database: "PostgreSQL",
    api: "REST",
    authentication: "JWT"
  },
  infrastructure: {
    hosting: "DigitalOcean",
    vpc: "Multiple VPCs",
    storage: "DigitalOcean Spaces"
  }
}
```

## Data Structure

### 1. Central Database (Main VPC)

```typescript
interface StoreRegistry {
  id: number;
  name: string;
  hostname: string;
  apiToken: string;
  slug: string;
  configuration: {
    theme: string;
    features: string[];
    settings: object;
  };
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  cover: { url: string };
  categories: Array<{ name: string }>;
  publishedAt: string;
  author: {
    data: {
      attributes: {
        name: string;
        email: string;
      };
    };
  };
  description: string;
  locale: string;
  slug: string;
  blocks: any[];
}
```

### 2. Store-Specific Database (Each VPC)

```typescript
interface StoreDatabase {
  parts: {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    stock: number;
    images: string[];
    specifications: object;
  };
  
  services: {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    duration: string;
    requirements: string[];
  };
  
  products: {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    specifications: object;
    stock: number;
  };
  
  orderDetails: {
    id: number;
    orderId: string;
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      address: object;
    };
    items: Array<{
      type: 'part' | 'service' | 'product';
      id: number;
      quantity: number;
      price: number;
    }>;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    paymentInfo: object;
    createdAt: Date;
    updatedAt: Date;
  };
  
  categories: {
    id: number;
    name: string;
    description: string;
    parentId: number | null;
    slug: string;
  };
}
```

## API Integration

### 1. Central API (Main VPC)

```typescript
// Store Management
GET /api/stores - List all stores
POST /api/stores - Create new store
GET /api/stores/:id - Get store details
PUT /api/stores/:id - Update store
DELETE /api/stores/:id - Delete store

// Article Management
GET /api/articles - List articles
POST /api/articles - Create article
GET /api/articles/:id - Get article
PUT /api/articles/:id - Update article
DELETE /api/articles/:id - Delete article

// Authentication
POST /api/auth/local/register - Register user
POST /api/auth/local - Login user
GET /api/users/me - Get current user
```

### 2. Store-Specific API (Each VPC)

```typescript
// Parts Management
GET /api/parts - List parts
POST /api/parts - Create part
GET /api/parts/:id - Get part
PUT /api/parts/:id - Update part
DELETE /api/parts/:id - Delete part

// Services Management
GET /api/services - List services
POST /api/services - Create service
GET /api/services/:id - Get service
PUT /api/services/:id - Update service
DELETE /api/services/:id - Delete service

// Order Management
GET /api/orders - List orders
POST /api/orders - Create order
GET /api/orders/:id - Get order
PUT /api/orders/:id - Update order
DELETE /api/orders/:id - Delete order
```

## Multi-Tenant System

### Store Isolation
- Each store operates in its own VPC
- Independent database for each store
- Isolated services and parts
- Custom configurations per store
- Separate order management

### Data Flow
1. Store Registration
   ```typescript
   // 1. Register in central database
   POST /api/stores
   {
     name: string;
     hostname: string;
     apiToken: string;
     slug: string;
   }

   // 2. Initialize store VPC
   - Create DigitalOcean droplet
   - Set up Strapi instance
   - Configure database
   - Set up store-specific tables
   ```

2. Store Configuration
   ```typescript
   // Store configuration structure
   interface StoreConfig {
     database: {
       host: string;
       port: number;
       name: string;
       user: string;
       password: string;
     };
     api: {
       baseUrl: string;
       token: string;
     };
     features: string[];
     theme: object;
     settings: object;
   }
   ```

## Content Management

### Global Content (Main VPC)
- Articles
- News
- Blog posts
- Global announcements
- Shared media

### Store-Specific Content (Each VPC)
- Parts catalog
- Services list
- Product inventory
- Store-specific media
- Custom pages

## Security

### Authentication
```typescript
// JWT-based authentication
interface AuthConfig {
  token: string;
  expiresIn: string;
  refreshToken: string;
}

// API Security
interface APISecurity {
  rateLimit: number;
  cors: {
    origin: string[];
    methods: string[];
  };
  headers: {
    'Content-Type': string;
    'Authorization': string;
  };
}
```

### Data Protection
- VPC isolation
- Database encryption
- API token authentication
- Role-based access control
- Secure file storage

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- DigitalOcean account
- Strapi CLI

### Installation
```bash
# Clone repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
```env
# Main VPC
NEXT_PUBLIC_STRAPI_URL=http://64.227.112.249:1337
NEXT_PUBLIC_STRAPI_TOKEN=your_token

# Store Configuration
STORE_DATABASE_URL=postgresql://user:password@host:port/database
STORE_API_TOKEN=your_store_token

# Authentication
JWT_SECRET=your_jwt_secret
```

## Deployment

### Main VPC Deployment
1. Set up DigitalOcean droplet
2. Install Strapi
3. Configure PostgreSQL
4. Set up environment variables
5. Deploy application

### Store VPC Deployment
1. Create new DigitalOcean droplet
2. Install Strapi
3. Configure store-specific database
4. Set up store configuration
5. Deploy store instance

### Backup and Restore
```typescript
// Backup process
interface BackupConfig {
  schedule: string;
  retention: number;
  location: string;
  type: 'full' | 'incremental';
}

// Restore process
interface RestoreConfig {
  source: string;
  target: string;
  type: 'full' | 'partial';
  options: object;
}
```

## Additional Information

### Performance Optimization
- Database indexing
- Caching strategies
- CDN integration
- Load balancing
- Query optimization

### Monitoring
- Error tracking
- Performance metrics
- User analytics
- System health checks
- Resource utilization

### Maintenance
- Regular backups
- Security updates
- Performance optimization
- Database maintenance
- System updates

This documentation provides a comprehensive overview of the car dealer application's architecture, implementation details, and operational aspects. For specific implementation details or additional information, please refer to the respective code files and documentation. 