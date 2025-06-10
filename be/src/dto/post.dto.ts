import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}

export class NewPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}

export class LikePostDto {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;
}

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}

export class NewCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  content: string;
}
