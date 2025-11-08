pipeline {
    agent any

    environment {
        DOCKERHUB = credentials('dockerhub') // Jenkins DockerHub credentials ID
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

        stage('Push Server Image to Docker Hub') {
    steps {
        script {
            sh 'docker login -u binuriweerasinghe -p Binuri@123'
            sh 'docker push $SERVER_IMAGE:latest'
        }
    }
}

        stage('Push Client Image to Docker Hub') {
            steps {
                script {
                    sh 'docker push $CLIENT_IMAGE:latest'
                }
            }
        }

        stage('Deploy Server Locally') {
            steps {
                script {
                    sh '''
                    docker stop devops_project-server || true
                    docker rm devops_project-server || true
                    docker pull $SERVER_IMAGE:latest
                    docker run -d --name devops_project-server -p 8080:8080 $SERVER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy Client Locally') {
            steps {
                script {
                    sh '''
                    docker stop devops_project-client || true
                    docker rm devops_project-client || true
                    docker pull $CLIENT_IMAGE:latest
                    docker run -d --name devops_project-client -p 3000:3000 $CLIENT_IMAGE:latest
                    '''
                }
            }
        }

    }
}



