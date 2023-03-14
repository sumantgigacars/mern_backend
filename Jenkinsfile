pipeline {
  agent any
  stages {
    stage('checkout code') {
      steps {
        git(url: 'https://github.com/sumantgigacars/mern_backend', branch: 'master')
      }
    }

    stage('log') {
      parallel {
        stage('log') {
          steps {
            sh 'ls -la'
          }
        }

        stage('Test') {
          steps {
            sh '''npm i
'''
          }
        }

      }
    }

  }
}