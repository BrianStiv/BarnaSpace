# BarnaSpace

**Description**: A marketplace for renting event and meeting spaces in Barcelona. Clients can book spaces for a single day, hosts publish and manage their spaces, and admins oversee the whole platform.

## 🛠 Technologies

- **Frontend**: Angular 22, Angular Material, Tailwind CSS
- **Backend (BaaS)**: Firebase (Firestore, Authentication, Storage)
- **Charts**: ng2-charts + Chart.js
- **Maps**: Leaflet + OpenStreetMap Nominatim (geocoding)
- **Images**: Cloudinary (Upload Widget)
- **Testing**: Vitest
- **Package manager**: pnpm

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/BrianStiv/BarnaSpace.git>
   cd BarnaSpace
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Environment variables: create `src/environment/environment.ts` and `src/environment/environment.development.ts` with:
   ```ts
   export const environment = {
     production: false,
     firebaseConfig: {
       apiKey: '...',
       authDomain: '...',
       projectId: '...',
       storageBucket: '...',
       messagingSenderId: '...',
       appId: '...',
     },
     stripePublicKey: 'pk_test_...',
     cloudinaryCloudName: '...',
     cloudinaryUploadPreset: '...',
     adminEmail: 'admin@...',
   };
   ```
4. Start the development server:
   ```bash
   pnpm start
   ```

## 📁 Folder structure

```
src/app/
  core/
    models/        → domain interfaces (User, Space, Booking, Location...)
    services/      → business services (bookings, spaces, auth, geocoding, cloudinary...)
    utils/         → helpers (chart-colors...)
  features/
    auth/          → login, register, route guards (admin, host, auth)
    admin/         → dashboard, users, host requests, publications, bookings
    host/          → "become a host" wizard, publish space, host panel
    marketplace/   → home, results, space detail, my bookings
  shared/
    components/    → reusable components (space-card, dynamic-field, space-map...)
  environment/     → configuration (firebase, stripe, cloudinary...)
```

## 👥 Roles and main flow

| Role | What they can do |
|---|---|
| **Client** | Browse spaces, book (1 day), view their bookings |
| **Host** | Publish spaces, approve/reject bookings |
| **Admin** | Dashboard with charts, manage users, host requests, publications and bookings |

Main flow: **client books → host approves/rejects → admin oversees/cancels**.

## 🌿 GitFlow

The project uses a simplified Git Flow with three branch types (no `release` or `hotfix` branches):

| Branch | Purpose |
|---|---|
| `main` | Stable code. Production deployed on Vercel. |
| `develop` | Continuous integration. All features of each sprint are merged here. |
| `feature/sN-area-name` | Individual work branches. Created from `develop`, merged back into `develop`. |

### Branch naming convention

```
feature/sN-area-descriptive-name
```

Where `sN` is the sprint number, `area` is `core` / `shared` / `feature` / `tests`, and `descriptive-name` is a short kebab-case description.

### Commit convention

Conventional Commits with a sprint prefix:

<type>(sN): short description

Or including the branch area/name:

<type>(sN/<branch-name>): short description

Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`, `style`.

Examples:

feat(s1): add Space and Location models
feat(s2/auth): create AuthService with email and Google login
fix(s3/booking): release blocked date on booking cancel
feat(s7/map): add SpaceMap component
test(s6/testing): add booking service unit tests
docs(s6): update README
```

### Sprint workflow

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create a feature branch
git checkout -b feature/s1-core-space-models

# 3. Commit and push
git add .
git commit -m "feat(s1/<branch-name>): add Space and Location models"
git push -u origin feature/s1-core-space-models

# 4. Open a Pull Request to develop and merge it
```

## 🧪 Tests

```bash
npx ng test --isolate=true --watch=false
```

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm start` | Development server |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm watch` | Build with watch mode |