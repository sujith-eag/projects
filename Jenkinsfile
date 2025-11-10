pipeline {
    // 'agent any' means this pipeline can run on any available Jenkins agent (server)
    agent any

    stages {
        // NOTE: A 'Checkout' stage is not needed here.
        // Jenkins automatically checks out source code
        // from the repository specified in the job configuration.

        stage('Build') {
            steps {
                // Placeholder.
                // e.g., for Node.js: 'sh "npm install"'
                // e.g., for Java:   'sh "mvn clean package"'
                echo "Building..."
            }
        }

        stage('Test') {
            steps {
                // Placeholder.
                // e.g., for Node.js: 'sh "npm test"'
                // e.g., for Java:   'sh "mvn test"'
                echo "Testing..."
            }
        }

        stage('Deploy') {
            steps {
                // Placeholder for your deployment steps
                echo "Deploying..."
            }
        }
        stage('Run Python') {
            steps {
                echo "--- Running Python ---"
                // This command runs the Python script
                // We use 'python3' to be specific
                sh 'python3 demo_python.py'
            }
        }        
        stage('Build and Run Java') {
            steps {
                echo "--- Compiling Java ---"
                // This command compiles DemoJava.java into DemoJava.class
                sh 'javac DemoJava.java'
                
                echo "--- Running Java ---"
                // This command runs the compiled class
                sh 'java DemoJava'
            }
        }
    }
    post {
        // This 'always' block runs regardless of whether the stages passed or failed
        always {
            echo "Pipeline has finished."
        }
    }
}
