output "vpc_id" {
  value       = aws_vpc.main.id
  description = "The ID of the custom VPC"
}

output "public_subnet_id" {
  value       = aws_subnet.public.id
  description = "The ID of the Public Subnet"
}

output "private_subnet_id" {
  value       = aws_subnet.private.id
  description = "The ID of the Private Subnet"
}

output "db_subnet_id" {
  value       = aws_subnet.db.id
  description = "The ID of the Database Subnet"
}

output "web_security_group_id" {
  value       = aws_security_group.web_sg.id
  description = "The ID of the Web Server Security Group"
}

output "db_security_group_id" {
  value       = aws_security_group.db_sg.id
  description = "The ID of the Database Server Security Group"
}

output "ec2_iam_role_name" {
  value       = aws_iam_role.ec2_role.name
  description = "The Name of the IAM Role attached to EC2 instances"
}

output "ec2_iam_role_arn" {
  value       = aws_iam_role.ec2_role.arn
  description = "The ARN of the IAM Role attached to EC2 instances"
}

output "web_server_public_ip" {
  value       = aws_instance.web.public_ip
  description = "The public IP address of the web server"
}

output "db_server_private_ip" {
  value       = aws_instance.db.private_ip
  description = "The private IP address of the database server"
}
