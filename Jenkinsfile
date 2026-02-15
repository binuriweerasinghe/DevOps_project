pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('76934304-5037-4b31-bd03-bacb8408e0d7') 
        SSH_CREDENTIALS = credentials('ansible-ssh')             
        REMOTE_HOST = '3.142.180.163'
        REMOTE_USER = 'ubuntu' 
    }

    stages {

        stage('Checkout Code') {
    steps {
        script {
            // Get the workspace
            def workspace = pwd()

            // Clean everything except mongo-data (quote the path to handle spaces)
            sh """find "${workspace}" -mindepth 1 -maxdepth 1 ! -name 'mongo-data' -exec rm -rf {} +"""

            // Checkout code
            git branch: 'main', url: 'https://github.com/binuriweerasinghe/DevOps_project'
        }
    }
}

stage('Build Docker Images') {
    steps {
        script {
            sh '''
            docker build \
              -f "${WORKSPACE}/Dockerfile-client" \
              -t binuriweerasinghe/devops_project-client:${BUILD_NUMBER} \
              "${WORKSPACE}/client"

            docker build \
              -f "${WORKSPACE}/Dockerfile-server" \
              -t binuriweerasinghe/devops_project-server:${BUILD_NUMBER} \
              "${WORKSPACE}/server"
            '''
        }
    }
}




        stage('Push Docker Images') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: '76934304-5037-4b31-bd03-bacb8408e0d7',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push binuriweerasinghe/devops_project-client:${BUILD_NUMBER}
            docker push binuriweerasinghe/devops_project-server:${BUILD_NUMBER}
            '''
        }
    }
}

        stage('Deploy to EC2 via Ansible') {
            steps {
                sshagent(['ansible-ssh']) {
                    sh """
ansible-playbook -i ${REMOTE_HOST}, ansible/playbook.yml \
-u ${REMOTE_USER} \
-e "build_number=${env.BUILD_NUMBER}" \
--ssh-extra-args='-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null'
"""
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}