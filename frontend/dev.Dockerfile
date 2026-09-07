FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV VITE_BACKEND_URL=http://localhost:8080/api/persons/

CMD ["npm", "run", "dev", "--", "--host"]