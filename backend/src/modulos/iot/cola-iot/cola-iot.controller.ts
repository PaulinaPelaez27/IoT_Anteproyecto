import { Controller } from '@nestjs/common';
import { ColaIotService } from './cola-iot.service';

@Controller('cola-iot')
export class ColaIotController {
  constructor(private readonly colaIotService: ColaIotService) {}
}
