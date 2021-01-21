# node-rest-api
Una API Rest simples con Node y MongoDB (Sin autenticación)

## Ejecutar en Docker
- Renomear el archivo `.env.example` para `.env`
- `docker-compose -f "docker-compose.yml"`

## Ejecutar localmente
- Renomear el archivo `.env.example` para `.env`
- Alterar el archivo `.env` y cambiar el valor de la variable **MONGO_SERVER** para **localhost**
- `npm start`

# Probar la API

## Documentación
- http://localhost:8080/api

## Ejemplo: Insertar un usuario: 
- POST en http://localhost:8080/api/v1/user
- JSON `{"email":"ned@example.local","password":"123456","fullname":"Ned Stark"}`
