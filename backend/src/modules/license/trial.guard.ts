import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { LicenseService } from './license.service';

/**
 * Guard désactivé - Licence illimitée et permanente pour SIHATI.
 */
@Injectable()
export class TrialGuard implements CanActivate {
  constructor(private readonly licenseService: LicenseService) {}

  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
