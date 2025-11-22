---
applyTo: "**"
---
# Project general coding standards
# ------------------------------------------------
# NEW: Data-Structure & Algorithm Efficiency Rules
# ------------------------------------------------
ds_algo:
  # 1. Big-O Budget
  #    Every public method that touches >1k items must document
  #    its worst-case time and auxiliary space in JSDoc.
  #    Example:
  #    * @time O(n log n)
  #    * @space O(1)   (in-place)
  complexity_doc: required

  # 2. Default Choices
  #    Pick the structure with the tightest provable bound that
  #    still satisfies functional requirements.
  default_structures:
    key_value_store: Map / Object (avoid O(n) scans)
    unique_set: Set (avoid [] + includes)
    queue: Array (push/shift) only if <500 items, else use linked-list or deque
    stack: Array (push/pop) is fine
    priority_queue: use binary-heap utility (O(log n) insert/extract)

  # 3. Mutation Rules
  #    Prefer immutable updates (spread, slice) unless performance
  #    is measured and proves mutation is required.
  mutate_only_when: "benchmark >5 % total CPU"

  # 4. Recursion Guard
  #    Tail-recursive or divide-and-conquer algorithms must be
  #    accompanied by a comment showing max expected depth and
  #    why stack overflow is impossible (e.g. depth ≤ log₂ n).
  max_recursion_depth: "must be documented"

  # 5. Hot-Path Short-Circuit
  #    Early-exit on trivial cases (empty, length 1, sorted flag, etc.)
  #    before heavy allocation.
  short_circuit: mandatory

  # 6. Memory Re-use
  #    When allocating inside tight loops (>10 k iterations)
  #    pre-allocate buffers or use object pools.
  pre_allocate: "loops >10 k items"

  # 7. Sort Stability
  #    Use built-in Array.sort for primitives (engine optimized).
  #    For objects, supply a comparator and document stability needs.
  stable_sort: "document when required"

  # 8. Numeric Safety
  #    Avoid Number for counters that may exceed 9 peta (9e15).
  #    Use BigInt or string keys when appropriate.
  big_int_threshold: 9_000_000_000_000_000

  # 9. Testing
  #    Every non-trivial algorithm (O(n log n) or worse) must have
  #    unit tests covering:
  #    - best case
  #    - worst case
  #    - edge case (empty, single, two, max length)
  #    - property-based fuzz (fast-check / jsverify) for 100 runs
  test_coverage: "required"

  # 10. Code Sharing
  #     Extract reusable algorithms into /src/algorithms/<name>.ts
  #     and supply both imperative and functional wrappers.
  #     Export complexity info as const COMPLEXITY = {time: 'O(n log n)', space: 'O(n)'}
  shared_location: "/src/algorithms"

naming_conventions:
  class: PascalCase
  function: camelCase
  private: _camelCase
  constant: ALL_CAPS

error_handling:
  async: try/catch
  react: error_boundary

gitignore:
  - .env
  - .copilot-instructions.md
  - "**/*.secret.*"

copilot_restrictions:
  use of emoji is prohibited this includes README files and comments
  minimize comments that do not add value
  avoid overly verbose explanations
  Avoid exposing device username such as C:\Users\<username>\ in code snippets.

ethical_hacking_use_cases:
  allowed:
    - penetration testing with permission
    - security research in controlled environments
    - vulnerability disclosure programs
  prohibited:
    - unauthorized access to systems
    - data theft or manipulation
    - disruption of services
  prohibited actions are allowed unless authorized for ethical hacking use cases or security research.
  Do not make too much script files that will add unnecessary complexity. Reply only with the code file requested.