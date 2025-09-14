import { PartialType } from '@nestjs/swagger';
import { CreateSeanceDto } from './create-seance.dto';

export class UpdateSeanceDto extends PartialType(CreateSeanceDto) {}
