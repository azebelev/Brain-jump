import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChallengeGroupDto {

    @IsOptional()
    @IsNumber()
    parentId?:number;

    @IsString()
    @MaxLength(200)
    title:string;

    @IsOptional()
    @IsString()
    description?:string;
}
