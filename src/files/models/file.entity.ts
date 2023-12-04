import { FileStatuses } from 'src/common/resources/files';
import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';
import { baseScopes } from 'src/common/base/base.scopes';

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
  byType: (type: number | number[]) => ({ where: { type } }),
}))
@Table({
  tableName: 'files',
  timestamps: true,
  underscored: false,
})
export class File extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileKey: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    defaultValue: FileStatuses.pending,
  })
  status: FileStatuses;
}
