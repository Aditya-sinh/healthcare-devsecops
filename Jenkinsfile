
pipeline {
    agent any

    environment {
        IMAGE_NAME = 'healthcare-app'
        IMAGE_TAG = 'v1'
    }

    stages {

        stage('SCM') {
            steps {
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'

                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker images ${IMAGE_NAME}
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    trivy image --format table \
                    --output trivy-report.txt \
                    ${IMAGE_NAME}:${IMAGE_TAG}

                    trivy image --severity HIGH,CRITICAL \
                    ${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-report.txt',
                             allowEmptyArchive: true
        }

        success {
            echo 'Healthcare DevSecOps pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
