# Black Unknown Project - QWEN Context

## Project Overview
Black Unknown is an e-commerce web application built with modern web technologies focused on creating a luxury fashion brand experience. The project follows a component-based architecture with both standalone HTML components and a Next.js application. It features a dark/light mode toggle and uses the Manrope font family with Material Symbols for icons.

## Project Structure
- **context/**: Contains individual UI components as standalone HTML files with associated assets
  - Each component has its own directory with `code.html` and `screen.png`
  - Components include homepage, product cards, footer, navigation, cart functionality, etc.
- **docs/**: Documentation directory (includes sprint artifacts folder)
- **.bmad/**: BMAD Method framework configuration and workflow management system
  - Core orchestration system for AI-driven agile development
  - Provides comprehensive lifecycle management through specialized agents and workflows

## Component List
The project includes the following UI components:
- `black_unknown_add_to_cart_button`: Add to cart functionality
- `black_unknown_cart_drawer_1` & `black_unknown_cart_drawer_2`: Shopping cart drawers
- `black_unknown_cart_page`: Shopping cart page
- `black_unknown_footer`: Website footer
- `black_unknown_homepage`: Main homepage (includes legacy HTML version and Next.js app)
- `black_unknown_mobile_bottom_nav`: Mobile navigation
- `black_unknown_product_card`: Product card display
- `black_unknown_product_detail_1` through `black_unknown_product_detail_4`: Product detail pages
- `black_unknown_product_gallery`: Product image gallery
- `black_unknown_profile_page`: User profile page
- `black_unknown_quantity_selector`: Quantity selector for products
- `black_unknown_shop_page_1` through `black_unknown_shop_page_3`: Shop page variations
- `black_unknown_sticky_header_1` & `black_unknown_sticky_header_2`: Header components
- `black_unknown_wishlist_page`: Wishlist functionality

## Technologies Used
- **Frontend Frameworks**: 
  - Standalone HTML/CSS/JS components
  - Next.js 16.0.3 application (in temp_next_app directory)
- **Styling**: 
  - Tailwind CSS with forms and container-queries plugins
  - PostCSS for CSS processing
- **Fonts**: 
  - Manrope font family (via Google Fonts)
  - Geist and Geist Mono (for Next.js app)
- **Icons**: 
  - Material Symbols
- **Runtime**: React 19.2.0 and React DOM 19.2.0

## Design System
- **Primary Colors**: 
  - Various shades including `#f2b90d` (Golden yellow), `#ae782d` (Bronze), `#f4c025` (Light Gold)
- **Background Colors**: 
  - Light: `#f8f8f5` or `#f8f7f6`
  - Dark: `#221e10`, `#111111`, or `#1f1a13`
- **Typography**: Manrope font family with Geist as fallback
- **UI Framework**: Tailwind CSS with custom configuration
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Dark Mode**: Implemented with Tailwind's class strategy

## Application Architecture
The project has two main codebases:

1. **Component Library** (Standalone HTML):
   - Individual HTML files for each component
   - Self-contained with embedded Tailwind config
   - Uses CDN-hosted Tailwind CSS
   - Responsive design with Tailwind utility classes

2. **Next.js Application** (in temp_next_app directory):
   - Modern React framework application
   - App router architecture
   - TypeScript-based
   - Includes:
     - `app/` directory with layout.tsx and page.tsx
     - Tailwind CSS integration
     - Font optimization (Geist fonts)
     - Responsive design principles

## BMAD Framework Integration
The project uses the BMAD (Business Model and Development) Method framework for AI-assisted development:
- **Core Module**: Contains workflow execution engine and core tasks
- **BMM Module**: Business Model Method for planning, analysis, and implementation workflows
- **Agents**: Specialized AI agents for different roles (analyst, architect, developer, PM, etc.)
- **Workflows**: Structured processes for different development phases (Analysis, Planning, Solutioning, Implementation)

## Key Features
- Dark/light mode support
- Responsive design for all device sizes
- Interactive elements with hover/focus states
- Product catalog display with cards
- Shopping cart functionality
- User authentication areas (profile page)
- Mobile navigation system
- E-commerce specific components (add to cart, wishlist, etc.)
- Luxury fashion brand aesthetic with minimalistic design

## Development Workflow
The project follows the BMAD Method which includes:
1. **Analysis Phase**: Discovery, brainstorming, and market research
2. **Planning Phase**: Product Requirements Document (PRD) and UX design
3. **Solutioning Phase**: Architecture decisions and epic/story creation
4. **Implementation Phase**: Development sprints with story-based work

## Project Status
From the directory structure, this appears to be in active development with:
- Component library for UI elements
- Next.js application serving as the main site
- BMAD framework for structured development
- Both legacy HTML components and modern React application (temp_next_app)

The presence of temporary directories like `temp_next_app` and `legacy_backup` suggests ongoing iteration between different approaches to the application's architecture.