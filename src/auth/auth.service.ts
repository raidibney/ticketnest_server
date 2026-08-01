import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
  ...registerDto,
  password: hashedPassword,
});

const { password, ...userWithoutPassword } = user;

return {
  message: 'User registered successfully',
  user: userWithoutPassword,
};
  }

 async login(loginDto: LoginDto) {
  const user = await this.usersService.findByEmail(loginDto.email);

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(loginDto.password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };

  const { password, ...userWithoutPassword } = user;

  return {
    access_token: await this.jwtService.signAsync(payload),
    user: userWithoutPassword,
  };
}
}