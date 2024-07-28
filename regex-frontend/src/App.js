// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, CircularProgress, CssBaseline, TextField } from '@mui/material';
import DataTable from './components/DataTable'; // Import the DataTable component

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');  // New state for user input
  const [llmResponse, setLlmResponse] = useState('');  // State to store LLM response

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8000/process/', formData)
      .then(response => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error uploading the file!', error);
        setLoading(false);
      });
  };

  const handleTextInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleTextSubmit = () => {
    if (userInput.trim() === '') {
      alert("Please enter some text.");
      return;
    }

    setLoading(true);

    axios.post('http://localhost:8000/llm-process/', { text: userInput })
      .then(response => {
        setLlmResponse(response.data.response);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error processing the text!', error);
        setLoading(false);
      });
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
        <Typography variant="h3" sx={{ margin: 4 }}>
          Regex Pattern Matching and Replacement
        </Typography>
        <input
          accept=".csv,.xlsx"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" sx={{ margin: 2 }}>
            Choose File
          </Button>
        </label>
        {file && <Typography variant="body1" sx={{ margin: 1 }}>{file.name}</Typography>}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleFileUpload}
          disabled={loading}
          sx={{ margin: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>

        {data.length > 0 && <DataTable data={data} />}

        <TextField
          label="Enter text for LLM processing"
          value={userInput}
          onChange={handleTextInputChange}
          variant="outlined"
          fullWidth
          sx={{ margin: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleTextSubmit}
          disabled={loading}
          sx={{ margin: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Text and Process"}
        </Button>
        {llmResponse && (
          <Typography variant="body1" sx={{ margin: 2 }}>
            LLM Response: {llmResponse}
          </Typography>
        )}
      </Container>
    </>
  );
}

export default App;
