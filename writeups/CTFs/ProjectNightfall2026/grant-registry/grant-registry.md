# Grant Registry

Platform: CTFs
Event: ctfs-projectnightfall2026
Difficulty: Easy
OS: Multi-platform
Category: Blockchain
Tags: Blockchain, Hack The Box
Date: 2026-10-01
Added: 2026-10-01
Coverage: Writeup

The [Anchor program](https://github.com/m3m0rydmp/temp-repo-htb-ctf/blob/0af79f9d3c67f035233dfb2ca0a4a2a9c97c47d9/blockchain/grant_registry/chall.rs) had three important operations: registering eligibility, claiming an allocation, and checking whether the allocation count had reached three.

Inside `claim_allocation`, the eligibility check reads an instruction from the transaction:

```rust
let preceding_ix = ix_utils::load_instruction_at_checked(0usize, &sysvar)?;
```

The variable name says preceding, but the index is always **zero**. The program checks that instruction's program ID and the `register_eligibility` discriminator, then increments the allocation counter.

My saved transaction builder takes advantage of that fixed index:

```text
Separate funding transaction: fund a fresh applicant

Challenge transaction:
    0: register_eligibility
    1: claim_allocation
    2: claim_allocation
    3: claim_allocation
```

Every claim sees the same valid registration at position zero. There is no consumed-eligibility state or one-claim guard to stop the repeated increments. Starting at zero allocations, three claims satisfy `allocations >= 3`.

The funding transaction stays separate so registration remains instruction zero in the challenge transaction. The builder also derives the eligibility PDA using the applicant's public key and supplies the instructions sysvar expected by the contract. This isn't a bypass of Solana signatures or account ownership checks; it's a flaw in the program's claim logic.

I reviewed that transaction layout against the source. I haven't replayed it against a Solana validator here, and I left the archived wallet key and instance-specific addresses out of the article.

```text
HTB{gr4nt_r3g1stry_1nstruct10n_1ntr0sp3ct10n}
```
