#!/usr/bin/env python3
"""
Startup script for Café Fausse Flask API
"""

import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', False), host='0.0.0.0', port=5000) 