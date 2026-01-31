# Saket Pustak Kendra - Website Documentation

## 📖 Website Overview

**Website Name**: Saket Pustak Kendra (Saket Book Store)  
**Purpose**: Complete accounting, billing, and product management system for a family-owned stationery and bookstore business  
**Problem Solved**: Digitizes manual accounting processes, enables online customer dashboard access, streamlines Tally/Vyapar data imports, and provides WhatsApp-based product enquiries

---

## 🏷️ Website Type

**Multi-purpose Business Management Application**:
- 📊 Accounting & Billing Dashboard
- 🛒 E-commerce Product Catalog (WhatsApp-based)
- 💼 Admin Management Panel
- 📱 Customer Self-Service Portal
- 📥 Data Import System (Tally XML, Vyapar Excel)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 7** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS 3** | Styling framework |
| **Wouter** | Client-side routing |
| **Framer Motion** | Animations |
| **Radix UI** | Accessible component primitives |
| **shadcn/ui** | Pre-built components |
| **@tanstack/react-query** | Server state management |
| **Recharts** | Dashboard charts |
| **jsPDF** | PDF invoice generation |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 20+** | Runtime environment |
| **Express 4** | Web framework |
| **TypeScript** | Type safety |
| **tsx** | TypeScript execution |
| **Multer** | File upload handling |
| **Express Session** | Session management |
| **connect-pg-simple** | PostgreSQL session store |
| **bcryptjs** | Password hashing |

### Database & ORM
| Technology | Purpose |
|------------|---------|
| **PostgreSQL** | Primary database |
| **Supabase** | Database hosting & auth |
| **Drizzle ORM** | Type-safe database queries |
| **Drizzle Kit** | Schema migrations |
| **Zod** | Runtime type validation |

### Data Processing
| Technology | Purpose |
|------------|---------|
| **fast-xml-parser** | Tally XML parsing |
| **xlsx** | Excel file parsing |
| **xml2js** | Alternative XML parser |

### Authentication
- **Custom PIN-based auth** (6-digit PIN per mobile number)
- **Session-based** (Express sessions with PostgreSQL store)
- **Role-based access control** (Admin/Customer roles)
- **Supabase Auth** (for RLS policies)

---

## 📁 Folder Structure

