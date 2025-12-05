import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Permite que Nest procese el resultado del strategy
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      // info puede ser: TokenExpiredError, JsonWebTokenError, etc.
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado');
      }

      throw new UnauthorizedException('Token inválido o ausente');
    }

    // user es lo que retorna JwtStrategy.validate()
    return user;
  }
}