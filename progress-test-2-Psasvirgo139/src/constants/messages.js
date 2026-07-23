/**
 * Danh sách message toàn hệ thống theo đề thi.
 * Sử dụng hàm helper để tạo message động với tham số.
 */

export const MESSAGES = {
  /** MS01: <X> is required. */
  MS01: (fieldName) => `${fieldName} is required.`,

  /** MS02: <X> must be greater than or equal <Y> and less than or equal <Z> */
  MS02: (fieldName, min, max) =>
    `${fieldName} must be greater than or equal ${min} and less than or equal ${max}`,

  /** MS03: The input value is invalid format date. */
  MS03: 'The input value is invalid format date.',

  /** MS04: Created new restaurant successfully */
  MS04: 'Created new restaurant successfully',

  /** MS05: Internal system error, please contact with administrator */
  MS05: 'Internal system error, please contact with administrator',

  /** MS06: The input date must be in future */
  MS06: 'The input date must not be in future',

  /** MS07: The input date must be before <Y> */
  MS07: (limitDate) => `The input date must be before ${limitDate}`,

  /** MS08: Deleted successfully */
  MS08: 'Deleted successfully',
}
