import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';

@Module({
  exports: [PrinterService],
  providers: [PrinterService],
})
export class PrinterModule {}
