# Waste Management System

Waste Management System: Developed a web application using HTML, CSS, JavaScript, Node.js, and React to track and visualize waste data. Integrated AI-based waste segregation and personalized recommendations, with interactive charts displaying waste amounts stored in a database.

## 🚀 Installation Guide

## 1. Clone the repository
    git clone [repository_link]
    cd [project_directory]

## 2. Install dependencies
    ### Backend (Node.js):
        cd backend
        npm install
    ### Frontend (React):
        cd ../frontend
        npm install
    ### Python server:
        cd ../python-server
        # Create and activate virtual environment
        python -m venv venv
        # Windows
        venv\Scripts\activate
        # Linux/macOS
        source venv/bin/activate
        # Install dependencies
        pip install -r requirements.txt
        
## 3.Set up PostgreSQL database
    CREATE DATABASE waste_management;
    
## 4. Run all servers concurrently
    ### Run all servers concurrently
        cd [project_directory]
        npm run dev
    ### Start the Python server:
        cd python-server
        venv\Scripts\activate
        python app.py
    ### Run frontend and backend together:
        cd [project_directory]
        npm run dev

      

