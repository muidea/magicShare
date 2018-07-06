FROM nginx

LABEL Author="rangh"
LABEL Application="magicShare"


RUN mkdir -p /etc/nginx/logs

COPY magicShare /tmp/
RUN cd /tmp \
 && tar -xvf magicShare -C /usr/share/nginx/html/ \
 && rm -f magicShare

ADD nginx.conf /etc/nginx/nginx.conf
