FROM nginx

LABEL Author="rangh"
LABEL Application="magicShareUI"


RUN mkdir -p /etc/nginx/logs

COPY magicShareUI /tmp/
RUN cd /tmp \
 && tar -xvf magicShareUI -C /usr/share/nginx/html/ \
 && rm -f magicShareUI

ADD nginx.conf /etc/nginx/nginx.conf
