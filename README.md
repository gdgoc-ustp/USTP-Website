# GDGOC USTP Website

This is the official **GDGOC USTP (Google Developer Groups on Campus - University of Science and Technology of Southern Philippines)** website. It showcases GDSC events, accomplishments, announcements, and other essential information.

## Features

- **Dynamic Pages**: Showcases important sections like Home, News, Events, and About Us with up-to-date content.
- **Responsive Design**: Ensures the site works well on a variety of screen sizes, including mobile devices, tablets, and desktops.
- **Event Showcase**: A dedicated page to highlight upcoming and past GDSC USTP events.
- **Announcements Section**: Stay updated with the latest news and developments from the GDSC USTP community.
- **Team Information**: The "About Us" section provides details about the club, its mission, vision, and members.
- **Public API**: RESTful API for accessing events and blog posts
- **Admin Dashboard**: Secure admin interface for managing content
- **Blog System**: Rich text editor for creating and managing blog posts

## Pages

- **Home**: The main landing page, with a summary of the latest news and featured events.
- **News**: Displays the latest announcements, updates, and other relevant news from GDSC USTP.
- **Events**: Showcases the upcoming and past events with detailed descriptions.
- **About Us**: Learn more about GDSC USTP, including the club's mission, vision, and the team behind it.

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
git clone git clone https://github.com/gdscustp/USTP-Website.git
cd USTP-Website
npm install
```

Create a `.env` file in the root directory with the following variables:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Usage

Once the dependencies are installed, start the development server:

```bash
npm start
```

This will launch the website locally at `http://localhost:3000/`. Any changes made to the source code will trigger a live reload of the site.

For production builds, run:

```bash
npm run build
```

This creates a production-ready version of the website in the `build` folder.

## CMS Development

The CMS provides a secure admin interface for managing content:
- Event Management: Create, update, and delete events
- Blog Posts: Rich text editor with image upload support
- User Management: Control access levels and permissions
- Dashboard: Overview of content and activities

## Scripts

- `npm start`: Starts the development server.
- `npm run build`: Builds the production-ready version of the site.
- `npm run test`: Runs the test suite (if available).
- `npm run eject`: Ejects the project from `create-react-app` (use with caution).

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
