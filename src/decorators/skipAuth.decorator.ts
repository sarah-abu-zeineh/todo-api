import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constant';

export const skipAuth = (...args: string[]) => SetMetadata(IS_PUBLIC_KEY, args);