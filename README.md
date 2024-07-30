# Regex Pattern Matching and Replacement Web Application

## Overview

This web application provides a user interface for uploading Excel files, identifying columns based on user descriptions, and replacing text patterns using regular expressions. The application leverages an LLM (Language Model) for natural language processing tasks, including generating regex patterns and identifying relevant columns for modification.

## Features

- **File Upload**: Upload Excel files (.xlsx) for processing.
- **Data Display**: View the first five rows of the uploaded data in a tabular format.
- **Natural Language Processing**: Input descriptions to generate regex patterns and identify columns for modification using an LLM.
- **Text Replacement**: Replace matched patterns in the specified column with a provided replacement value.

## Setup Instructions

### Prerequisites

- **Backend**: Django with required dependencies
- **Frontend**: React with Material-UI for UI components
- **OpenAI API Key**: Required for LLM processing

### Backend Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Lord-Fifth/bleach-extractor/
    cd regex_app
    ```

2. **Set up a Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Set OpenAI API Key**:
   Set the OpenAI API key in the environment variable `OPENAI_API_KEY`.

5. **Run Django Migrations**:
    ```bash
    python manage.py migrate
    ```

6. **Start the Backend Server**:
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1. **Navigate to the Frontend Directory**:
    ```bash
    cd regex-frontend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Start the Frontend Server**:
    ```bash
    npm start
    ```

## Usage

1. **Upload an Excel File**:
   - Click on "Choose File" to select an Excel file (.xlsx).
   - Click "Upload" to process the file. The first five rows will be displayed.

2. **Enter Text for LLM Processing**:
   - Enter a description in the text box. For example, "Find email addresses in the Email column and replace them with 'REDACTED'."

3. **Submit Text and Process**:
   - Click "Submit Text and Process" to generate a regex pattern, identify the column for modification, and replace the matched patterns with the provided replacement value.

## License

This project is licensed under the MIT License.
