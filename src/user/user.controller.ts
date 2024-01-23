import { Controller, Delete, Get, Param } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  //   @Post()
  //   create(@Body() createUserDto: CreateUserDto): Promise<any> {
  //     // return 1;
  //     return this.UserService.create(createUserDto);
  //   }

  @Get()
  findAll(): Promise<User[]> {
    return this.UserService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<User> {
    return this.UserService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.UserService.remove(id);
  }
}
