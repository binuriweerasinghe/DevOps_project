pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
	 	url: 'https://github.com/binuriweerasinghe/DevOps_project.git',
		credentialsId: 'b0dc98fc-47b0-447a-b99f-33fac62fb97f'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                // Example: for Java project use:
                // sh 'mvn clean install'
                // Example: for Node project use:
                // sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add test commands here
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploy stage - optional'
                // Add deploy commands if you have any
            }
        }
    }
}

