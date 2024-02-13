Nest App initialization:

nest new api --skip-git && cd api && npm i @nestjs/typeorm typeorm @nestjs/passport passport passport-jwt passport-facebook passport-google-oauth20 @nestjs/swagger @nestjs/platform-socket.io socket.io telegraf @nestjs/schedule @nestjs/config sendgrid && nest g module auth && nest g res user --no-spec && nest g res challenges --no-spec && nest g service auth --no-spec && nest g controller auth --no-spec

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