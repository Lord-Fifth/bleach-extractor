# core/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import pandas as pd
import json
import os
import time
from openai import OpenAI  # Import the OpenAI client

# Set your OpenAI API key
openai_api_key = os.getenv('OPENAI_API_KEY')  # Retrieve the API key from environment variable

if openai_api_key:
    client = OpenAI(api_key=openai_api_key)  # Initialize the OpenAI client
else:
    raise ValueError("OpenAI API key not set in environment variables. Please set 'OPENAI_API_KEY'.")

@csrf_exempt
def process_file(request):
    if request.method == 'POST':
        try:
            print("Request method:", request.method)
            print("Files:", request.FILES)

            uploaded_file = request.FILES.get('file')
            if not uploaded_file:
                return JsonResponse({'error': 'No file uploaded'}, status=400)

            print("Uploaded file name:", uploaded_file.name)
            print("Uploaded file size:", uploaded_file.size)

            df = pd.read_excel(uploaded_file)
            print("Data frame shape:", df.shape)
            print("Data frame columns:", df.columns)

            data = df.to_dict(orient='records')
            return JsonResponse({'data': data}, safe=False, status=200)
        except Exception as e:
            print("Error occurred:", e)
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def llm_process(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            user_text = body.get('text', '')
            if not user_text:
                return JsonResponse({'error': 'No text provided'}, status=400)

            llm_response = generate_regex_from_description(user_text)
            return JsonResponse({'response': llm_response}, status=200)
        except Exception as e:
            print("Error occurred:", e)
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

def generate_regex_from_description(description):
    prompt = f"Generate only the regular expression to match the following description without any explanation: {description}"
    try:
        response = call_openai_api(prompt)
        if response:
            regex_pattern = extract_regex_from_response(response)
            return regex_pattern
        else:
            return "No response from API"
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def extract_regex_from_response(response):
    try:
        # Access the content using attribute access
        content = response.choices[0].message.content.strip()
        start = content.find('```') + 3
        end = content.find('```', start)
        if start != -1 and end != -1:
            return content[start:end].strip()
        return "No regex pattern found in the response"
    except (AttributeError, IndexError) as e:
        print(f"An error occurred during extraction: {e}")
        return "Error extracting regex pattern"

def call_openai_api(prompt, retries=3):
    for i in range(retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-2024-05-13",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1000 
            )
            print(response)
            return response
        except Exception as e:
            error_message = str(e)
            print(f"Exception encountered: {error_message}")
            if 'rate limit' in error_message.lower() or 'quota' in error_message.lower():
                print("Handling quota exceedance...")
                if i < retries - 1:
                    sleep_time = 2 ** i
                    print(f"Retrying in {sleep_time} seconds...")
                    time.sleep(sleep_time)
                else:
                    print("Maximum retries reached. Please try again later.")
            else:
                break
    print("Failed to get a valid response after retries.")
    return None
