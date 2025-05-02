use aiken/collection/list
use cardano/address.{Address, from_verification_key}
use cardano/assets.{AssetName, PolicyId, quantity_of}
use cardano/transaction.{InlineDatum, OutputReference, Transaction}

pub type AuctionDatum {
  admin: Address,
  auction_id: ByteArray,
  closed: Bool,
  bids: List<Bid>,
}

pub type Bid {
  bidder: Address,
  amount: Int,
}

pub type AuctionRedeemer {
  CreateAuction { new_auction_id: ByteArray }
  PlaceBid { amount: Int }
  EndAuction { end_auction_id: ByteArray }
}

const token_policy_id: PolicyId = ""

const token_asset_name: AssetName = ""

validator class {
  spend(
    datum: Option<AuctionDatum>,
    redeemer: AuctionRedeemer,
    _utxo: OutputReference,
    tx: Transaction,
  ) {
    when redeemer is {
      PlaceBid { amount } -> validate_place_bid(datum, amount, tx)
      _ -> False
    }
  }

  mint(datum: Option<AuctionDatum>, redeemer: AuctionRedeemer, tx: Transaction) {
    when redeemer is {
      CreateAuction { new_auction_id } ->
        validate_create_auction(datum, new_auction_id, tx)
      EndAuction { end_auction_id } ->
        validate_end_auction(datum, end_auction_id, tx)
      _ -> False
    }
  }

  else(_) {
    fail
  }
}

fn validate_create_auction(
  datum: Option<AuctionDatum>,
  new_id: ByteArray,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(AuctionDatum { admin, auction_id, closed, bids }) -> {
      let addr = get_first_signer(tx)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: AuctionDatum = i_datum
                cont_datum.admin == admin && cont_datum.bids == bids && list.length(
                  cont_datum.bids,
                ) == 0 && cont_datum.auction_id == auction_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      has_valid_output && closed == False && admin == addr && auction_id == new_id
    }
    _ -> False
  }
}

fn validate_place_bid(
  datum: Option<AuctionDatum>,
  bid_amount: Int,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(AuctionDatum { admin, auction_id, closed, bids }) -> {
      let bidder_addr = get_first_signer(tx)
      let inputs = tx.inputs
      let zero: Int = 0

      let total_token_from_bidder =
        list.foldl(
          inputs,
          zero,
          fn(input, acc) {
            let input_address = input.output.address
            let token_amt =
              quantity_of(input.output.value, token_policy_id, token_asset_name)
            if input_address == bidder_addr {
              acc + token_amt
            } else {
              acc
            }
          },
        )

      let is_valid_amount =
        bid_amount > 0 && total_token_from_bidder >= bid_amount
      let updated_bids = process_bid(bids, bidder_addr, bid_amount)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: AuctionDatum = i_datum
                cont_datum.admin == admin && cont_datum.bids == updated_bids && cont_datum.auction_id == auction_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      is_valid_amount && has_valid_output && closed == False
    }
    _ -> False
  }
}

fn validate_end_auction(
  datum: Option<AuctionDatum>,
  id: ByteArray,
  tx: Transaction,
) -> Bool {
  when datum is {
    Some(AuctionDatum { admin, auction_id, closed, bids }) -> {
      let addr = get_first_signer(tx)
      let outputs = tx.outputs
      let has_valid_output =
        list.any(
          outputs,
          fn(output) {
            when output.datum is {
              InlineDatum(i_datum) -> {
                expect cont_datum: AuctionDatum = i_datum
                cont_datum.admin == admin && cont_datum.bids == bids && cont_datum.auction_id == auction_id && cont_datum.closed == closed
              }
              _ -> False
            }
          },
        )
      has_valid_output && closed == True && admin == addr && auction_id == id
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

fn process_bid(bids: List<Bid>, bidder: Address, amount: Int) -> List<Bid> {
  let existing_bid_opt = list.find(bids, fn(bid) { bid.bidder == bidder })
  let updated_bids =
    when existing_bid_opt is {
      Some(existing_bid) -> {
        let updated_bid = Bid { bidder, amount: existing_bid.amount + amount }
        list.map(
          bids,
          fn(bid) {
            if bid.bidder == bidder {
              updated_bid
            } else {
              bid
            }
          },
        )
      }

      None -> {
        let new_bid = Bid { bidder, amount }
        list.push(bids, new_bid)
      }
    }

  list.sort(
    updated_bids,
    fn(a, b) {
      if b.amount < a.amount {
        Less
      } else {
        Greater
      }
    },
  )
}
// pub type BidT {
//   bidder: Int,
//   amount: Int,
// }
// // fn process_bidt(bids: List<BidT>, bidder: Int, amount: Int) -> List<BidT> {
// //   let existing_bid_opt = list.find(bids, fn(bid) { bid.bidder == bidder })
// //   let updated_bids =
// //     when existing_bid_opt is {
// //       Some(existing_bid) -> {
// //         let updated_bid = BidT { bidder, amount: existing_bid.amount + amount }
// //         list.map(
// //           bids,
// //           fn(bid) {
// //             if bid.bidder == bidder {
// //               updated_bid
// //             } else {
// //               bid
// //             }
// //           },
// //         )
// //       }

// //       None -> {
// //         let new_bid = BidT { bidder, amount }
// //         list.push(bids, new_bid)
// //       }
// //     }

// //   list.sort(
// //     updated_bids,
// //     fn(a, b) {
// //       if b.amount < a.amount {
// //         Less
// //       } else {
// //         Greater
// //       }
// //     },
// //   )
// // }

// // test test1() {
// //   let bids: List<BidT> = []
// //   let bidder: Int = 1
// //   let amount: Int = 100

// //   let result = process_bidt(bids, bidder, amount)

// //   list.length(result) == 1 && result == [BidT { bidder: 1, amount: 100 }]
// // }

// // test test2() {
// //   let existing_bid = BidT { bidder: 1, amount: 50 }
// //   let new_bid = BidT { bidder: 1, amount: 150 }
// //   let bids: List<BidT> = [existing_bid]
// //   let bidder: Int = 1
// //   let amount: Int = 100

// //   let result = process_bidt(bids, bidder, amount)

// //   list.length(result) == 1 && result == [new_bid]
// // }

// // test test3() {
// //   // Setup dữ liệu đầu vào
// //   let bid1 = BidT { bidder: 1, amount: 50 }
// //   let bid2 = BidT { bidder: 2, amount: 200 }
// //   let bid3 = BidT { bidder: 1, amount: 250 }
// //   let bids: List<BidT> = []

// //   let result1 =
// //     process_bidt(
// //       process_bidt(bids, bid1.bidder, bid1.amount),
// //       bid2.bidder,
// //       bid2.amount,
// //     )

// //   let bidder: Int = 1
// //   let amount: Int = 200

// //   // Gọi hàm process_bid
// //   let result2 = process_bidt(result1, bidder, amount)

// //   // Kiểm tra kết quả
// //   list.length(result1) == 2 && result1 == [bid2, bid1] && result2 == [
// //     bid3, bid2,
// //   ]
// // }
