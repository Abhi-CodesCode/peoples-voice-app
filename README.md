# 🗣️ People's Voices

**An anonymous, open-source civic participation platform for the CJP protest.**

People's Voices empowers citizens to share their perspectives and document their participation in civic movements — without sacrificing their privacy. No accounts, no personal data, no tracking. Just voices.

> **Disclaimer:** This platform visualizes voluntary submissions from individuals who choose to participate. It is intended to document participation and perspectives, not to estimate public opinion or represent the views of the general population.

---

## ✨ Features

- **🔒 Privacy-First** — No PII (name, email, phone, GPS) is ever collected or stored
- **🗺️ Interactive Map** — Visualize participation across India with MapLibre GL JS and OpenStreetMap tiles
- **📊 Live Analytics** — Real-time charts and statistics powered by Recharts
- **🌙 Dark/Light Mode** — Beautiful dark-first UI with CJP branding and full light mode support
- **📱 Responsive Design** — Mobile-first, works seamlessly across all devices
- **♿ Accessible** — Built with Radix UI primitives for ARIA compliance
- **🇮🇳 India-Focused** — City and state-level participation data across India
- **🛡️ Secure** — Supabase Row-Level Security, input sanitization, XSS prevention
- **⚡ Fast** — Next.js 14 App Router with server components and streaming
- **🎨 Glassmorphism UI** — Modern glass-effect design system with Framer Motion animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict) |
| **Styling** | [TailwindCSS v3](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) pattern + [Radix UI](https://www.radix-ui.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, RLS, Magic Links) |
| **Maps** | [MapLibre GL JS](https://maplibre.org/) + OpenStreetMap |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/peoples-voice-app.git
cd peoples-voice-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | ✅ |

> ⚠️ **Never** expose `SUPABASE_SERVICE_ROLE_KEY` to the client. Only use it in server-side code.

### 4. Run Supabase Migrations

```bash
npx supabase db push
```

Or apply migrations manually from the `supabase/migrations/` directory.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Folder Structure

```
peoples-voice-app/
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   │   ├── layout.tsx    # Root layout with providers
│   │   ├── page.tsx      # Home page
│   │   ├── globals.css   # Global styles and Tailwind directives
│   │   └── fonts/        # Local font files (Inter)
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── lib/              # Utilities, Supabase client, helpers
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript type definitions
│   └── data/             # Static data, constants, mock data
├── supabase/
│   └── migrations/       # SQL migration files
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration with custom theme
├── next.config.mjs       # Next.js configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on `localhost:3000` |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality checks |

---

## 🚢 Deployment

This project is optimized for deployment on **[Vercel](https://vercel.com/)**:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
4. Deploy — Vercel auto-detects Next.js and configures the build

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) before submitting a pull request.

---

## 🔐 Security & Privacy

- Read our [Security Policy](./SECURITY.md) for vulnerability reporting and data protection details
- Read our [Privacy Policy](./PRIVACY.md) for what data is and isn't collected
- Read our [Methodology](./METHODOLOGY.md) to understand what this platform represents

---

## 📄 License

This project is licensed under the **GNU AGPLv3 License** — see the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for civic participation and democratic expression.
</p>
