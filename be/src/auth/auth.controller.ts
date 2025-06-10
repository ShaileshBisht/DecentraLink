import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyWalletDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  async verify(@Body() verifyWalletDto: VerifyWalletDto) {
    return this.authService.verifyWallet(verifyWalletDto);
  }
}
