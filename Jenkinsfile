pipeline {
  agent any

  stages {

    stage('Cleanup Docker') {
  steps {
    sh '''
      docker rm -f devops_project-server devops_project-client mongo || true
      docker network rm devops_network || true
    '''
      }
    }


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
          ansible-playbook ansible/playbook.yml
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




