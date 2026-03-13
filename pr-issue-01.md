## 📌 Description
Separated the balance validation to display an intuitive "Insufficient Balance" alert rather than grouping it generically under "Invalid bet or lines".

## 🔗 Related Issue
Closes #1

## 🛠 Changes Made
- Separated `bet * lines > balance` check from valid bet/lines input checks in `play()` method inside `project.js`.
- Added `alert("Insufficient Balance")` when running out of funds for the spin.

## 📷 Screenshots (if UI change)
N/A

## ✅ Checklist
- [x] I have tested my changes
- [x] My code follows project guidelines
- [x] I have linked the related issue
