use aiken/list
use aiken/transaction.{InlineDatum, Transaction}
use aiken/transaction/credential.{Address, from_verification_key}

type JudgeDatum {
  admin: Address,
  judge_id: Int,
  closed: Bool,
  votes: List<Vote>,
}

type Vote {
  quality_name: String,
  voters: List<Address>,
}

type JudgeRedeemer {
  CreateJudge { new_judge_id: Int }
  PlaceVote { quality_name: String }
  EndJudge { end_judge_id: Int }
}

validator {
  fn evaluate(
    datum: Option<JudgeDatum>,
    redeemer: JudgeRedeemer,
    tx: Transaction,
  ) -> Bool {
    when redeemer is {
      PlaceVote { quality_name } -> validate_place_vote(datum, quality_name, tx)
      CreateJudge { new_judge_id } ->
        validate_create_judge(datum, new_judge_id, tx)
      EndJudge { end_judge_id } -> validate_end_judge(datum, end_judge_id, tx)
    }
    // _ -> False
  }

  // spend(
  //   datum: Option<JudgeDatum>,
  //   redeemer: JudgeRedeemer,
  //   _utxo: OutputReference,
  //   tx: Transaction,
  // ) {
  // }

  // mint(datum: Option<JudgeDatum>, redeemer: JudgeRedeemer, tx: Transaction) {
  //   when redeemer is {
  //     CreateJudge { new_judge_id } ->
  //       validate_create_judge(datum, new_judge_id, tx)
  //     EndJudge { end_judge_id } -> validate_end_judge(datum, end_judge_id, tx)
  //     _ -> False
  //   }
  // }

  // else(_) {
  //   fail
  // }
}

fn validate_create_judge(
  datum: Option<JudgeDatum>,
  new_id: Int,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(JudgeDatum { admin, judge_id, closed, votes }) -> {
      let addr = get_first_signer(tx)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: JudgeDatum = i_datum
                cont_datum.admin == admin && cont_datum.votes == votes && list.length(
                  cont_datum.votes,
                ) > 0 && cont_datum.judge_id == judge_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      has_valid_output && closed == False && admin == addr && judge_id == new_id
    }
    _ -> False
  }
}

fn validate_place_vote(
  datum: Option<JudgeDatum>,
  quality_name: String,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(JudgeDatum { admin, judge_id, closed, votes }) -> {
      let voter_addr = get_first_signer(tx)

      let existed_voter =
        list.any(
          votes,
          fn(vote) { list.any(vote.voters, fn(vtr) { vtr == voter_addr }) },
        )

      let (updated_votes, success) =
        process_vote(votes, voter_addr, quality_name)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: JudgeDatum = i_datum
                cont_datum.admin == admin && cont_datum.votes == updated_votes && cont_datum.judge_id == judge_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      has_valid_output && closed == False && success && existed_voter == False
    }
    _ -> False
  }
}

fn validate_end_judge(
  datum: Option<JudgeDatum>,
  id: Int,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(JudgeDatum { admin, judge_id, closed, votes }) -> {
      let addr = get_first_signer(tx)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: JudgeDatum = i_datum
                cont_datum.admin == admin && cont_datum.votes == votes && cont_datum.judge_id == judge_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      has_valid_output && closed == True && admin == addr && judge_id == id
    }
    _ -> False
  }
}

fn get_first_signer(tx: Transaction) -> Address {
  let signers = tx.extra_signatories
  when list.head(signers) is {
    Some(pubkey_hash) -> from_verification_key(pubkey_hash)
    None -> fail @"No signers found"
  }
}

fn process_vote(
  votes: List<Vote>,
  voter: Address,
  quality_name: String,
) -> (List<Vote>, Bool) {
  let existing_vote_opt =
    list.find(votes, fn(vote) { vote.quality_name == quality_name })
  when existing_vote_opt is {
    Some(existing_vote) -> {
      let existing_voter =
        list.find(existing_vote.voters, fn(voter_exit) { voter_exit == voter })
      when existing_voter is {
        Some(_) -> (votes, False)
        None -> {
          let updated_vote =
            Vote {
              quality_name,
              voters: list.push(existing_vote.voters, voter),
            }

          (
            list.map(
              votes,
              fn(vote) {
                if vote.quality_name == quality_name {
                  updated_vote
                } else {
                  vote
                }
              },
            ),
            True,
          )
        }
      }
    }

    None -> (votes, False)
  }
}
