import { IsString, Length } from 'class-validator';

export class KeypressDto {
  @IsString()
  @Length(1, 1)
  key!: string;
}
