FROM node:0.10
MAINTAINER "Cyril Gravelier" <cyril@18ruedivona.eu>

##################
# Install addons #
##################
RUN npm install -g nodemon

RUN mkdir -p /data
WORKDIR /data
VOLUME ["/data"]

ADD docker-entrypoint.sh /data/docker-entrypoint.sh
CMD ["/data/docker-entrypoint.sh"]
