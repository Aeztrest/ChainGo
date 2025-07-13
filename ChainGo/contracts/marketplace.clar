(define-map products uint
  {
    name: (string-ascii 100),
    price: uint,
    seller: principal,
    buyer: (optional principal)
  }
)

(define-data-var last-product-id uint u0)

(define-constant token-contract .token) ;; .token = contracts/token.clar

;; urun ekleme
(define-public (add-product (name (string-ascii 100)) (price uint))
  (let (
    (product-id (+ (var-get last-product-id) u1))
  )
    (begin
      (var-set last-product-id product-id)
      (map-set products product-id {
        name: name,
        price: price,
        seller: tx-sender,
        buyer: none
      })
      (ok product-id)
    )
  )
)

;; urun satin alma
(define-public (buy-product (product-id uint))
  (let (
    (product (map-get? products product-id))
  )
    (match product product-data
      (begin
        (asserts! (is-none (get buyer product-data)) (err u101))
        (try! (contract-call? .token transfer (get seller product-data) (get price product-data)))
        (map-set products product-id {
          name: (get name product-data),
          price: (get price product-data),
          seller: (get seller product-data),
          buyer: (some tx-sender)
        })
        (ok true)
      )
      (err u100)
    )
  )
)

;; Urun goruntuleme
(define-read-only (get-product (product-id uint))
  (match (map-get? products product-id) product
    (ok product)
    (err u404)
  )
)
