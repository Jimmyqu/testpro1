import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { user, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.userWhereUniqueInput,
  ): Promise<user | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.userWhereUniqueInput;
    where?: Prisma.userWhereInput;
    orderBy?: Prisma.userOrderByWithRelationInput;
  }): Promise<user[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip: +skip,
      take: +take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.userCreateInput): Promise<user | any> {
    const firstNameRow = await this.prisma.user.findFirst({
      where: { name: data.name },
    });
    const firstRow = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (firstNameRow || firstRow) {
      return { msg: '邮箱或者名字已经被注册' };
    }
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async queryByUserEmail(email: string): Promise<user | any> {
    const firstRow = await this.prisma.user.findUnique({
      where: { email: email },
    });
    return firstRow;
  }

  async updateUser(params: {
    where: Prisma.userWhereUniqueInput;
    data: Prisma.userUpdateInput;
  }): Promise<user> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.userWhereUniqueInput): Promise<user> {
    return this.prisma.user.delete({
      where,
    });
  }
}
