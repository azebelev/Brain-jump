import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    signOptions:{expiresIn:'3000s'},
    secret: configService.get('JWT_SECRET')
  };
};