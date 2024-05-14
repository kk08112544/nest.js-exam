import { Like } from 'typeorm';
import { Injectable, NotFoundException, } from '@nestjs/common';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { DeletePublicPostDto } from './dto/delete-public.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/public.post.entity';
import { Repository } from 'typeorm';
import { format } from 'date-fns-tz';
import { HttpException, HttpStatus } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PaginatedPostsDto } from './dto/paginated-public.post.dto';



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
    throw new HttpException({ error: 'error message' }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


// async getPublishedPosts(published: boolean, page: number, limit: number, title: string): Promise<any> {
//   console.log('Published:', published);
//   console.log('Page:', page);
//   console.log('Limit:', limit);
//   console.log('Title:', title);

//   // Calculate skip based on page and limit
//   const skip = (page - 1) * limit;

//   // Build the where clause conditionally
//   const where: any = { published };
//   if (title && title.trim() !== "") {
//       where.title = Like(`%${title}%`);
//   }

//   try {
//     // Find posts and count total
//     const [posts, totalCount] = await this.postRepository.findAndCount({
//         where,
//         take: limit,
//         skip,
//     });

//     // Calculate total pages
//     const totalPages = Math.ceil(totalCount / limit);

//     return {
//         posts,
//         count: totalCount,
//         limit,
//         page,
//         total_page: totalPages,
//     };
//   } catch (error) {
//     console.error("Error fetching published posts:", error);
//     throw new Error("Could not fetch published posts");
//   }
// }

// async getPublishedPosts(published: boolean, page: number, limit: number, title: string): Promise<any> {
//   // Check if published, page, limit, and title are defined
//   if (published !== undefined && !isNaN(page) && !isNaN(limit) && title !== undefined) {
//     console.log('Published:', published);
//     console.log('Page:', page);
//     console.log('Limit:', limit);
//     console.log('Title:', title);

//     // Calculate skip based on page and limit
//     const skip = (page - 1) * limit;

//     // Build the where clause conditionally
//     const where: any = { published };
//     if (title.trim() !== "") {
//       where.title = Like(`%${title}%`);
//     }

//     try {
//       // Find posts and count total
//       const [posts, totalCount] = await this.postRepository.findAndCount({
//         where,
//         take: limit,
//         skip,
//       });

//       // Calculate total pages
//       const totalPages = Math.ceil(totalCount / limit);

//       return {
//         posts,
//         count: totalCount,
//         limit,
//         page,
//         total_page: totalPages,
//       };
//     } catch (error) {
//       console.error("Error fetching published posts:", error);
//       throw new Error("Could not fetch published posts");
//     }
//   } else {
//     // Handle missing parameters
//     throw new Error("Missing or invalid parameters");
//   }
// }

// async getPublishedPosts(published: boolean, page: number, limit: number, title: string): Promise<any> {
//   // Check if published is defined and other parameters are undefined
//   if (published !== undefined && (page === undefined || isNaN(page)) && (limit === undefined || isNaN(limit)) && title === undefined) {
//     console.log('Published:', published);

//     try {
//       // Find posts
//       const posts = await this.postRepository.find({
//         where: { published },
//       });

//       return {
//         posts,
//         count: posts.length,
//         limit: null,
//         page: null,
//         total_page: 1,
//       };
//     } catch (error) {
//       console.error("Error fetching published posts:", error);
//       throw new Error("Could not fetch published posts");
//     }
//   } else {
//     // Handle missing parameters
//     throw new Error("Missing or invalid parameters");
//   }
// }
async getPublishedPosts(published: boolean, page: number, limit: number, title: string): Promise<any> {
  // Set default values for page and limit if they are undefined or not numbers
  let pageNumber = isNaN(page) ? 0 : page;
  let limitNumber = isNaN(limit) ? 0 : limit;

  console.log('Published:', published);
  console.log('Page:', pageNumber);
  console.log('Limit:', limitNumber);
  console.log('Title:', title);

  // Calculate skip based on page and limit
  const skip = (pageNumber - 1) * limitNumber;

  // Build the where clause conditionally
  const where: any = { published };
  if (title && title.trim() !== "") {
    where.title = Like(`%${title}%`);
  }

  try {
    // Find posts and count total
    const [posts, totalCount] = await this.postRepository.findAndCount({
      where,
      take: limitNumber,
      skip: skip > 0 ? skip : 0,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / (limitNumber > 0 ? limitNumber : totalCount));

    return {
      posts,
      count: totalCount,
      limit: limitNumber,
      page: pageNumber,
      total_page: totalPages,
    };
  } catch (error) {
    console.error("Error fetching published posts:", error);
    throw new Error("Could not fetch published posts");
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
        published: post.published,
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
  console.log(post.published);
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

  async remove(deletePublicPostDto: DeletePublicPostDto) {
    const toDelete = await this.postRepository.delete(deletePublicPostDto);
    return toDelete;
  }
}