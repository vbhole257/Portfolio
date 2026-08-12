# Portfolio

The personal portfolio of [**Vaibhav Bhole**](https://github.com/bholevaibhav). Built with Next.js 15, GSAP, and Lenis, it features scroll-driven animations, animated page transitions, smooth scrolling, and a working contact form.

**Live Site:** [github.com/bholevaibhav](https://github.com/bholevaibhav)

## Key Features

- **Next.js 15 (App Router)**: Fast server-rendering & React 19 server components
- **Scroll Animations**: Complex scroll-triggered effects powered by **GSAP** & **ScrollTrigger**
- **Smooth Scrolling**: Implemented using **Lenis** for seamless viewport movement
- **Page Transitions**: Seamless cross-page animations using **next-transition-router**
- **3D Hero Effect**: Subtle background visual elements built with **Three.js** & **React Three Fiber**
- **Custom Cursor**: Interactive floating preview cards on hover (desktop)
- **Contact Form**: Functional API route for email delivery via **Nodemailer**
- **Performance**: Optimized images, dynamic imports, and reduced-motion fallback states

## Getting Started

First, clone the repository and install dependencies:

```bash
git clone https://github.com/bholevaibhav/Portfolio.git
cd Portfolio
npm install
```

Create a `.env.local` file in the root:

```env
GMAIL_APP_PASSWORD=your_gmail_app_password
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

Start the development server:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |

## Project Structure

```
src/
├── app/                  # App Router pages, layouts, and API routes
│   ├── api/              # Backend handlers (contact form)
│   └── projects/         # Individual project pages
├── components/
│   ├── canvas/           # Canvas background components
│   ├── project/          # Project detail components
│   ├── providers/        # Lenis smooth scroll provider
│   ├── sections/         # Page sections (Banner, About, Projects, Contact)
│   ├── shared/           # Navbar, Footer, Preloader, Custom Cursor
│   └── ui/               # Animated text and button components
├── lib/                  # Metadata, navigation config, project data
└── utils/                # Utility functions
```

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for details.
