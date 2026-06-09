import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwt.sign({ sub: admin.id, email: admin.email });
    return { access_token: token };
  }

  async changePassword(adminId: string, currentPassword: string, newPassword: string) {
    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new UnauthorizedException();

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) throw new BadRequestException('Current password is incorrect');

    if (newPassword.length < 8) throw new BadRequestException('New password must be at least 8 characters');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });
    return { message: 'Password updated successfully' };
  }
}