```
Saket-Bookshelf/
│
├── client/                          # Frontend React application
│   ├── public/                      # Static assets (favicon, images)
│   │   ├── favicon.png
│   │   └── cool.png
│   │
│   └── src/
│       ├── components/              # Reusable React components
│       │   ├── ui/                  # shadcn/ui components (48 files)
│       │   ├── Layout.tsx           # Main layout wrapper
│       │   ├── ProductCard.tsx      # Product display card
│       │   ├── LedgerTable.tsx      # Ledger data table
│       │   ├── DashboardCharts.tsx  # Charts for dashboard
│       │   ├── StatCard.tsx         # Dashboard stat cards
│       │   ├── Logo.tsx             # Brand logo
│       │   └── ErrorBoundary.tsx    # Error handling
│       │
│       ├── pages/                   # Route pages
│       │   ├── Home.tsx             # Landing page
│       │   ├── Shop.tsx             # Product catalog
│       │   ├── Login.tsx            # PIN login page
│       │   ├── Dashboard.tsx        # Customer dashboard
│       │   ├── ChangePin.tsx        # PIN change page
│       │   ├── Cart.tsx             # Shopping cart (future)
│       │   ├── Orders.tsx           # Order history (future)
│       │   ├── Admin.tsx            # Admin dashboard
│       │   ├── not-found.tsx        # 404 page
│       │   └── admin/               # Admin-only pages
│       │       ├── ProductManagement.tsx  # Product CRUD
│       │       ├── VyaparSync.tsx         # Vyapar import
│       │       └── AddProduct.tsx         # Old product page
│       │
│       ├── hooks/                   # Custom React hooks
│       │   ├── use-auth.ts          # Authentication hook
│       │   ├── use-toast.ts         # Toast notifications
│       │   ├── use-mobile.ts        # Mobile detection
│       │   └── ...                  # Other hooks
│       │
│       ├── lib/                     # Utilities & config
│       │   ├── utils.ts             # Helper functions
│       │   ├── queryClient.ts       # React Query setup
│       │   └── supabase.ts          # Supabase client
│       │
│       ├── services/                # API services
│       │   └── supabase.ts          # Supabase operations
│       │
│       ├── App.tsx                  # Root component & routes
│       ├── main.tsx                 # React entry point
│       └── global.css               # Global styles
│
├── server/                          # Backend Express application
│   ├── controllers/                 # Route handlers
│   │   ├── auth.ts                  # Login, logout, session
│   │   ├── dashboard.ts             # Customer dashboard data
│   │   ├── admin.ts                 # Admin operations
│   │   ├── products.ts              # Product CRUD & image upload
│   │   └── vyapar-import.ts         # Vyapar Excel import
│   │
│   ├── services/                    # Business logic
│   │   ├── import-service.ts        # Data import processing
│   │   ├── tally.ts                 # Tally XML parsing
│   │   ├── vyapar-config.ts         # Vyapar field mapping
│   │   └── supabase.ts              # Supabase admin client
│   │
│   ├── middleware/                  # Express middleware
│   │   └── auth.ts                  # Auth guards (requireAuth, requireAdmin)
│   │
│   ├── uploads/                     # File upload storage
│   │   └── products/                # Product images
│   │
│   ├── db.ts                        # Database connection pool
│   ├── index.ts                     # Server entry point
│   ├── routes.ts                    # API route definitions
│   ├── storage.ts                   # File storage setup
│   ├── static.ts                    # Static file serving
│   └── vite.ts                      # Vite dev server integration
│
├── shared/                          # Shared types/schemas
│   ├── schema.ts                    # Drizzle database schema
│   └── routes.ts                    # Shared route types
│
├── migrations/                      # Database migrations
│   ├── meta/                        # Drizzle metadata
│   ├── 0000_needy_microbe.sql       # Initial schema
│   ├── 0001_monthly_ledger_view.sql # Ledger view
│   ├── 0002_security_rls.sql        # Row Level Security
│   ├── 01_enable_rls.sql            # RLS enablement
│   ├── 02_optimize_indexes.sql      # Index optimization
│   ├── 03_tally_masters.sql         # Tally integration
│   ├── 04_production_optimizations.sql  # Production tuning
│   ├── add_product_fields.sql       # Product schema update
│   └── security_hardening.sql       # Security improvements
│
├── scripts/                         # Build & utility scripts
│   └── build.ts                     # Production build script
│
├── docs/                            # Documentation
│   └── website-detail.md            # This file
│
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore rules
├── README.md                        # Quick start guide
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite build config
├── tailwind.config.ts               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── drizzle.config.ts                # Drizzle ORM config
└── components.json                  # shadcn/ui config
```

---

## ✨ Key Features

### Customer Features
1. **PIN-Based Login** - 6-digit PIN authentication with mobile number
2. **Personal Dashboard** - View purchase history, payments, ledger
3. **PDF Invoice Generation** - Download invoices as PDF
4. **Ledger Tracking** - Real-time ledger balance and transaction history
5. **Product Browsing** - Browse stationery products by category
6. **WhatsApp Enquiry** - Direct WhatsApp integration for product enquiries
7. **Change PIN** - Self-service PIN management
8. **Monthly Charts** - Visual representation of purchases and payments

### Admin Features
1. **Vyapar Excel Import** - Upload and sync Vyapar data
2. **Tally XML Import** - Import Tally data (legacy, being deprecated)
3. **Product Management** - Add, edit, delete products with images
4. **Image Upload** - Product image management (5MB max, JPG/PNG/WEBP)
5. **Admin Dashboard** - Overview of all operations
6. **Data Validation** - Smart import with error handling
7. **Duplicate Detection** - Prevents duplicate customer/invoice entries

### Technical Features
1. **Row Level Security (RLS)** - Database-level access control
2. **Session Management** - Secure PostgreSQL-backed sessions
3. **Type Safety** - Full TypeScript coverage
4. **Responsive Design** - Mobile-first, works on all devices
5. **Error Handling** - Comprehensive error boundaries and logging
6. **Real-time Updates** - React Query for live data
7. **Optimistic Updates** - Instant UI feedback
8. **File Validation** - Secure file upload with type/size checks

