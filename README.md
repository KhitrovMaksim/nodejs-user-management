# nodejs-holiday-bot.

## 3. Chat bots.

### 3.3 Holiday bot.

#### Task.

Create a telegram bot that on /start provides a reply keyboard with flags of 4-8 countries. When the user presses the flag it should provide which holiday is today in this country.

#### Bot.
```
name: KhitrovHolidayBot
link: http://t.me/KhitrovHolidayBot
```

#### How to run locally (dev)
```shell
npm run dev
```
#### How to run globally (prod)
> **Note**
> Before executing, make sure that you have:
> - aws account
> - aws user with AmazonECS_FullAccess and AmazonEC2ContainerRegistryFullAccess roles
> - aws ecsTaskExecutionRole role
1. Configure AWS CLI, AWS SSM and login to AWS ECR.
Add to AWS Systems Manager -> Parameter Store telegram bot token.
```shell
aws configure
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 698445805226.dkr.ecr.us-east-2.amazonaws.com
```
2. Build image, create repository and push.
```shell
docker build -t nodejsholidaybot:1.0 .
aws ecr create-repository --repository-name nodejsholidaybot --image-scanning-configuration scanOnPush=true --region us-east-2
docker tag nodejsholidaybot:1.0 698445805226.dkr.ecr.us-east-2.amazonaws.com/nodejsholidaybot:1.0
docker push 698445805226.dkr.ecr.us-east-2.amazonaws.com/nodejsholidaybot:1.0
```
3. Create AWS ECS Fargate cluster and run service.
```shell
aws ecs create-cluster --cluster-name telegram-bots-cluster
aws ecs register-task-definition --cli-input-json  file://aws-ecs-fargate-task-definition.json
aws ecs create-service --cluster telegram-bots-cluster --service-name nodejs-holiday-bot-service --task-definition nodejs-holiday-bot-task:1 --desired-count 1 --launch-type "FARGATE" --network-configuration "awsvpcConfiguration={subnets=[subnet-91d56cdd],securityGroups=[sg-00f96819122999b45],assignPublicIp=ENABLED}"
```
4. Delete service, cluster and repository.
```shell
aws ecs delete-service --cluster telegram-bots-cluster --service nodejs-holiday-bot-service --force
aws ecs delete-cluster --cluster telegram-bots-cluster
aws ecr delete-repository --repository-name nodejsholidaybot --force
```
