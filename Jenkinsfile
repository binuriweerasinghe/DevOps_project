pipeline {
    agent any

    environment {
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

        stage('Build Server Image') {
            steps {
                script {
                    sh 'docker build -f Dockerfile-server -t $SERVER_IMAGE:latest .'
                }
            }
        }

        stage('Build Client Image') {
            steps {
                script {
                    sh 'docker build -f Dockerfile-client -t $CLIENT_IMAGE:latest .'
                }
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: '76934304-5037-4b31-bd03-bacb8408e0d7',
                        passwordVariable: 'DOCKERHUB_PASSWORD',
                        usernameVariable: 'DOCKERHUB_USERNAME'
                    )]) {
                        sh 'echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin'
                        sh 'docker push $SERVER_IMAGE:latest'
                        sh 'docker push $CLIENT_IMAGE:latest'
                    }
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    sh '''
                    docker stop devops_project-server || true
                    docker rm devops_project-server || true
                    docker run -d --name devops_project-server -p 8080:8080 $SERVER_IMAGE:latest
                    
                    docker stop devops_project-client || true
                    docker rm devops_project-client || true
                    docker run -d --name devops_project-client -p 3000:3000 $CLIENT_IMAGE:latest
                    '''
                }
            }
        }
    }
}



