provider "aws" {
  region = "us-east-1"
}

resource "aws_instance" "web" {
  ami           = "ami-0532be01f26a3de55"
  instance_type = "t3.micro"
  key_name      = "devops-key"
  security_groups = ["launch-wizard-1"]

  tags = {
    Name = "DevOps EC2"
  }
}