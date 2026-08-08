variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy resources"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "CIDR block for the custom VPC"
}

variable "public_subnet_cidr" {
  type        = string
  default     = "10.0.1.0/24"
  description = "CIDR block for the public subnet"
}

variable "private_subnet_cidr" {
  type        = string
  default     = "10.0.2.0/24"
  description = "CIDR block for the private subnet"
}

variable "db_subnet_cidr" {
  type        = string
  default     = "10.0.3.0/24"
  description = "CIDR block for the database subnet"
}

variable "my_ip" {
  type        = string
  description = "Your public IP in CIDR format (e.g. 198.51.100.15/32) for secure SSH access"
}

variable "instance_type" {
  type        = string
  default     = "t2.micro"
  description = "EC2 instance size"
}

variable "key_name" {
  type        = string
  default     = "travelmemory-key"
  description = "Name of the SSH key pair to associate with EC2 instances"
}