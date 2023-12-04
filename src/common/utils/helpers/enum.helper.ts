export class EnumHelper {
  static enumToDescription(
    enumObject: any,
    label = 'Supported values',
  ): string {
    let description = `${label}: `;
    for (const enumMember in enumObject) {
      const isValue = Number(enumMember) >= 0;
      if (!isValue) {
        break;
      }
      description = `${description}<br/>&emsp;${enumObject[enumMember]} - ${enumMember}`;
    }
    return description;
  }

  static objToDescription(enumObject: any, label = 'Supported values'): string {
    const row = (key: string, value: number | string) =>
      `<br/>&emsp;${key} - ${value}`;

    return `${label}: ${Object.keys(enumObject)
      .map((key) => row(key, enumObject[key]))
      .join()}`;
  }
}
