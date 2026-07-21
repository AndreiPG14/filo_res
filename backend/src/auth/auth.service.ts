import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');
    if (user.status === 'LOCKED') throw new UnauthorizedException('Usuario bloqueado');
    const payload = { sub: user.id, email: user.email, profile: user.profile };
    return { access_token: this.jwt.sign(payload), user: { id: user.id, name: user.name, email: user.email, profile: user.profile } };
  }
}
