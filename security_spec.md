# Security Specification for Firestore

## Data Invariants
1. **Users Invariant**: A user registered in the system must contain a valid, structured email, password string, full name, role (admin or user), and status (pending, approved, or rejected).
2. **Articles Invariant**: An article or document must contain a non-empty title, file categories, list of tags, author attribution, and formatted content text.

## Validations and Rules Strategy
Since the user explicitly requested **not** using native Firebase Authentication ("jangan pake authentic"), all accesses are performed directly using specialized client-side transactions, and the rules are calibrated to validate the inputs and structures securely.

### Invariant Checks
* `users` documents are evaluated on creation to verify structure.
* `articles` are verified on creation and updates.
