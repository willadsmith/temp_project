pipeline {
    agent {
        node {
            label 'nodejs' 
        }
    }
    environment {
        registry = 'registry.k10.kaztoll.kz/kaztoll-enterprise-frontend'
    }
    stages {
        stage("Build Docker Image kaztoll-enterprise-frontend") {
            steps {
               script { 
                  dockerImageBuild = docker.build registry + ":latest"
               }
            }
        }
        stage(" registry.k10.kaztoll.kz/kaztoll-enterprise-frontend push") {
            steps {
               sh "docker push registry.k10.kaztoll.kz/kaztoll-enterprise-frontend"
            }
        }
        stage("msw_registry kaztoll-enterprise-frontend image pull&push") {
            steps {
                ansiblePlaybook become: true, credentialsId: 'msw_registry_nexus_user_ssh_key', inventory: 'hosts.inv', playbook: 'docker_pull_push.yml'
            }
        }
	stage("kaztoll-enterprise-frontend container deploy on Remote Server") {
            steps {
                ansiblePlaybook become: true, credentialsId: 'msw_appserv09_msw-node03_nexus_user_ssh_key', inventory: 'hosts.inv', playbook: 'kaztoll-enterprise-front_container_deploy.yml'
            }
        }
    }
}
