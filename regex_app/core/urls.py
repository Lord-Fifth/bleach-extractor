# your_app/urls.py
from django.urls import path
from .views import process_file, llm_process, identify_modifications

urlpatterns = [
    path('process/', process_file, name='process_file'),
    path('llm-process/', llm_process, name='llm_process'),  # New endpoint for text processing
    path('identify-modifications/', identify_modifications, name='identify_modifications'),
]