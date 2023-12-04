import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { File } from 'src/files/models';
import { baseScopes } from 'src/common/base/base.scopes';
import { Op } from 'sequelize';

@Scopes(() => ({
  ...baseScopes,
  orderBy: (
    order = 'desc',
    field = 'id',
    additionalOrder = false,
    anotherOrder = 'id',
  ) => ({
    order:
      field !== 'id' && additionalOrder
        ? [
            [field, order],
            [anotherOrder, order],
          ]
        : [[field, order]],
  }),
  byMuscleGroup: (muscleGroup: string) => ({
    where: { muscleGroup: { [Op.like]: `%${muscleGroup}%` } },
  }),
  byMuscleGroups: (muscleGroup: string | string[]) => ({
    where: { muscleGroup },
  }),
  byDescriptions: (descriptions: string) => ({
    where: { descriptions: { [Op.like]: `%${descriptions}%` } },
  }),
  byName: (name: string) => ({ where: { name: { [Op.like]: `%${name}%` } } }),
  byLevel: (level: string) => ({
    where: { level: { [Op.like]: `%${level}%` } },
  }),
  byLevels: (level: string | string[]) => ({ where: { level } }),
  withFile: () => ({
    include: [
      {
        model: File,
        as: 'file',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'workouts',
  timestamps: true,
  underscored: false,
})
export class Workout extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descriptions: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  muscleGroup: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: true,
  })
  fileId: number;

  @BelongsTo(() => File, 'fileId')
  file: File;
}
