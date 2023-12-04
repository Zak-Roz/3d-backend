import { Provides } from 'src/common/resources/common/provides';
import { Workout } from './models';
import { File } from 'src/files/models';

export const modelProviders = [
  {
    provide: Provides.workout,
    useValue: Workout,
  },
  {
    provide: Provides.file,
    useValue: File,
  },
];
