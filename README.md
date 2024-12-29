# **AI Website Creator**

This project is a minimal version of platforms like bolt.new and v0.dev, designed to convert natural language prompts into executable code that runs directly in the browser. Built with React, Express, Node.js, TypeScript, and WebContainer technology, it integrates the experimental Google Gemini 2.0 Flash model for real-time code generation and natural language processing. Users can input prompts in plain English, and the system generates React applications or Node.js backends while maintaining context for iterative improvements. Although functional, the project is limited by the token constraints of free AI models, with room for future enhancements to expand its capabilities.

## **Demo**

## **Table of Contents**

- [**AI Website Creator**](#ai-website-creator)
  - [**Demo**](#demo)
  - [**Table of Contents**](#table-of-contents)
  - [**Project Structure**](#project-structure)
  - [**Technologies Used**](#technologies-used)
  - [**API Documentation**](#api-documentation)
  - [**Installation**](#installation)
    - [**Prerequisites**](#prerequisites)
    - [**Cloning the Repository**](#cloning-the-repository)
    - [**Backend Installation**](#backend-installation)
    - [**Frontend Installation**](#frontend-installation)
    - [**Environment Variables**](#environment-variables)
  - [**Usage**](#usage)
    - [**Running the Backend**](#running-the-backend)
    - [**Running the Frontend**](#running-the-frontend)
    - [**Accessing the Application**](#accessing-the-application)
  - [**Contributing**](#contributing)
  - [**License**](#license)
  - [**Contact Information**](#contact-information)

---

## **Project Structure**

```plaintext
./
 │
 ├── backend/
 │   │
 │   └── src/index.ts     # File containing all the code
 │
 └── frontend/
     │
     └── src/
         ├── components/  # Various components used in the project
         ├── hooks/       # Custom hooks
         ├── pages/       # Main Interface of the system
         ├── types/       # TypeScript types
         └── utils/       # Utilities
```

---

## **Technologies Used**

- [Webcontainers](https://webcontainers.io/) converting client browser into an execution environment.
- [Google Gemini AI Models](https://ai.google.dev/)
- [React.js](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)

---

## **API Documentation**

- **POST** `/template` - To get the type of project being developed
- **POST** `/chat` - To get response from the LLM

---

## **Installation**

### **Prerequisites**

- [Node.js](https://nodejs.org/en/)

### **Cloning the Repository**

```bash
git clone https://github.com/Ishan3450/ai-webapp-maker
```

### **Backend Installation**

```bash
cd backend
npm install
```

### **Frontend Installation**

```bash
cd frontend
npm install
```

### **Environment Variables**

Create a `.env` file in the root of server directory, and add the following:

```plaintext
GEMINI_API_KEY=
```

Refer to `.env.example` file.

---

## **Usage**

### **Running the Backend**

```bash
cd backend
npm run dev
```

### **Running the Frontend**

```bash
cd frontend
npm run dev
```

### **Accessing the Application**

- Backend: `http://localhost:3000`.
- Frontend: `http://localhost:5173`.

---

## **Contributing**

- Fork the repository
- Create a new branch: `git checkout -b feature/YourFeature`
- Commit your changes: `git commit -m 'Add some feature'`
- Push to the branch: `git push origin feature/YourFeature`
- Open a pull request

## **License**

This project is licensed under the [MIT License](LICENSE).

## **Contact Information**

For any feedbacks or improvements, feel free to reach out.

- LinkedIn: [Ishan Jagani](https://www.linkedin.com/in/ishanjagani/)
