# IoT Sensor Management System - Frontend

A desktop-first Angular frontend application for managing hierarchical sensor data using a Master–Detail layout with a Global Rail and Context Sidebar navigation pattern.

## Technology Stack

- **Framework**: Angular 21 (standalone components)
- **Language**: TypeScript
- **Routing**: Angular Router
- **Styling**: Tailwind CSS v3
- **Icons**: SVG icons
- **Date Handling**: date-fns
- **State Management**: Angular Services and Signals
- **Build Tool**: Angular CLI

## Features

### Navigation Architecture
- **Global Rail** (64px width): Icon-only vertical navigation with sections for Monitoring, Admin, and Settings
- **Context Sidebar** (256px width): Dynamic content based on active section
- **Main Content Area**: Full-height scrollable container with routed views

### Core Functionality
- **Multi-tenancy**: Company switching for admin and tech users
- **Role-Based Access Control (RBAC)**: Admin, Tech, and User roles with route guards
- **Hierarchical Data**: Company → Project → Node → Sensor → Reading Types
- **Project Management**: View projects by company with breadcrumb navigation
- **Node Dashboard**: Folder-style tabs for nodes with status indicators
- **Sensor Monitoring**: Grid of sensor cards color-coded by status
- **Admin Views**: User, Company, and Role management
- **Settings Views**: Profile, Security, and Notifications

### Design
- Desktop-first layout
- Red-centered visual identity (#DC2626)
- Consistent spacing and typography
- Smooth transitions
- Status-based color coding

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/          # Global Rail, Context Sidebar
│   │   │   ├── monitoring/      # Project and Node views
│   │   │   ├── admin/          # User, Company, Role management
│   │   │   ├── settings/       # Profile, Security, Notifications
│   │   │   └── shared/         # Reusable components
│   │   ├── services/           # Data services with signals
│   │   ├── guards/             # Route guards for RBAC
│   │   ├── models/             # TypeScript interfaces
│   │   ├── app.ts              # Root component
│   │   ├── app.routes.ts       # Route configuration
│   │   └── app.config.ts       # App configuration
│   ├── styles.css              # Global styles with Tailwind
│   └── index.html              # Main HTML file
├── tailwind.config.js          # Tailwind configuration
└── package.json
```

## Data Models

### Company
- Multi-tenant support
- Status: active, inactive, suspended

### Project
- Belongs to a company
- Contains multiple nodes

### Node
- Status: online, offline, degraded
- Battery level and last seen timestamp
- Contains multiple sensors

### Sensor
- Status: active, warning, error
- Multiple reading types per sensor
- Historical and predictive data

### User
- Roles: admin, tech, user
- Company assignment
- RBAC enforcement

## Routing

- `/` - Redirects to first project
- `/project/:projectId` - Project view with nodes
- `/project/:projectId/node/:nodeId` - Specific node view
- `/admin/users` - User management (admin only)
- `/admin/companies` - Company management (admin only)
- `/admin/roles` - Role management (admin only)
- `/settings/profile` - Profile settings
- `/settings/security` - Security settings
- `/settings/notifications` - Notification settings

## Mock Data

The application uses in-memory mock data for demonstration purposes. All data mutations are logged to the console and marked with TODO comments for future backend integration.

## Future Integration

The application is designed to be ready for backend integration:
- All service methods log operations to console
- TODO comments mark areas requiring backend calls
- Clean separation of concerns
- TypeScript interfaces ready for API contracts

## License

This project is part of the Tesis_Iot repository.
