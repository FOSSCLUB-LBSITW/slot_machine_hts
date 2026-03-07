## 📌 Description
Added input validation to reject decimal formats for Lines and Bet per line, which previously caused invalid configurations.

## 🔗 Related Issue
Closes #2

## 🛠 Changes Made
- Added a check in `play()` using `.includes('.')` on the input `.value` strings.
- Displays an alert to notify users that only integer inputs are allowed.

## 📷 Screenshots (if UI change)
N/A

## ✅ Checklist
- [x] I have tested my changes
- [x] My code follows project guidelines
- [x] I have linked the related issue
