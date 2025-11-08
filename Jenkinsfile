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

        stage('Push Images with Advanced Retry') {
            steps {
                script {
                    // Push server image with advanced retry logic
                    retry(2) {
                        timeout(time: 8, unit: 'MINUTES') {
                            sh '''
                                echo "Pushing server image with retry logic..."
                                if ! docker push $SERVER_IMAGE:latest; then
                                    echo "First push attempt failed, waiting and retrying..."
                                    sleep 30
                                    docker push $SERVER_IMAGE:latest
                                fi
                                echo "Server image pushed successfully"
                            '''
                        }
                    }
                    
                    // Push client image with advanced retry logic
                    retry(2) {
                        timeout(time: 8, unit: 'MINUTES') {
                            sh '''
                                echo "Pushing client image with retry logic..."
                                if ! docker push $CLIENT_IMAGE:latest; then
                                    echo "First push attempt failed, waiting and retrying..."
                                    sleep 30
                                    docker push $CLIENT_IMAGE:latest
                                fi
                                echo "Client image pushed successfully"
                            '''
                        }
                    }
                }
            }
        }

        stage('Verify Push Success') {
            steps {
                script {
                    sh '''
                        echo "Verifying images were pushed successfully..."
                        # Pull the images back to verify they're accessible
                        docker pull $SERVER_IMAGE:latest
                        docker pull $CLIENT_IMAGE:latest
                        echo "Images verified and accessible from Docker Hub"
                    '''
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    sh '''
                        echo "Starting local deployment..."
                        
                        # Clean up any existing containers
                        docker stop devops_project-server || true
                        docker rm devops_project-server || true
                        docker stop devops_project-client || true
                        docker rm devops_project-client || true
                        
                        # Deploy server
                        echo "Deploying server container..."
                        docker run -d --name devops_project-server -p 8080:8080 $SERVER_IMAGE:latest
                        
                        # Wait for server to start
                        sleep 10
                        
                        # Deploy client
                        echo "Deploying client container..."
                        docker run -d --name devops_project-client -p 3000:3000 $CLIENT_IMAGE:latest
                        
                        # Wait for client to start
                        sleep 10
                        
                        echo "Local deployment completed"
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh '''
                        echo "Performing health checks..."
                        
                        # Check container status
                        echo "=== Container Status ==="
                        docker ps --filter "name=devops_project" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
                        
                        # Verify containers are running
                        if ! docker ps --filter "name=devops_project-server" --format "{{.Names}}" | grep -q devops_project-server; then
                            echo "❌ Server container is not running"
                            exit 1
                        else
                            echo "✅ Server container is running"
                        fi
                        
                        if ! docker ps --filter "name=devops_project-client" --format "{{.Names}}" | grep -q devops_project-client; then
                            echo "❌ Client container is not running"
                            exit 1
                        else
                            echo "✅ Client container is running"
                        fi
                        
                        echo "Health checks completed successfully"
                    '''
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline completed with status: ${currentBuild.currentResult}"
            sh '''
                echo "=== Final Status ==="
                echo "Server URL: http://localhost:8080"
                echo "Client URL: http://localhost:3000"
                docker ps --filter "name=devops_project" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"
            '''
        }
        success {
            echo "✅ Pipeline completed successfully! Application is deployed and running."
        }
        failure {
            echo "❌ Pipeline failed!"
            sh '''
                echo "=== Debug Information ==="
                echo "Recent container logs:"
                docker logs devops_project-server --tail 50 2>/dev/null || echo "No server logs available"
                docker logs devops_project-client --tail 50 2>/dev/null || echo "No client logs available"
            '''
        }
    }
}


