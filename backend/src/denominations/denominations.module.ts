import { Module } from '@nestjs/common';
import { DenominationsService } from './denominations.service';
import { DenominationsController } from './denominations.controller';

@Module({
  providers: [DenominationsService],
  controllers: [DenominationsController],
})
export class DenominationsModule {}
