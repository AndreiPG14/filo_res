import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { SalesService } from './sales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private svc: SalesService) {}
  @Get() findAll(@Query('from') from: string, @Query('to') to: string) { return this.svc.findAll(from, to); }
  @Post() create(@Body() body: any, @Request() req: any) { return this.svc.create(body, req.user.id); }
}
