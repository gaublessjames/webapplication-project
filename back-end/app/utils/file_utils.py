"""
File handling utilities
"""

import os
import mimetypes
from werkzeug.utils import secure_filename

ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp'}
GALLERY_UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static', 'gallery')

def allowed_file(filename, allowed_extensions=None):
    """Check if file extension is allowed"""
    if allowed_extensions is None:
        allowed_extensions = ALLOWED_IMAGE_EXTENSIONS
    
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions

def get_file_extension(filename):
    """Get file extension from filename"""
    return filename.rsplit('.', 1)[1].lower() if '.' in filename else ''

def get_mime_type(filename):
    """Get MIME type from filename"""
    return mimetypes.guess_type(filename)[0]

def ensure_upload_directory(directory):
    """Ensure upload directory exists"""
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

def save_uploaded_file(file, directory, filename=None):
    """Save uploaded file to directory"""
    if filename is None:
        filename = secure_filename(file.filename)
    
    ensure_upload_directory(directory)
    file_path = os.path.join(directory, filename)
    file.save(file_path)
    return file_path 