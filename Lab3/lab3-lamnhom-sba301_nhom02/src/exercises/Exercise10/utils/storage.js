import { initialBooks } from '../../../data/books';

const KEY = 'sba301-books';

export function getBooksFromStorage() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(initialBooks));
      return [...initialBooks];
    }
    return JSON.parse(raw);
  } catch {
    return [...initialBooks];
  }
}

export function saveBooksToStorage(books) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

export function getNextId(books) {
  if (books.length === 0) return 1;
  return Math.max(...books.map((b) => b.id)) + 1;
}

export function resetBooksStorage() {
  localStorage.setItem(KEY, JSON.stringify(initialBooks));
}
