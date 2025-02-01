## Installation Instructions

### Prerequisites

Before setting up the project, ensure you have the following installed:

#### Node.js

1. Download the Node.js installer from the [official website](https://nodejs.org/).
2. Run the installer and follow the instructions to complete the installation.
3. Verify the installation by running the following commands in your terminal:

```bash
node -v
npm -v
```

#### Docker

1. Download Docker Desktop from the [official website](https://www.docker.com/products/docker-desktop).
2. Follow the installation instructions for your operating system.
3. Once installed, open Docker Desktop to start the Docker engine.
4. Verify the installation by running the following command in your terminal:

```bash
docker --version
```

To set up the project and run both the client and server, follow these steps:

### Client Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Start the database services using Docker:

   ```bash
   npm run services
   ```

2. To stop the database services:

   ```bash
   npm run services:stop
   ```

Make sure both the client and server are running simultaneously for the application to function correctly.

### Creating a GitHub Repository

1. **Create a New Repository**:

   - Go to [GitHub](https://github.com/) and log in to your account.
   - Click on the "+" icon in the top right corner and select "New repository".
   - Name your repository and provide a description (optional).
   - Choose the repository visibility (public or private).
   - Click on "Create repository".

2. **Push Your Code to GitHub**:

   - Open your terminal and navigate to your project directory.
   - Initialize a new Git repository:

     ```bash
     git init
     ```

   - Add your project files to the repository:

     ```bash
     git add .
     ```

   - Commit your changes:

     ```bash
     git commit -m "Initial commit"
     ```

   - Add the remote repository URL:

     ```bash
     git remote add origin https://github.com/your-username/your-repository-name.git
     ```

   - Push your code to GitHub:

     ```bash
     git push -u origin master
     ```

3. **Share the Repository**:

   - Once your code is pushed, go to your repository on GitHub.
   - Copy the repository URL from the address bar.
   - Share the URL with us by sending it to your recruitment contact.

---

# Full Stack Developer Technical Test

This test is designed to evaluate your skills in both frontend and backend development. Please follow the instructions provided in each section carefully. Good luck!

## Overview

The test consists of two main tasks: one focused on front-end development using React, and the other on back-end development for handling data storage. The objective is to modify existing frontend components and implement a backend that can effectively manage the data flow.

**The task consists on editing the exist form so information can be uploaded on an itemized way as described in the objective**

## Frontend Task

### Objective

The goal is to modify the existing React components to change the current functionality related to report creation. Instead of the current method, you are required to implement a functionality allowing users to add multiple items to a report. Each item must have the following attributes:

- **Description**: A brief text describing the item.
- **Cost Code**: A unique identifier for budget tracking.
- **Images**: A visual representation of the item.

For example:

The user needs to add an item "fridge broke", add a cost code, and an array of images / image to the same entry. Then the user needs to add the next item to the list, which s microwave not working. Your data would look like this:

```json
[
{
  "description": "fridge broke",
  "costCode": "C10",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "key": "image1",
      "fileType": "image/jpeg",
      "fileName": "image1.jpg"
    },
    {
      "url": "https://example.com/image2.jpg",
      "key": "image2",
      "fileType": "image/jpeg",
      "fileName": "image2.jpg"
    }
  ]
},
{
  "description": "Microwave not working",
  "costCode": "C203",
  "images": [
    {
      "url": "https://example.com/image3.jpg",
      "key": "image3",
      "fileType": "image/jpeg",
      "fileName": "image3.jpg"
    },
    {
      "url": "https://example.com/image4.jpg",
      "key": "image4",
      "fileType": "image/jpeg",
      "fileName": "image4.jpg"
    }
  ]
},
{
  "description": "Oven not heating",
  "costCode": "C880",
  "images": [
    {
      "url": "https://example.com/image5.jpg",
      "key": "image5",
      "fileType": "image/jpeg",
      "fileName": "image5.jpg"
    },
    {
      "url": "https://example.com/image6.jpg",
      "key": "image6",
      "fileType": "image/jpeg",
      "fileName": "image6.jpg"
    }
  ]
}
]
...
```

The current data looks like this:

```json
{
  "description": "fridge broke - Microwave not working - Oven not heating",
  "costCode": "C10",
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "key": "image1",
      "fileType": "image/jpeg",
      "fileName": "image1.jpg"
    },
    {
      "url": "https://example.com/image2.jpg",
      "key": "image2",
      "fileType": "image/jpeg",
      "fileName": "image2.jpg"
    },
        {
      "url": "https://example.com/image3.jpg",
      "key": "image3",
      "fileType": "image/jpeg",
      "fileName": "image3.jpg"
    },
    {
      "url": "https://example.com/image4.jpg",
      "key": "image4",
      "fileType": "image/jpeg",
      "fileName": "image4.jpg"
    },
        {
      "url": "https://example.com/image5.jpg",
      "key": "image5",
      "fileType": "image/jpeg",
      "fileName": "image5.jpg"
    },
    {
      "url": "https://example.com/image6.jpg",
      "key": "image6",
      "fileType": "image/jpeg",
      "fileName": "image6.jpg"
    }
  ]
},
```

You need to be able to add and remove as many items as are required.

### Instructions

1. **Setup**: Clone the existing frontend project repository (URL to be provided) and ensure you have all the necessary dependencies installed.

2. **Modify Components**:

- Identify and understand the current component responsible for report creation.
- Modify this component or create new components to add items as specified above.

3. **Functionality**:

- Allow users to repeatedly add items with description, cost code, and image input fields.
- Ensure there is a user-friendly interface for adding and reviewing the list of items.

4. **Submit Report**:

- Implement a submission mechanism for the complete report containing all items.
- Ensure the report data is structured and ready to be sent to the backend.

## Backend Task

### Objective

Develop a backend service that can handle data received from the React frontend, specifically storing the report details in a database.

### Instructions

1. **Technology Stack**: You may use any backend framework or language you are comfortable with, but Node.js with Express is preferred.

2. **API Design**:

- Create endpoints to accept the report data from the frontend.
- Consider using POST requests for submissions.

3. **Data Persistence**:

- Use the Mongo DB collection already set to store the data.
- Modify the Report schema already given to complete the task.

4. **Setup the Server**:

- Ensure the server can process incoming data from the frontend and store it in the database.
- Handle potential errors gracefully and ensure there is error feedback for failed operations.

## Evaluation Criteria

- **Front-end**: Code quality, user interface implementation, state management, component validation, and functionality matching the provided specification.

- **Back-end**: API design, data persistence logic, error handling, code efficiency, and understanding of REST principles.

## Submission

- Ensure that both your frontend and backend codebases are pushed to the provided repository or in a shared repository.

# Additional Requirements!

- Time management is crucial. Focus on creating a working prototype. Please don't spend more than 2 hours on this task.
- Document your thought process and any assumptions in a `NOTES.md` file. Write the following:
  - What else you would have done but did not have time to complete. Next steps to complete the task and the feature.
  - Suggestions on best approaches to build the feature.
  - Notes and observations
- You can use third-party libraries if needed, but solutions demonstrating understanding of foundational tech are preferred.

---

We are looking forward to your solution. If you have any questions, please reach out to your recruitment contact.

```

```
