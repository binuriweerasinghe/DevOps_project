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

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t binuriweerasinghe/devops_project:latest .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh 'docker push binuriweerasinghe/devops_project:latest'
                }
            }
        }

        stage('Deploy to Local Server') {
            steps {
                script {
                    sh '''
                    docker stop devops_project || true
                    docker rm devops_project || true
                    docker pull binuriweerasinghe/devops_project:latest
                    docker run -d --name devops_project -p 8080:8080 binuriweerasinghe/devops_project:latest
                    '''
                }
            }
        }

    }
}


