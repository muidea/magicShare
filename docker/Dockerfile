FROM centos

LABEL Author="rangh"

RUN mkdir -p /var/app

WORKDIR /var/app

ADD magicShare /var/app/magicShare
ADD bootstrap.sh /var/app/bootstrap.sh
ADD wait-for-it.sh /var/app/wait-for-it.sh

RUN chmod +x /var/app/magicShare
RUN chmod +x /var/app/bootstrap.sh
RUN chmod +x /var/app/wait-for-it.sh

ENTRYPOINT [ "/var/app/bootstrap.sh" ]

EXPOSE 8080
