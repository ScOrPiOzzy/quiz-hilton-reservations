/**
 * 餐桌类型枚举
 * 用于预约系统中指定餐桌位置偏好
 */
export enum TableType {
  NONE = '',
  HALL = '大厅',
  PRIVATE_ROOM = '包厢',
}

/**
 * 餐桌类型选项配置
 * 用于前端下拉选择组件
 */
export const tableTypeOptions: Array<{
  value: TableType;
  label: string;
}> = [
  { value: TableType.NONE, label: '不限' },
  { value: TableType.HALL, label: '大厅' },
  { value: TableType.PRIVATE_ROOM, label: '包厢' },
];

/**
 * 获取餐桌类型显示名称
 */
export function getTableTypeLabel(type: TableType): string {
  switch (type) {
    case TableType.NONE:
      return '不限';
    case TableType.HALL:
      return '大厅';
    case TableType.PRIVATE_ROOM:
      return '包厢';
    default:
      return type;
  }
}
