import { IsString, IsNotEmpty, IsOptional, IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserRole } from '../../../entities/user.entity';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.PATIENT;

  // Patient optional fields
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  chronicDiseases?: string;

  // Doctor optional fields
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  specialty?: string;

  @IsString()
  @IsOptional()
  wilaya?: string;

  @IsString()
  @IsOptional()
  commune?: string;

  @IsString()
  @IsOptional()
  clinicAddress?: string;

  // Pharmacy optional fields
  @IsString()
  @IsOptional()
  pharmacyName?: string;

  @IsString()
  @IsOptional()
  pharmacyLicense?: string;

  @IsString()
  @IsOptional()
  pharmacyAddress?: string;

  @IsOptional()
  isNightGuard?: boolean;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  phoneOrEmail: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
