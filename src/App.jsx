import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const ItemTypes = {
  QUESTION: 'question',
};

const Question = React.memo(function Question({
  question,
  index,
  moveQuestion,
  handleInputChange,
  deleteQuestion,
  addChildQuestion,
  numberPrefix = '',
}) {
  const questionNumber = numberPrefix ? `${numberPrefix}.${index + 1}` : `Q${index + 1}`;

  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: ItemTypes.QUESTION,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.QUESTION,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveQuestion(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={dragPreview}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '8px',
        margin: '4px',
        backgroundColor: 'white',
        border: '1px solid gray',
      }}
    >
      <div ref={drop}>
        <strong>{questionNumber}</strong>
        <input
          type="text"
          placeholder="Enter question"
          value={question.text}
          onChange={(e) => handleInputChange(question.id, e.target.value)}
        />
        <select
          value={question.type}
          onChange={(e) => handleInputChange(question.id, question.text, e.target.value)}
        >
          <option value="Short Answer">Short Answer</option>
          <option value="True/False">True/False</option>
        </select>
        <button onClick={() => deleteQuestion(question.id)}>Delete</button>
        {question.type === 'True/False' && (
          <button onClick={() => addChildQuestion(question.id)}>Add Child Question</button>
        )}
        <span ref={drag} style={{ cursor: 'move', marginLeft: '8px' }}>Drag</span>
      </div>
      {question.children && question.children.length > 0 && (
        <div style={{ marginLeft: '20px' }}>
          {question.children.map((child, childIndex) => (
            <Question
              key={child.id}
              question={child}
              index={childIndex}
              moveQuestion={moveQuestion}
              handleInputChange={handleInputChange}
              deleteQuestion={deleteQuestion}
              addChildQuestion={addChildQuestion}
              numberPrefix={questionNumber}
            />
          ))}
        </div>
      )}
    </div>
  );
});

function App() {
  const [questions, setQuestions] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState(null); // For displaying on submission

  // Add a new parent question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        type: 'Short Answer',
        children: [],
        parentId: null,
      },
    ]);
  };

  // Add a child question
  const addChildQuestion = (parentId) => {
    const updatedQuestions = addChildRecursive(questions, parentId);
    setQuestions(updatedQuestions);
  };

  const addChildRecursive = (items, parentId) => {
    return items.map((item) => {
      if (item.id === parentId && item.type === 'True/False') {
        item.children.push({
          id: Date.now(),
          text: '',
          type: 'Short Answer',
          children: [],
          parentId: parentId,
        });
      } else if (item.children.length) {
        item.children = addChildRecursive(item.children, parentId);
      }
      return item;
    });
  };

  // Handle input change
  const handleInputChange = (id, text, type = null) => {
    const updatedQuestions = updateQuestionRecursive(questions, id, text, type);
    setQuestions(updatedQuestions);
  };

  const updateQuestionRecursive = (items, id, text, type) => {
    return items.map((item) => {
      if (item.id === id) {
        item.text = text;
        if (type) {
          item.type = type;
        }
      } else if (item.children.length) {
        item.children = updateQuestionRecursive(item.children, id, text, type);
      }
      return item;
    });
  };

  // Delete a question and its children
  const deleteQuestion = (id) => {
    const updatedQuestions = deleteQuestionRecursive(questions, id);
    setQuestions(updatedQuestions);
  };

  const deleteQuestionRecursive = (items, id) => {
    return items
      .filter((item) => item.id !== id)
      .map((item) => {
        if (item.children.length) {
          item.children = deleteQuestionRecursive(item.children, id);
        }
        return item;
      });
  };

  // Move a question in the list (drag and drop)
  const moveQuestion = useCallback((fromIndex, toIndex) => {
    const updatedQuestions = Array.from(questions);
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  }, [questions]);

  // Render questions with decimal numbering
  const renderQuestions = (questions) => {
    return questions.map((question, index) => (
      <Question
        key={question.id}
        question={question}
        index={index}
        moveQuestion={moveQuestion}
        handleInputChange={handleInputChange}
        deleteQuestion={deleteQuestion}
        addChildQuestion={addChildQuestion}
      />
    ));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuestions(questions); // Save the questions for display
  };

  // Render the submitted questions in hierarchical format
  const renderSubmittedQuestions = (questions, parentNumber = '') => {
    return (
      <ul>
        {questions.map((question, index) => {
          const number = parentNumber ? `${parentNumber}.${index + 1}` : `Q${index + 1}`;
          return (
            <li key={question.id}>
              {number}: {question.text} ({question.type})
              {question.children && question.children.length > 0 && (
                <ul>{renderSubmittedQuestions(question.children, number)}</ul>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  // Save to local storage on every update
  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  // Load questions from local storage on component mount
  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('questions'));
    if (savedQuestions) {
      setQuestions(savedQuestions);
    }
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Dynamic Form with Nested Questions</h1>
        <button type="button" onClick={addQuestion}>
          Add New Question
        </button>
        <form onSubmit={handleSubmit}>
          <div>{renderQuestions(questions)}</div>
          <button type="submit">Submit</button>
        </form>

        {submittedQuestions && (
          <div>
            <h2>Submitted Questions</h2>
            {renderSubmittedQuestions(submittedQuestions)}
          </div>
        )}
      </div>
    </DndProvider>
  );
}

export default App;
