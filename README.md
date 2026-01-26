# GDG USTP Website

This is the official **GDG USTP (Google Developer Groups on Campus - University of Science and Technology of Southern Philippines)** website. It showcases GDG events, accomplishments, announcements, and other essential information.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [CMS Development](#cms-development)
- [Scripts](#scripts)
- [File Structure](#file-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

To set up the project locally:

```bash
git clone git clone https://github.com/GDGustp/USTP-Website.git
cd USTP-Website
npm install
```

Rename `.env.sample` to `.env` and fill with the appropriate values.

However, If you want to create your own supabase instance, copy and execute all .sql files on `/sql` directory to supabase sql editor to setup RLS and table policies.


## Usage

Once the dependencies are installed, start the development server:

```bash
bun start
```

This will launch the website locally at `http://localhost:5000/` (or whatever port is set on `.env`). Any changes made to the source code will trigger a live reload of the site.

For production builds, run:

```bash
bun build
```

This creates a production-ready version of the website in the `build` folder.

## CMS Development

CMS Admin interface is accessible in `/admin` endpoint. [HERE](https://gdgustp.com/admin/login)

The CMS provides a secure admin interface for managing content:
- Event Management: Create, update, and delete events
- Blog Posts: Rich text editor with image upload support
- User Management: Control access levels and permissions
- Dashboard: Overview of content and activities

## Environment Variables

The application requires the following environment variables to be set in the `.env` file:

## Scripts

- `bun dev`: Starts the development server.
- `bun build`: Builds the production-ready version of the site.
- `bun test`: Runs the test suite (if available).
- `bun eject`: Ejects the project from `create-react-app` (use with caution).

## File Structure

```
src/
│
├── components/        # Reusable UI components (Header, Footer, etc.)
├── pages/            # Page components (Home, News, Events, About Us)
├── admin/            # Admin dashboard components
├── assets/           # Static assets like images, fonts, etc.
├── lib/             # Utilities and configuration
├── contexts/        # React contexts for state management
├── App.js           # Main App component with routing setup
└── index.js         # Entry point of the application
```

## API Documentation
For detailed API documentation and examples, visit our [Postman Collection](https://documenter.getpostman.com/view/41094364/2sAYQZGX13).

## Contributing

Contributions are welcome! If you'd like to suggest changes, feel free to fork the repository and create a pull request:

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request on GitHub.

Please refer to the official tracker for additional resources.

## License

This project is licensed under the Attribution-NonCommercial 4.0 International License. See the [LICENSE](LICENSE) file for more details.
