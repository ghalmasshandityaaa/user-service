import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { response, responseError, responsePage } from '../helpers/response.helper';
import { createPaginationOptions, PaginationOptions } from '../helpers/pagination.helper';
import { UserValidator } from '../validators/user.validator';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async users(@Req() req, @Query('keyword') keyword: string) {
    try {
      const pagination: PaginationOptions = createPaginationOptions(req);
      const { result, total } = await this.userService.users(
        pagination,
        keyword,
      );

      return responsePage(result, total, pagination);
    } catch (e) {
      return responseError(e.message);
    }
  }

  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.userService.getUser(id);

      return response('Success', result);
    } catch (e) {
      return responseError(e.message);
    }
  }

  @Post()
  async createUser(@Body() params: UserValidator) {
    try {
      const result = await this.userService.createUser(params);

      return response('Success', result);
    } catch (e) {
      return responseError(e.message);
    }
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() params: UserValidator) {
    try {
      if (!id || id === undefined) throw Error('user id is required');

      const result = await this.userService.updateUser(id, params);
      return response('Success', result);
    } catch (e) {
      return responseError(e.message);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    try {
      if (!id || id === undefined) throw Error('user id is required');

      const result = await this.userService.deleteUser(id);
      return response('Success', result);
    } catch (e) {
      return responseError(e.message);
    }
  }
}
