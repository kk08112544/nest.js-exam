import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicPostsModule } from './public.posts/public.posts.module';
import { Post } from './public.posts/entities/public.post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://posts:38S2GPNZut4Tmvan@dev.opensource-technology.com:5523/posts?sslmode=disable',
      entities: [Post],
      autoLoadEntities: true,
      synchronize: true, 
    }),
    PublicPostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
