import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, CircularProgress, CssBaseline, TextField } from '@mui/material';
import DataTable from './components/DataTable';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [llmResponse, setLlmResponse] = useState('');
  const [headerModificationInfo, setHeaderModificationInfo] = useState('');
  const [modifiedData, setModifiedData] = useState([]);

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
        setHeaders(response.data.headers);
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

  const handleTextAndProcess = () => {
    if (userInput.trim() === '' || headers.length === 0) {
      alert("Please upload a file and enter some text.");
      return;
    }
  
    setLoading(true);
  
    let regexPattern = '';
    let column = '';
    let replacementValue = 'REDACTED';  // Default replacement value
  
    axios.post('http://localhost:8000/llm-process/', { text: userInput })
      .then(response => {
        regexPattern = response.data.response;
        setLlmResponse(regexPattern);  // For display purposes, if needed
        return axios.post('http://localhost:8000/identify-modifications/', { text: userInput, headers });
      })
      .then(response => {
        column = response.data.modification_info;
        setHeaderModificationInfo(column);  // For display purposes, if needed
  
        // Check if the user input contains the word "replace"
        if (userInput.toLowerCase().includes("replace")) {
          // Extract replacement value from the userInput if specified
          const replacementMatch = userInput.match(/'(.+?)'/);
          if (replacementMatch && replacementMatch[1]) {
            replacementValue = replacementMatch[1];
          }
        }
  
        return axios.post('http://localhost:8000/replace-pattern/', {
          regex: regexPattern,
          column: column,
          data: data,
          replacement: replacementValue
        });
      })
      .then(response => {
        setModifiedData(response.data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error processing the request!', error);
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
        {file && (
          <>
            <Typography variant="body1" sx={{ margin: 1 }}>{file.name}</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleFileUpload}
              disabled={loading}
              sx={{ margin: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Upload"}
            </Button>
          </>
        )}

        {data.length > 0 && <DataTable data={data} />}

        {data.length > 0 && (
          <>
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
              onClick={handleTextAndProcess}
              disabled={loading}
              sx={{ margin: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Submit Text and Process"}
            </Button>
          </>
        )}
        {/* {llmResponse && (
          <Typography variant="body1" sx={{ margin: 2 }}>
            LLM Response (Regex): {llmResponse}
          </Typography>
        )}
        {headerModificationInfo && (
          <Typography variant="body1" sx={{ margin: 2 }}>
            Header Modification Info: {headerModificationInfo}
          </Typography>
        )} */}
        {modifiedData.length > 0 && <DataTable data={modifiedData} />}
      </Container>
    </>
  );
}

export default App;
