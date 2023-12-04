import { Provides } from 'src/common/resources/common/provides';
import { File } from './models/file.entity';
import { Workout } from 'src/workouts/models';

export const modelProviders = [
  {
    provide: Provides.file,
    useValue: File,
  },
  {
    provide: Provides.workout,
    useValue: Workout,
  },
];
