import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
 constructor(
  private readonly authService: AuthService,
  private readonly usersService: UsersService,
) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: any) {
    return user;
  }

  @Post('make-admin/:id')
async makeAdmin(@Param('id') id: number) {
  const user = await this.usersService.findById(Number(id));

  if (!user) {
    return {
      message: 'User not found',
    };
  }

  user.role = UserRole.ADMIN;

  await this.usersService.save(user);

  return {
    message: 'User is now ADMIN',
  };
}
}