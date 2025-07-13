(define-constant total-supply u1000000)

(define-map balances principal uint)

(define-data-var owner principal tx-sender)

(define-public (mint (recipient principal) (amount uint))
  (begin
    ;; sadece deployer (owner) mint edebilir
    (asserts! (is-eq tx-sender (var-get owner)) (err u100))
    (let (
      (current-balance (default-to u0 (map-get? balances recipient)))
      (new-balance (+ current-balance amount))
    )
      (map-set balances recipient new-balance)
      (ok true)
    )
  )
)

(define-public (transfer (recipient principal) (amount uint))
  (let (
    (sender tx-sender)
    (sender-balance (default-to u0 (map-get? balances sender)))
    (recipient-balance (default-to u0 (map-get? balances recipient)))
  )
    (begin
      (asserts! (>= sender-balance amount) (err u101))
      (map-set balances sender (- sender-balance amount))
      (map-set balances recipient (+ recipient-balance amount))
      (ok true)
    )
  )
)

(define-read-only (get-balance (who principal))
  (ok (default-to u0 (map-get? balances who)))
)

(define-read-only (get-total-supply)
  (ok total-supply)
)
