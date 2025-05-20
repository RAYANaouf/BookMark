import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(public config: ConfigService) {
    const secret = config.get<string>("JWT_SECRET");
    console.log('=============>>> JWT_SECRET:', config.get('JWT_SECRET'));

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "super-secret-123",
    });
  }

  async validate(payload: any) {
    return payload;
  }
}
