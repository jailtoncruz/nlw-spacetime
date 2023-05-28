FROM nginx

# COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/nginx.conf

# Ajust date
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Brazil/East /etc/localtime

RUN service nginx configtest