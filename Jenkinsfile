pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Terraform Apply') {
      steps {
        sh '''
          cd terraform
          terraform init
          terraform apply -auto-approve
        '''
      }
    }

    stage('Run Ansible Playbook') {
      steps {
        sh '''
          ansible-playbook ansible/deploy.yml
        '''
      }
    }
  }

  post {
    success {
      echo 'Deployment Completed Successfully!'
    }
    failure {
      echo 'Pipeline Failed.'
    }
  }
}




