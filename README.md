Nest App initialization:

nest new api --skip-git && cd api && npm i @nestjs/typeorm typeorm mssql @nestjs/passport passport passport-jwt passport-local @types/passport-jwt @nestjs/jwt passport-facebook passport-google-oauth20 bcrypt @types/bcrypt class-validator class-transformer @nestjs/swagger swagger-ui-express @nestjs/platform-socket.io socket.io telegraf @nestjs/schedule @nestjs/config sendgrid && nest g module auth && nest g res domains/user --no-spec && nest g res domains/challenges --no-spec && nest g service auth --no-spec && nest g controller auth --no-spec

nest-cli.json:
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": ["@nestjs/swagger"]
  }
}