# Todo App

TaskMe is a comprehensive task management application that leverages FastAPI for the backend and React for the frontend. The app is designed to help users efficiently manage their tasks by allowing them to add, archive, and delete tasks. TaskMe also utilizes Nginx for serving the application and Tailwind CSS for styling, ensuring a seamless and visually appealing user experience.

## Running the App with Docker Compose

To run the Todo App using Docker Compose, follow these steps:

### Prerequisites

- Ensure you have Docker and Docker Compose installed on your machine.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/riishiiiii/task-app.git
   cd task-app
   ```

2. Build and start the containers:

   ```sh
   docker-compose up --build
   ```
   or
   ```sh
   make run
   ```

4. Open your browser and navigate to `http://localhost:4000` to access the Todo App.

### Stopping the App

To stop the app, run:

   ```sh
   docker-compose down
   ```
   or
   ```sh
   make down
   ```

