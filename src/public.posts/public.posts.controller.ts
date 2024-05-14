
import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { PublicPostsService } from './public.posts.service';
import { CreatePublicPostDto } from './dto/create-public.post.dto';
import { UpdatePublicPostDto } from './dto/update-public.post.dto';
import { DeletePublicPostDto } from './dto/delete-public.post.dto';
import { PaginatedPostsDto } from './dto/paginated-public.post.dto';
import { FindCategoryDto } from './dto/find-category-public.post.dto';
import { Post as PostEntity } from './entities/public.post.entity';


@Controller('public.posts')
export class PublicPostsController {
  constructor(private readonly publicPostsService: PublicPostsService) {}

  @Post('/createPost')
  create(@Body() createPublicPostDto: CreatePublicPostDto) {
    return this.publicPostsService.create(createPublicPostDto);
  }
  
  @Post('/deletedata')
  remove(@Body() deletePublicPostDto: DeletePublicPostDto) {
    return this.publicPostsService.remove(deletePublicPostDto);
  }

  @Post('/searchCategory')
  getPublishedPosts(
    @Body() paginatedPostDto: PaginatedPostsDto,
  ) {
    const { published, page, limit, title } = paginatedPostDto;

    // const pageNumber = parseInt(page, 10);
    return this.publicPostsService.getPublishedPosts(published, page, limit, title);
  }

  
  


  @Post('/getdata/:id')
  findOne(@Param('id') id: string) {
    return this.publicPostsService.findOne(id);
  }


  @Post('/updateData/:id')
  update(@Param('id') id: string, @Body() updatePublicPostDto: UpdatePublicPostDto) {
    return this.publicPostsService.update(id, updatePublicPostDto);
  }
}