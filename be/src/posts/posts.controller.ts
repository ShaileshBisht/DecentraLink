import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  LikePostDto,
  CreateCommentDto,
  NewPostDto,
  NewCommentDto,
} from '../dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosts(@Request() req) {
    const walletAddress = req.user?.wallet_address;
    return this.postsService.findAll(walletAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const walletAddress = req.user?.wallet_address;
    return this.postsService.findOne(id, walletAddress);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() newPostDto: NewPostDto, @Request() req) {
    const createPostDto: CreatePostDto = {
      wallet_address: req.user.wallet_address,
      content: newPostDto.content,
    };
    return this.postsService.createPost(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const likePostDto: LikePostDto = {
      wallet_address: req.user.wallet_address,
    };
    return this.postsService.likePost(id, likePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const likePostDto: LikePostDto = {
      wallet_address: req.user.wallet_address,
    };
    await this.postsService.unlikePost(id, likePostDto);
    return { message: 'Post unliked successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async commentOnPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() newCommentDto: NewCommentDto,
    @Request() req,
  ) {
    const createCommentDto: CreateCommentDto = {
      wallet_address: req.user.wallet_address,
      content: newCommentDto.content,
    };
    return this.postsService.commentOnPost(id, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const post = await this.postsService.findOne(id);
    if (
      post.wallet_address.toLowerCase() !==
      req.user.wallet_address.toLowerCase()
    ) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsService.deletePost(id);
    return { message: 'Post deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId')
  async deleteComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Request() req,
  ) {
    const comment = await this.postsService.findOneComment(commentId);
    if (
      comment.wallet_address.toLowerCase() !==
      req.user.wallet_address.toLowerCase()
    ) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.postsService.deleteComment(postId, commentId);
    return { message: 'Comment deleted successfully' };
  }
}
