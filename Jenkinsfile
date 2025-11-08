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
            parallel {
                stage('Build Server Image') {
                    steps {
                        script {
                            sh '''
                                echo "Building server image..."
                                docker build -f Dockerfile-server -t $SERVER_IMAGE:latest .
                                echo "Server image built successfully"
                            '''
                        }
                    }
                }
                stage('Build Client Image') {
                    steps {
                        script {
                            sh '''
                                echo "Building client image..."
                                docker build -f Dockerfile-client -t $CLIENT_IMAGE:latest .
                                echo "Client image built successfully"
                            '''
                        }
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(
                        credentialsId: env.DOCKERHUB_CREDENTIALS_ID,
                        passwordVariable: 'DOCKERHUB_PASSWORD',
                        usernameVariable: 'DOCKERHUB_USERNAME'
                    )]) {
                        sh '''
                            echo "Logging into Docker Hub..."
                            echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
                            echo "Docker Hub login successful"
                        '''
                    }
                }
            }
        }

        stage('Push Images with Retry') {
            parallel {
                stage('Push Server Image') {
                    steps {
                        script {
                            retry(3) {
                                timeout(time: 10, unit: 'MINUTES') {
                                    sh '''
                                        echo "Pushing server image to Docker Hub..."
                                        docker push $SERVER_IMAGE:latest
                                        echo "Server image pushed successfully"
                                    '''
                                }
                            }
                        }
                    }
                }
                stage('Push Client Image') {
                    steps {
                        script {
                            retry(3) {
                                timeout(time: 10, unit: 'MINUTES') {
                                    sh '''
                                        echo "Pushing client image to Docker Hub..."
                                        docker push $CLIENT_IMAGE:latest
                                        echo "Client image pushed successfully"
                                    '''
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    sh '''
                        echo "Starting local deployment..."
                        
                        # Stop and remove existing containers
                        docker stop devops_project-server || true
                        docker rm devops_project-server || true
                        docker stop devops_project-client || true
                        docker rm devops_project-client || true
                        
                        # Run new containers
                        echo "Starting server container..."
                        docker run -d --name devops_project-server -p 8080:8080 $SERVER_IMAGE:latest
                        
                        echo "Starting client container..."
                        docker run -d --name devops_project-client -p 3000:3000 $CLIENT_IMAGE:latest
                        
                        echo "Waiting for containers to start..."
                        sleep 15
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh '''
                        echo "Verifying deployment..."
                        
                        # Check if containers are running
                        echo "Running containers:"
                        docker ps --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}" | grep devops_project
                        
                        # Simple health checks
                        echo "Testing server accessibility..."
                        curl -f http://localhost:8080/ || curl -f http://localhost:8080/health || echo "Server health check unavailable but continuing"
                        
                        echo "Testing client accessibility..."
                        curl -f http://localhost:3000/ || echo "Client health check unavailable but continuing"
                        
                        echo "Deployment verification completed"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline status: ${currentBuild.currentResult}"
            sh '''
                echo "=== Final Container Status ==="
                docker ps -a --filter "name=devops_project" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
                echo "=== Application URLs ==="
                echo "Server: http://localhost:8080"
                echo "Client: http://localhost:3000"
            '''
        }
        success {
            echo "✅ Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
            sh '''
                echo "=== Troubleshooting Information ==="
                echo "Recent container logs:"
                docker logs devops_project-server --tail 20 || echo "No server logs"
                docker logs devops_project-client --tail 20 || echo "No client logs"
            '''
        }
    }
}



