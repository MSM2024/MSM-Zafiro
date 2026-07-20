import type { Book } from "@/lib/biblioteca/types"
import { getProducts, addProduct, updateProduct, type Product } from "@/lib/marketplace"

/**
 * Maps a biblioteca Book to a marketplace Product.
 * Creates the product if it doesn't exist, updates if it does.
 * Returns the product ID.
 */
export function syncBookToMarketplace(book: Book): string | undefined {
  if (book.status !== "PUBLICADO" && book.status !== "APROBADO") return undefined

  const products = getProducts()
  const existing = products.find(p =>
    p.tags.includes(`book:${book.id}`) || p.name === book.title
  )

  const productData: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
    name: book.title,
    description: `${book.description.slice(0, 200)} — ${book.authorName}`,
    price: 36.90,
    currency: "USD",
    category: "digital",
    tags: [...book.tags, "libro", "ebook", `book:${book.id}`],
    stock: 999,
    status: "active",
    featured: false,
  }

  if (existing) {
    updateProduct(existing.id, productData)
    return existing.id
  }

  const newProduct = addProduct(productData)
  return newProduct.id
}

/**
 * Removes a book's marketplace listing.
 */
export function unsyncBookFromMarketplace(bookId: string): void {
  const products = getProducts()
  const match = products.find(p => p.tags.includes(`book:${bookId}`))
  if (match) {
    updateProduct(match.id, { status: "inactive" })
  }
}

/**
 * Gets the marketplace product for a book, if it exists.
 */
export function getBookMarketplaceProduct(bookId: string): Product | undefined {
  return getProducts().find(p => p.tags.includes(`book:${bookId}`) && p.status === "active")
}
