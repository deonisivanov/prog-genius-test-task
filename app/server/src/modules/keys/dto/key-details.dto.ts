import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class KeypressStatDetails {
  @IsString()
  key!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  count!: number;

  @IsOptional()
  @IsString()
  prevKey!: string | null;

  @IsOptional()
  @IsString()
  nextKey!: string | null;
}