---

## 👥 User Roles

### 1. Customer (role: `null` or `'customer'`)
**Access**:
- ✅ Login page
- ✅ Personal dashboard
- ✅ Shop page (browse only)
- ✅ Change PIN
- ❌ Admin pages

**Capabilities**:
- View own ledger
- Download own invoices
- Browse products
- Enquire via WhatsApp
- Update own PIN

### 2. Admin (role: `'admin'`)
**Access**:
- ✅ All customer features
- ✅ Admin dashboard
- ✅ Vyapar import
- ✅ Product management
- ✅ View all customer data

**Capabilities**:
- Import Vyapar/Tally data
- Manage products (CRUD)
- Upload product images
- View system logs
- Access all customer records

**Admin Accounts**:
- Created via direct database insert
- Mobile number with `role = 'admin'` in `customers` table

---

## 🔌 API Overview

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Authentication Endpoints

#### POST `/api/auth/login`
**Purpose**: User login with mobile number and PIN  
**Body**: `{ mobile: string, pin: string }`  
**Returns**: User object with session cookie  
**Access**: Public

#### POST `/api/auth/logout`
**Purpose**: User logout  
**Returns**: Success message  
**Access**: Authenticated

#### GET `/api/auth/check`
**Purpose**: Check current session  
**Returns**: User object or 401  
**Access**: Public (returns session if exists)

#### POST `/api/auth/change-pin`
**Purpose**: Update user PIN  
**Body**: `{ oldPin: string, newPin: string }`  
**Returns**: Success message  
**Access**: Authenticated

---

### Customer Dashboard Endpoints

#### GET `/api/dashboard/summary`
**Purpose**: Get customer dashboard summary  
**Returns**: Purchase, paid, and closing balance totals  
**Access**: Authenticated customer

#### GET `/api/dashboard/ledger`
**Purpose**: Get customer ledger entries  
**Query**: `?month=YYYY-MM` (optional)  
**Returns**: Array of ledger entries  
**Access**: Authenticated customer

#### GET `/api/dashboard/bills`
**Purpose**: Get customer bills/invoices  
**Returns**: Array of bills with items  
**Access**: Authenticated customer

---

### Product Endpoints

#### GET `/api/products`
**Purpose**: List all products  
**Returns**: Array of products  
**Access**: Public

#### POST `/api/products`
**Purpose**: Create new product  
**Body**: `{ name, category, description?, imageUrl? }`  
**Returns**: Created product  
**Access**: Admin only

#### DELETE `/api/products/:id`
**Purpose**: Delete product (and its image)  
**Returns**: Success message  
**Access**: Admin only

#### POST `/api/products/upload-image`
**Purpose**: Upload product image  
**Body**: FormData with `image` file  
**Returns**: `{ imageUrl: string }`  
**Access**: Admin only  
**Limits**: 5MB max, JPG/PNG/WEBP only

---

### Admin Import Endpoints

#### POST `/api/import/upload`
**Purpose**: Upload Vyapar Excel file  
**Body**: FormData with `file`  
**Returns**: Import record with ID  
**Access**: Admin only

#### GET `/api/import/status/:id`
**Purpose**: Check import processing status  
**Returns**: Import record with status  
**Access**: Admin only

#### POST `/api/import/sync/:id`
**Purpose**: Sync uploaded data to main database  
**Returns**: Sync result with counts  
**Access**: Admin only

#### GET `/api/import/history`
**Purpose**: Get recent import history  
**Returns**: Array of recent imports  
**Access**: Admin only

---

## 🌐 Environment Variables

Create a `.env` file in the project root (never commit this file):

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Session
SESSION_SECRET=your-random-256-bit-secret-here
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Server
PORT=5000
NODE_ENV=development  # or 'production'

# Optional
LOG_LEVEL=info
```

### Variable Explanations

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase public API key | `eyJhbG...` |
| `SUPABASE_SERVICE_KEY` | Supabase admin key (server only) | `eyJhbG...` |
| `SESSION_SECRET` | Express session encryption key | 64-char hex string |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development`/`production` |

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js**: v20.19.0 or v22.12.0+
- **PostgreSQL**: v14+ (or Supabase account)
- **npm**: v8+ (comes with Node.js)

