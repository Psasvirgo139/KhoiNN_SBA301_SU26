import { MESSAGES } from '../constants/messages'

/**
 * Validate tên restaurant.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null} message lỗi hoặc null nếu hợp lệ
 */
export function validateName(value) {
  // TODO: Kiểm tra rỗng → trả về MESSAGES.MS01('Restaurant Name')
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01('Restaurant Name')
  }
  // TODO: Kiểm tra độ dài > 100 → trả về message phù hợp
  if (value.length > 100) {
    return 'Restaurant Name must not exceed 100 characters.'
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate giá (priceFrom hoặc priceTo).
 * - Bắt buộc (MS01)
 * - Phải là số nguyên
 * - 1000 <= value <= 999999 (MS02)
 *
 * @param {string|number} value
 * @param {string} fieldName  tên field để hiển thị trong message
 * @returns {string|null}
 */
export function validatePrice(value, fieldName) {
  // TODO: Kiểm tra rỗng → trả về MESSAGES.MS01(fieldName)
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01(fieldName)
  }
  // TODO: Kiểm tra không phải số nguyên
  const strVal = String(value).trim()
  if (!/^\d+$/.test(strVal)) {
    return `${fieldName} must be an integer.`
  }
  // TODO: Kiểm tra ngoài khoảng [1000, 999999] → trả về MESSAGES.MS02(fieldName, 1000, 999999)
  const numVal = Number(strVal)
  if (numVal < 1000 || numVal > 999999) {
    return MESSAGES.MS02(fieldName, 1000, 999999)
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate priceTo phải lớn hơn priceFrom.
 *
 * @param {number} priceFrom
 * @param {number} priceTo
 * @returns {string|null}
 */
export function validatePriceRange(priceFrom, priceTo) {
  // TODO: Nếu priceTo <= priceFrom → trả về message "Price to must be greater than Price from"
  if (Number(priceTo) <= Number(priceFrom)) {
    return 'Price to must be greater than Price from'
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate Open Date.
 * - Bắt buộc (MS01)
 * - Định dạng yyyy-MM-dd (MS03)
 * - Không được là ngày tương lai (MS06)
 *
 * @param {string} value  chuỗi ngày dạng "yyyy-MM-dd"
 * @returns {string|null}
 */
export function validateOpenDate(value) {
  // TODO: Kiểm tra rỗng → trả về MESSAGES.MS01('Open Date')
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01('Open Date')
  }
  // TODO: Kiểm tra định dạng bằng regex /^\d{4}-\d{2}-\d{2}$/ → MESSAGES.MS03
  const strVal = String(value).trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(strVal)) {
    return MESSAGES.MS03
  }
  // TODO: Parse thành Date, kiểm tra isNaN → MESSAGES.MS03
  const parts = strVal.split('-')
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)
  const date = new Date(year, month, day)
  if (isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
    return MESSAGES.MS03
  }
  // TODO: Kiểm tra ngày > hôm nay → MESSAGES.MS06
  const todayStr = new Date().toISOString().split('T')[0]
  if (strVal > todayStr) {
    return MESSAGES.MS06
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate Owner name.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateOwner(value) {
  // TODO: Kiểm tra rỗng → trả về MESSAGES.MS01('Owner name')
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01('Owner name')
  }
  // TODO: Kiểm tra độ dài > 100
  if (value.length > 100) {
    return 'Owner name must not exceed 100 characters.'
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate Address.
 * - Bắt buộc (MS01)
 * - Độ dài tối đa 100 ký tự
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateAddress(value) {
  // TODO: Kiểm tra rỗng → trả về MESSAGES.MS01('Address')
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01('Address')
  }
  // TODO: Kiểm tra độ dài > 100
  if (value.length > 100) {
    return 'Address must not exceed 100 characters.'
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate Category.
 * - Bắt buộc (MS01)
 *
 * @param {string} value
 * @returns {string|null}
 */
export function validateCategory(value) {
  // TODO: Kiểm tra rỗng hoặc chưa chọn ("") → trả về MESSAGES.MS01('Category')
  if (value === undefined || value === null || String(value).trim() === '') {
    return MESSAGES.MS01('Category')
  }
  // TODO: Hợp lệ → trả về null
  return null
}

/**
 * Validate toàn bộ form AddNew.
 * Trả về object errors { name, priceFrom, priceTo, priceRange, owner, openDate, address, category }
 * Mỗi trường là null (hợp lệ) hoặc string message lỗi.
 *
 * @param {object} formData
 * @returns {object} errors
 */
export function validateRestaurantForm(formData) {
  // TODO: Gọi từng hàm validate bên trên
  // TODO: Trả về object errors
  const errors = {}
  errors.name = validateName(formData.name)
  errors.priceFrom = validatePrice(formData.priceFrom, 'Price from')
  errors.priceTo = validatePrice(formData.priceTo, 'Price to')
  errors.priceRange = (errors.priceFrom || errors.priceTo)
    ? null
    : validatePriceRange(Number(formData.priceFrom), Number(formData.priceTo))
  errors.owner = validateOwner(formData.owner)
  errors.openDate = validateOpenDate(formData.openDate)
  errors.address = validateAddress(formData.address)
  errors.category = validateCategory(formData.category)
  return errors
}

/**
 * Validate Category ID.
 * - Bắt buộc (MS01)
 * - Phải là duy nhất (không được trùng)
 *
 * @param {string} id
 * @param {Array} existingCategories
 * @returns {string|null}
 */
export function validateCategoryId(id, existingCategories = []) {
  if (id === undefined || id === null || String(id).trim() === '') {
    return MESSAGES.MS01('ID')
  }
  const cleanId = String(id).trim().toLowerCase()
  const isDuplicate = existingCategories.some(
    (c) => String(c.id).trim().toLowerCase() === cleanId
  )
  if (isDuplicate) {
    return 'ID already exists.'
  }
  return null
}

/**
 * Validate Category Name.
 * - Bắt buộc (MS01)
 * - Phải là duy nhất (không được trùng)
 * - Ít nhất 6 ký tự
 *
 * @param {string} name
 * @param {Array} existingCategories
 * @returns {string|null}
 */
export function validateCategoryName(name, existingCategories = []) {
  if (name === undefined || name === null || String(name).trim() === '') {
    return MESSAGES.MS01('Category Name')
  }
  const cleanName = String(name).trim()
  if (cleanName.length < 6) {
    return 'Category Name must be at least 6 characters.'
  }
  const cleanNameLower = cleanName.toLowerCase()
  const isDuplicate = existingCategories.some(
    (c) => String(c.name).trim().toLowerCase() === cleanNameLower
  )
  if (isDuplicate) {
    return 'Category Name already exists.'
  }
  return null
}

/**
 * Validate toàn bộ form AddCategory.
 * Trả về object errors { id, name }
 *
 * @param {object} formData  { id, name }
 * @param {Array} existingCategories
 * @returns {object} errors
 */
export function validateCategoryForm(formData, existingCategories = []) {
  const errors = {}
  errors.id = validateCategoryId(formData.id, existingCategories)
  errors.name = validateCategoryName(formData.name, existingCategories)
  return errors
}

