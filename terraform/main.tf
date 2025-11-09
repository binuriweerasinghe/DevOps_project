terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 2.25"
    }
  }
}

provider "docker" {}

# -----------------------------
# Docker network
# -----------------------------
resource "docker_network" "devops_network" {
  name = "devops_network"
  # Terraform will reuse existing network if it exists
}

# -----------------------------
# Server image from Docker Hub
# -----------------------------
resource "docker_image" "server_image" {
  name         = "binuriweerasinghe/devops_project-server:latest"
  keep_locally = true
}

# -----------------------------
# Server container
# -----------------------------
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

  lifecycle {
    # Recreate container if the image changes
    replace_triggered_by = [
      docker_image.server_image.id
    ]
  }

  depends_on = [
    docker_image.server_image,
    docker_network.devops_network
  ]
}

# -----------------------------
# Client image from Docker Hub
# -----------------------------
resource "docker_image" "client_image" {
  name         = "binuriweerasinghe/devops_project-client:latest"
  keep_locally = true
}

# -----------------------------
# Client container
# -----------------------------
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

  lifecycle {
    # Recreate container if the image changes
    replace_triggered_by = [
      docker_image.client_image.id
    ]
  }

  depends_on = [
    docker_image.client_image,
    docker_network.devops_network
  ]
}

# -----------------------------
# Mongo container
# -----------------------------
resource "docker_container" "mongo" {
  name  = "mongo"
  image = "mongo:6.0"

  networks_advanced {
    name = docker_network.devops_network.name
  }

  ports {
    internal = 27017
    external = 27018   # Avoid conflict with host MongoDB
  }

  volumes {
    host_path      = abspath("${path.module}/mongo-data")
    container_path = "/data/db"
  }

  env = [
    "MONGO_INITDB_DATABASE=myDatabase"
  ]

  lifecycle {
    # Recreate container if something triggers a change
    replace_triggered_by = []
  }

  depends_on = [
    docker_network.devops_network
  ]
}






