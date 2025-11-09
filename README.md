# Rimac (Serverless)
Autor       : Andy P. Ruiz
Descripcion : API Gateway + Lambda + DynamoDB + SNS + SQS + EventBridge + RDS (MySQL).

## Requisitos
- Node.js 20

## Instalar
```bash
npm i
```

## Variables (RDS) en SSM Parameter Store
Parametros (ejemplo stage `dev`):
```
/rimac/dev/rds/host
/rimac/dev/rds/port
/rimac/dev/rds/user
/rimac/dev/rds/pass   (SecureString)
/rimac/dev/rds/db
```

## Desplegar
```bash
npx serverless deploy --stage dev
```

## Endpoints
- POST /appointments
- GET  /appointments/{insuredId}

## Pruebas locales
```bash
npm test
npx serverless offline
```

## SQL de ejemplo (RDS)
Archivo: `db/01_create_appointments.sql`.