### Step 1: Clone & Install
```bash
git clone <repository-url>
cd Saket-Bookshelf
npm install
```

### Step 2: Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### Step 3: Database Setup
```bash
# Push schema to database
npm run db:push

# Or run migrations manually
psql $DATABASE_URL < migrations/0000_needy_microbe.sql
# ... run other migrations in order
```

### Step 4: Create Admin User
```sql
-- Connect to your database
INSERT INTO customers (mobile, name, pinHash, role)
VALUES ('9876543210', 'Admin User', 'hashed-pin-here', 'admin');

-- Generate PIN hash:
-- In Node.js: bcrypt.hashSync('123456', 10)
```

### Step 5: Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server (after build)
- `npm run check` - Type check with TypeScript
- `npm run db:push` - Push schema changes to database

---

## 📦 How to Deploy

### Option 1: Deploy to Replit
1. Import project to Replit
2. Add environment variables in Secrets panel
3. Click "Run" - Replit handles build automatically
4. Project will be available at `https://your-project.repl.co`

### Option 2: Deploy to Vercel/Netlify
```bash
# Build the project
npm run build

# Deploy the dist/ folder
# dist/index.cjs is the server entry point
# dist/public/ contains the frontend assets
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.cjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/index.cjs"
    },
    {
      "src": "/(.*)",
      "dest": "dist/index.cjs"
    }
  ]
}
```

### Option 3: Deploy to VPS (Ubuntu)
```bash
# SSH into your server
ssh user@your-server-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql

# Clone and setup
git clone <repo> && cd Saket-Bookshelf
npm install
npm run build

# Setup PM2 for process management
npm install -g pm2
pm2 start npm --name "saket-app" -- start
pm2 save
pm2 startup

# Setup Nginx reverse proxy (optional)
# Point Nginx to localhost:5000
```

---

## 🔮 Future Improvement Ideas

### Short-term (Next 3 Months)
1. ✅ **Edit Product Feature** - Allow admins to edit existing products
2. ✅ **Product Stock Management** - Track inventory levels
3. ✅ **Search & Filter** - Product search and category filtering
4. ✅ **Pagination** - Paginate product lists and ledger entries
5. ✅ **Email Notifications** - Send invoice emails to customers
6. ✅ **Bulk Product Import** - CSV import for products
7. ✅ **Product Images Gallery** - Multiple images per product

### Medium-term (3-6 Months)
1. ✅ **Online Ordering** - Enable actual cart and checkout
2. ✅ **Payment Gateway** - Razorpay/Stripe integration
3. ✅ **Order Tracking** - Real-time order status updates
4. ✅ **Customer Registration** - Self-service customer signup
5. ✅ **SMS Notifications** - OTP login, order updates
6. ✅ **Advanced Analytics** - Sales trends, customer insights
7. ✅ **Discount Management** - Coupon codes and offers

### Long-term (6-12 Months)
1. ✅ **Mobile App** - React Native app for iOS/Android
2. ✅ **Barcode Scanning** - Quick product lookup
3. ✅ **Multi-store Support** - Manage multiple branches
4. ✅ **Vendor Management** - Track supplier relationships
5. ✅ **Automated Reordering** - Smart inventory predictions
6. ✅ **Customer Loyalty Program** - Points and rewards
7. ✅ **Advanced Reporting** - Exportable reports (Excel, PDF)
8. ✅ **API for Third-Party Integration** - Public API for partners

---

## 📝 Notes

- **Security**: All routes except `/`, `/shop`, `/login` require authentication
- **RLS**: Database has Row Level Security enabled for customer data isolation
- **Sessions**: Stored in PostgreSQL, expire after 7 days of inactivity
- **File Uploads**: Stored locally in `server/uploads/`, consider S3 for production
- **PIN Format**: 6 digits, hashed with bcrypt (cost: 10)
- **Mobile Format**: 10 digits, no country code required

---

## 🤝 Support

For issues or questions:
- Check the codebase documentation in source files
- Review migration files for database schema understanding
- Check `shared/schema.ts` for complete data models

---

**Last Updated**: January 31, 2026  
**Version**: 1.0.0
