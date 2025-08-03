import { IsString, Length } from 'class-validator';

export class KeySentDto {
  @IsString()
  @Length(1, 1)
  key!: string;
}
