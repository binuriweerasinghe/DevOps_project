pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS_ID = '76934304-5037-4b31-bd03-bacb8408e0d7'
        SERVER_IMAGE = "binuriweerasinghe/devops_project-server"
        CLIENT_IMAGE = "binuriweerasinghe/devops_project-client"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/binuriweerasinghe/DevOps_project.git',
                    credentialsId: 'b0dc98fc-47b0-447a-b99f-33fac62fb97f'
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    echo "Building server image..."
                    docker build -f Dockerfile-server -t $SERVER_IMAGE:latest .
                    echo "Building client image..."
                    docker build -f Dockerfile-client -t $CLIENT_IMAGE:latest .
                '''
            }
        }

        stage('Docker Hub Login & Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: env.DOCKERHUB_CREDENTIALS_ID,
                    passwordVariable: 'DOCKERHUB_PASSWORD',
                    usernameVariable: 'DOCKERHUB_USERNAME'
                )]) {
                    sh '''
                        echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                        docker push $SERVER_IMAGE:latest
                        docker push $CLIENT_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                sh '''
                    # Stop existing containers if running
                    docker stop devops_project-server devops_project-client || true
                    docker rm devops_project-server devops_project-client || true

                    # Run containers
                    docker run -d --name devops_project-server -p 8080:8080 $SERVER_IMAGE:latest
                    docker run -d --name devops_project-client -p 3000:3000 $CLIENT_IMAGE:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    echo "Checking if containers are running..."
                    docker ps --filter "name=devops_project" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline finished with status: ${currentBuild.currentResult}"
        }
    }
}

