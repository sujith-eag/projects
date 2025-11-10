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
    }
}
