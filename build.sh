#!/bin/bash

DEPLOY_ENV=${1:-$"stg"}

RED='\033[0;31m'
GREEN='\033[0;32m'

if [ $DEPLOY_ENV == "dev" ]
then

    sudo docker image rm arvan-test-task-dev || true

	sudo docker build -t arvan-test-task-dev -f Dockerfile.dev . --network=host

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The image built successfully..!\n"
    else
        echo -e "\n${RED}Failed to remove image..!\n"
        exit 1
    fi

    sudo docker container rm -f arvan-test-task-dev || true

    sudo docker run -d --restart always -p 4000:80 --name arvan-test-task-dev arvan-test-task-dev

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The container is running..!\n"
    else
        echo -e "\n${RED}FAILED..!\n"
        exit 1
    fi
fi

if [ $DEPLOY_ENV == "stg" ]
then
	git pull origin k8s-stg

	yarn build:stg

    sudo docker image rm arvan-test-task-stg || true

	sudo docker build -t arvan-test-task-stg -f Dockerfile.staging . --network=host

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The image built successfully..!\n"
    else
        echo -e "\n${RED}Failed to build image..!\n"
        exit 1
    fi

    sudo docker container rm -f arvan-test-task-stg || true

    sudo docker run -d --restart always -p 80:80 --name arvan-test-task-stg arvan-test-task-stg

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The container is running..!\n"
    else
        echo -e "\n${RED}Failed to run container..!\n"
        exit 1
    fi
fi

if [ $DEPLOY_ENV == "prod" ]
then
	git pull origin main

	yarn build:prod

    sudo docker image rm arvan-test-task-prod || true

    sudo docker build -t arvan-test-task-prod -f Dockerfile.prod .

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The image built successfully..!\n"
    else
        echo -e "\n${RED}Failed to build image..!\n"
        exit 1
    fi

    sudo docker container rm -f arvan-test-task-prod || true

    sudo docker run -d --restart always -p 80:80 --name arvan-test-task-prod arvan-test-task-prod

    if [ $? -eq 0 ];
    then
        echo -e "\n${GREEN}The container is running..!\n"
    else
        echo -e "\n${RED}FAILED..!\n"
        exit 1
    fi
fi
