#!/usr/bin/env python3
"""
Startup script for Café Fausse Flask API
"""

import os
from app import create_app

if __name__ == "__main__":
    # Set default environment if not already set
    if not os.getenv('FLASK_ENV'):
        os.environ['FLASK_ENV'] = 'development'
    
    app = create_app()
    
    print("=" * 50)
    print("Café Fausse API Server")
    print("=" * 50)
    print(f"Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"Debug Mode: {os.getenv('FLASK_ENV') == 'development'}")
    print("Server starting on http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=os.getenv('FLASK_ENV') == 'development'
        )
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error starting server: {e}") 