# Kazam Task Management - Frontend

This is the frontend application for the Kazam Task Management system, built with React and Tailwind CSS.

## Tech Stack

- React 19
- Tailwind CSS
- Axios for API communication

## Features

- Modern and responsive user interface
- Task management (create, view, update, delete)
- Real-time updates of task status

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Available Scripts

### `npm start`

Runs the app in development mode.

### `npm test`

Launches the test runner.

### `npm run build`

Builds the app for production to the `build` folder.

## Project Structure

- `src/components` - React components
- `src/services` - API services
- `src/hooks` - Custom React hooks
- `src/context` - React context providers

## Deployment

The frontend can be deployed to various platforms such as Vercel, Netlify, or any static hosting service.

```bash
npm run build
```

