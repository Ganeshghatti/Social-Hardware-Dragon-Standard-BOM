# Robotic Arm Manufacturing Dashboard

A comprehensive manufacturing management system for a 7 Degrees of Freedom (7DOF) robotic arm production facility. Built with Next.js and MongoDB.

## Features

- **Dashboard Overview**: Real-time summary cards showing key manufacturing metrics
- **Parts Management**: Complete CRUD operations for parts inventory
- **BOMs Management**: Create and manage Bill of Materials with versioning
- **Work Orders**: Track production batches from planning to completion
- **Inventory Management**: Monitor stock levels and handle adjustments
- **Suppliers**: Manage supplier relationships and contact information
- **Purchase Orders**: Create and track procurement orders
- **Quality Control**: Record and monitor QC inspections
- **Reports**: Generate cost breakdowns, inventory valuations, and work order summaries
- **Settings & Audit Logs**: Configure system settings and track all changes

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with HTTP-only cookies, bcrypt password hashing
- **Validation**: Zod schemas
- **UI Components**: Toast notifications (react-hot-toast)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas connection string

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd social-hardware-dragon-standard-bom
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/robotic_arm_dashboard
JWT_SECRET=your-secret-key-change-in-production
ADMIN_EMAIL=admin@roboticarm.com
ADMIN_PASSWORD=admin123456
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Initialize the database

Start MongoDB and run the initialization:
```bash
# Start MongoDB (if running locally)
# Then visit http://localhost:3000/api/init in your browser or run:
curl http://localhost:3000/api/init
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

You'll be redirected to the login page. Use the admin credentials from your `.env.local` file.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── dashboard/      # Overview dashboard
│   │   ├── parts/          # Parts management
│   │   ├── boms/           # BOM management
│   │   ├── workorders/     # Work orders
│   │   ├── inventory/      # Inventory management
│   │   ├── suppliers/      # Supplier management
│   │   ├── purchase-orders/# Purchase orders
│   │   ├── qc/             # Quality control
│   │   ├── reports/        # Reports
│   │   └── settings/       # Settings & audit logs
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication
│   │   ├── parts/          # Parts CRUD
│   │   ├── boms/           # BOMs CRUD
│   │   ├── workorders/     # Work orders CRUD
│   │   ├── inventory/      # Inventory operations
│   │   ├── suppliers/      # Suppliers CRUD
│   │   ├── purchase-orders/# Purchase orders CRUD
│   │   ├── qc/             # QC records
│   │   └── reports/        # Reporting endpoints
│   └── page.js             # Root page
├── components/             # React components
│   ├── Layout.js          # Main dashboard layout
│   ├── Sidebar.js         # Navigation sidebar
│   └── Navbar.js          # Top navigation bar
├── lib/
│   ├── auth.js            # Authentication utilities
│   ├── db.js              # Database connection
│   ├── init-db.js         # Database initialization
│   ├── models.js          # Zod validation schemas
│   └── mongodb.js         # MongoDB client
├── middleware.js          # Auth middleware
└── .env.local             # Environment variables
```

## MongoDB Collections

- `users` - Admin users
- `parts` - Parts inventory
- `boms` - Bill of Materials
- `workorders` - Production work orders
- `suppliers` - Supplier contacts
- `purchase_orders` - Purchase orders
- `inventory_transactions` - Stock adjustments
- `qc_records` - Quality control records
- `audit_logs` - System audit trail

## Authentication

The system uses JWT tokens stored in HTTP-only cookies for security. All `/admin/*` routes are protected by middleware. Only authenticated admin users can access the dashboard.

## Theme & Branding

- **Primary Color**: #ff6600 (Orange)
- **Sidebar**: Dark gray (#1f1f1f)
- **Active Links**: Orange accent (#ff6600)
- **Font**: Inter

## Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create cluster and database
3. Whitelist Vercel IP addresses
4. Update `MONGODB_URI` in environment variables

### Security Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change default admin password
- [ ] Enable MongoDB authentication
- [ ] Configure CORS appropriately
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags for production

## License

This project is proprietary software for Robotic Arm Manufacturing.

## Support

For issues and questions, please contact the development team.
# Social-Hardware-Dragon-Standard-BOM
