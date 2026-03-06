## 📌 Description
Refactored the `deposit` function to prevent variable shadowing which could lead to unexpected behavior during the calculation of total balance. 

## 🔗 Related Issue
Closes #3

## 🛠 Changes Made
- Renamed the local `deposit` variable to `depositAmount` inside the `deposit()` function in `project.js`. This ensures the function name and variable name no longer conflict, resolving total balance increment logic definitively.

## 📷 Screenshots (if UI change)
N/A

## ✅ Checklist
- [x] I have tested my changes
- [x] My code follows project guidelines
- [x] I have linked the related issue
