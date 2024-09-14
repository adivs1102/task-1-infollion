
---

# Dynamic Form with Nested Questions

This React application, built using Vite, allows users to create dynamic forms with nested questions. Users can add parent and child questions, drag-and-drop to reorder them, and submit the form to view questions in a hierarchical format. The app also persists data using local storage.

## Features

- **Add New Parent Questions**: Dynamically add new parent questions.
- **Add Nested Child Questions**: Add child questions to True/False type questions and support recursive nesting.
- **Drag-and-Drop Reordering**: Rearrange questions using drag-and-drop.
- **Delete Questions**: Remove questions and their children.
- **Hierarchical Numbering**: Auto-number questions in a hierarchical format (e.g., Q1, Q1.1, Q1.1.1).
- **Form Submission**: Display all questions in a hierarchical format upon submission.
- **Local Storage Persistence**: Save and load the form state using local storage.

## Getting Started

### Prerequisites

Ensure you have Node.js and npm (or yarn) installed on your machine. You can download and install them from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/dynamic-form.git
   cd dynamic-form
   ```

2. **Install Dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

3. **Start the Development Server**

   Using npm:
   ```bash
   npm run dev
   ```

   Or using yarn:
   ```bash
   yarn dev
   ```

   Open `http://localhost:3000` in your browser to view the app.

## Usage

1. **Add a New Question**: Click on the "Add New Question" button to add a parent question.
2. **Configure Questions**:
   - Enter the question text.
   - Select the question type ("Short Answer" or "True/False").
   - If the type is "True/False", you can add child questions.
3. **Drag-and-Drop**: Drag questions to reorder them.
4. **Delete Questions**: Click the "Delete" button to remove a question and its children.
5. **Submit the Form**: Click "Submit" to display the questions in a hierarchical format.

## Styling

The app is styled using CSS to provide a clean and user-friendly interface. Refer to the `App.css` file for details on the styles used.

## Local Storage

The app uses local storage to persist the state of the form. This allows users to return to the form without losing their progress.

## Code Structure

- **`App.js`**: Main component handling the form logic, including adding, updating, and deleting questions, as well as drag-and-drop functionality.
- **`App.css`**: Styles for the application.
- **`index.js`**: Entry point for the React application, which renders the `App` component.

## Libraries Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool and development server.
- **react-dnd**: A set of React utilities for drag-and-drop functionality.
- **react-dnd-html5-backend**: HTML5 backend for react-dnd.

---
