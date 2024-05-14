import { Injectable, NotFoundException, } from '@nestjs/common';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/public.post.entity';
import { Repository } from 'typeorm';
import { format } from 'date-fns-tz';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { Pagination } from 'nestjs-typeorm-paginate';
import { paginate } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';


@Injectable()
export class PublicPostsService {
  
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ){}

  
async create(createPublicPostDto: CreatePublicPostDto) {
  if (!createPublicPostDto.title) {
      throw new HttpException({ error: 'Title is required' }, HttpStatus.BAD_REQUEST);
  } else if (!createPublicPostDto.content) {
      throw new HttpException({ error: 'Content is required' }, HttpStatus.BAD_REQUEST);
  }

  try {
      const post = await this.postRepository.create(createPublicPostDto);
      await this.postRepository.save(post);

      const { id, title, content, published, created_at } = post;
      const formattedCreatedAt = format(created_at, 'yyyy-MM-dd\' T \'HH:mm:ss', { timeZone: 'Asia/Bangkok' });

      return {
          id,
          title,
          content,
          published,
          created_at: formattedCreatedAt,
      };
  } catch (error) {
    throw new HttpException({ error: "error message" }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      select: ['id', 'title', 'content', 'published', 'created_at', 'view_count'],
    });
  

    if(!post){
      throw new NotFoundException('Post not found')
    }
    if (post && post.created_at) {
      const formattedCreatedAt = format(post.created_at, "yyyy-MM-dd' T 'HH:mm:ss", { timeZone: 'Asia/Bangkok' });
      console.log(formattedCreatedAt);
      if (post && post.published) {
        
        post.view_count = (post.view_count || 0) + 1;
        console.log("View Count ", post.view_count)
          await this.postRepository.save(post); 
      }
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: formattedCreatedAt
    };
    }

  
    return post;
  }

  

async update(id: string, updatePublicPostDto: UpdatePublicPostDto) {
  let post = await this.postRepository.findOne({ where: { id } });

  if (!post) {
      return null;
  }

  if (updatePublicPostDto.hasOwnProperty('published')) {
      post.published = updatePublicPostDto.published;
  }

  Object.assign(post, updatePublicPostDto);

  const currentTime = new Date();
  post.updated_at = currentTime;

  if (post.created_at) {
      const formattedCreatedAt = format(post.created_at, "yyyy-MM-dd 'T' HH:mm:ss", { timeZone: 'Asia/Bangkok' });
      const formattedUpdatedAt = format(currentTime, "yyyy-MM-dd 'T' HH:mm:ss", { timeZone: 'Asia/Bangkok' });
      if(post.view_count > 0){
        console.log("Before count ",post.view_count-1)
        console.log("After count ",post.view_count-1)
        await this.postRepository.save(post);
        console.log(`Updated at: ${formattedUpdatedAt}`);
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: formattedCreatedAt
        };
      }else{
        console.log("Before count ",post.view_count)
        console.log("After count ",post.view_count)
        await this.postRepository.save(post);
        console.log(`Updated at: ${formattedUpdatedAt}`);
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          created_at: formattedCreatedAt
        };
      }
  }

  await this.postRepository.save(post);

  return {
      id: post.id,
      title: post.title,
      content: post.content,
      created_at: post.created_at
  };
}

  async remove(id: string) {
    const toDelete = await this.postRepository.delete(id);
    return toDelete;
  }
}
