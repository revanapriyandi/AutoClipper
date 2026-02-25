# Contributing to AutoClipper

Thank you for your interest in contributing to AutoClipper! AutoClipper is an open-source, AI-powered video clipping software built with Electron, Next.js, and Prisma. We welcome contributions from the community.

## 🤝 How to Contribute

We appreciate all forms of contribution:

1. **Reporting Bugs**: Open an Issue and describe the bug clearly, including steps to reproduce.
2. **Feature Requests**: Have an idea? Open an Issue and tag it as a `feature-request`.
3. **Pull Requests (PRs)**: We welcome your code contributions!

## 🛠️ Local Development Setup

To get started with AutoClipper locally, follow these steps:

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AutoClipper.git
   cd AutoClipper
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Environment Variables**:
   Copy the example environment file and fill in your API credentials (OAuth, DB, etc.).
   ```bash
   cp .env.example .env
   ```
5. **Database Initialization (Prisma/SQLite)**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
6. **Start the Development Server**:
   ```bash
   npm run electron:dev
   ```

## 📜 Pull Request Guidelines

1. **Create a new branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `fix/your-bug-fix`).
2. Make your technical changes. Please ensure your code follows the existing style and conventions.
3. Run the linter to ensure code conforms to standards:
   ```bash
   npm run lint
   ```
4. Build the typescript compiler check to avoid runtime crashes:
   ```bash
   npx tsc --noEmit
   ```
5. **Commit your changes** using descriptive commit messages.
6. **Push to your fork** and submit a **Pull Request** to the `master` branch of the main repository (`revanapriyandi/AutoClipper`).
7. Please provide a clear description of the problem your PR solves and the changes you have made.

We will review your PR as quickly as possible. Happy coding!
