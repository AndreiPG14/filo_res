import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('roles')
export class RolesController {
  constructor(private svc: RolesService) {}
  @Get() findAll() { return this.svc.findAll(); }
  @Post() create(@Body() body: { name: string }) { return this.svc.create(body.name); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: { name: string }) { return this.svc.update(+id, body.name); }
  @Delete(':id') remove(@Param('id') id: string) { return this.svc.remove(+id); }
}
