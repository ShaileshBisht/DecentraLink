import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../entities/post.entity';
import { Like } from '../entities/like.entity';
import { Comment } from '../entities/comment.entity';
import { CreatePostDto, LikePostDto, CreateCommentDto } from '../dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  private async addLikeInfo(
    posts: Post[],
    walletAddress?: string,
  ): Promise<any[]> {
    if (!walletAddress) {
      return posts.map((post) => ({
        ...post,
        has_liked: false,
        likes_count: post.likes?.length || 0,
        comments_count: post.comments?.length || 0,
      }));
    }

    const postsWithLikeInfo = await Promise.all(
      posts.map(async (post) => {
        const hasLiked = await this.likesRepository.findOne({
          where: {
            post_id: post.id,
            wallet_address: walletAddress.toLowerCase(),
          },
        });

        return {
          ...post,
          has_liked: !!hasLiked,
          likes_count: post.likes?.length || 0,
          comments_count: post.comments?.length || 0,
        };
      }),
    );

    return postsWithLikeInfo;
  }

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create({
      wallet_address: createPostDto.wallet_address.toLowerCase(),
      content: createPostDto.content,
    });
    return this.postsRepository.save(post);
  }

  async findAll(walletAddress?: string): Promise<any[]> {
    const posts = await this.postsRepository.find({
      relations: ['user', 'likes', 'comments', 'comments.user'],
      order: { timestamp: 'DESC' },
    });

    return this.addLikeInfo(posts, walletAddress);
  }

  async findOne(id: number, walletAddress?: string): Promise<any> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const [postWithLikeInfo] = await this.addLikeInfo([post], walletAddress);
    return postWithLikeInfo;
  }

  async likePost(postId: number, likePostDto: LikePostDto): Promise<Like> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: likePostDto.wallet_address.toLowerCase(),
      },
    });

    if (existingLike) {
      throw new ConflictException('Post already liked');
    }

    const like = this.likesRepository.create({
      post_id: postId,
      wallet_address: likePostDto.wallet_address.toLowerCase(),
    });

    return this.likesRepository.save(like);
  }

  async unlikePost(postId: number, likePostDto: LikePostDto): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.likesRepository.findOne({
      where: {
        post_id: postId,
        wallet_address: likePostDto.wallet_address.toLowerCase(),
      },
    });

    if (!existingLike) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.remove(existingLike);
  }

  async commentOnPost(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentsRepository.create({
      post_id: postId,
      wallet_address: createCommentDto.wallet_address.toLowerCase(),
      content: createCommentDto.content,
    });

    return this.commentsRepository.save(comment);
  }

  async findOneComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async deleteComment(postId: number, commentId: number): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = await this.findOneComment(commentId);
    if (comment.post_id !== postId) {
      throw new NotFoundException('Comment not found in this post');
    }

    await this.commentsRepository.delete(commentId);
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Delete associated likes and comments first
    await this.likesRepository.delete({ post_id: postId });
    await this.commentsRepository.delete({ post_id: postId });

    // Then delete the post
    await this.postsRepository.delete(postId);
  }
}
