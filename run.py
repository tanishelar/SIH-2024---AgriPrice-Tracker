import subprocess
import webbrowser
import time
import os
import sys

def run_project():
    try:
        # Start Flask backend
        print("Starting Backend Server...")
        flask_process = subprocess.Popen(["python", "app.py"], 
                                       stdout=subprocess.PIPE,
                                       stderr=subprocess.PIPE)
        
        # Wait for Flask to start
        time.sleep(2)
        
        # Start React frontend using npx (which comes with Node.js)
        print("Starting Frontend Server...")
        os.chdir("frontend")
        
        # Use 'npm.cmd' on Windows instead of 'npm'
        npm_command = 'npm.cmd' if sys.platform == 'win32' else 'npm'
        
        try:
            npm_process = subprocess.Popen([npm_command, "start"], 
                                         shell=True,  # Add shell=True for Windows
                                         stdout=subprocess.PIPE,
                                         stderr=subprocess.PIPE)
        except FileNotFoundError:
            print("Error: npm not found. Please make sure Node.js is installed and in your PATH")
            print("You can download Node.js from: https://nodejs.org/")
            flask_process.terminate()
            return
        
        # Wait for React to start
        time.sleep(5)
        
        # Open browser automatically
        print("Opening application in browser...")
        webbrowser.open('http://localhost:3000')
        
        try:
            # Keep the servers running
            flask_process.wait()
            npm_process.wait()
        except KeyboardInterrupt:
            # Handle Ctrl+C gracefully
            print("\nShutting down servers...")
            flask_process.terminate()
            npm_process.terminate()
            
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    run_project() 