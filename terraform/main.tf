terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.25"
    }
  }
}

provider "docker" {}

# Docker network
resource "docker_network" "devops_network" {
  name = "devops_network"
}

# Pull existing server image from Docker Hub
resource "docker_image" "server_image" {
  name         = "binuriweerasinghe/devops_project-server:latest"
  keep_locally = true
}

# Server container
resource "docker_container" "server" {
  name  = "devops_project-server"
  image = docker_image.server_image.name

  networks_advanced {
    name = docker_network.devops_network.name
  }

  ports {
    internal = 5000
    external = 5000
  }

  env = [
    "MONGODB_URI=mongodb://mongo:27017/myDatabase",
    "HOST=0.0.0.0"
  ]

  depends_on = [
    docker_image.server_image,
    docker_network.devops_network
  ]
}

# Pull existing client image from Docker Hub
resource "docker_image" "client_image" {
  name         = "binuriweerasinghe/devops_project-client:latest"
  keep_locally = true
}

# Client container
resource "docker_container" "client" {
  name  = "devops_project-client"
  image = docker_image.client_image.name

  networks_advanced {
    name = docker_network.devops_network.name
  }

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [
    docker_image.client_image,
    docker_network.devops_network
  ]
}

# Optional: Mongo container (if you want Terraform to manage it too)
resource "docker_container" "mongo" {
  name  = "mongo"
  image = "mongo:6.0"

  networks_advanced {
    name = docker_network.devops_network.name
  }

  ports {
    internal = 27017
    external = 27018
  }

  volumes {
  host_path      = abspath("${path.module}/mongo-data")
  container_path = "/data/db"
}

  env = [
    "MONGO_INITDB_DATABASE=myDatabase"
  ]

  depends_on = [
    docker_network.devops_network
  ]
}




