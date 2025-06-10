import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ethers } from 'ethers';
import { VerifyWalletDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async verifyWallet(
    verifyWalletDto: VerifyWalletDto,
  ): Promise<{ access_token: string }> {
    const { walletAddress, signature, message } = verifyWalletDto;

    try {
      // Verify the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new UnauthorizedException('Invalid signature');
      }

      // Generate JWT token
      const payload = { wallet_address: walletAddress.toLowerCase() };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    } catch (error) {
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  async validateUser(wallet_address: string): Promise<any> {
    // This method will be used by the JWT strategy
    return { wallet_address };
  }
}
