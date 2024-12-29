# Project Overview

This project fetches a GitHub repository from a POST method provided by the user using a frontend built in React. The React data is temporarily stored on the server and an ID is generated and stored in AWS SQS for the particular repository. The data is then forwarded to AWS S3. The project fetches the React data from S3, generates the respective HTML, CSS, and JS, and deploys it onto the internet. It also handles user requests for the particular website.

## Features

- Fetch GitHub repository using a POST method
- Frontend built with React
- Temporary data storage on the server
- ID generation and storage in AWS SQS
- Data forwarding to AWS S3
- Fetching data from AWS S3
- Generating HTML, CSS, and JS
- Deploying the generated website
- Handling user requests for the deployed website

## Technologies Used

- React
- Node.js
- AWS SQS
- AWS S3

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository.
2. Install the necessary dependencies.
3. Set up the required AWS services (SQS and S3).
4. Run the development server.

## Installation

```bash
git clone <repository-url>
cd <repository-directory>
npm install
```

## Usage

1. Start the development server:
    ```bash
    npm start
    ```
2. Access the frontend in your browser.
3. Use the provided form to submit a GitHub repository URL.
4. The backend will handle the rest of the process.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
