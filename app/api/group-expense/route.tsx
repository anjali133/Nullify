import { NextResponse } from "next/server";
import prisma from "@/client";
import { PaymentDetails, Settlement } from "@/type";
import { Prisma } from "@prisma/client";

// add new expense for groups
export async function POST(req: Request) {
  try {
    const { name, amount, splitType, paidBy, splitwith, date, group_id } = await req.json();

      // console.log(name, amount, splitType, paidBy, splitwith, date, group_id);
      if (!name || !amount || !splitType || !paidBy) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

    // 1. fetch the friendship id
    let response = {
      name,
      amount,
      splitType,
      paidBy,
      splitwith,
    };
    let allSettlements: Settlement[] = [];

    // Step 1. sort the paidBy & splitwith object on the basis of the amount
    const sortObjectByAmount = (obj: object) =>
      Object.fromEntries(
        Object.entries(obj).sort(
          ([, a], [, b]) => parseFloat(b.amount) - parseFloat(a.amount)
        )
      );

    response.paidBy = sortObjectByAmount(response.paidBy);
    response.splitwith = sortObjectByAmount(response.splitwith);

    // console.log(response);

    // Step 2. Iterate in split with and reduce the amount if the person
    // is present in paidBy and splitwith

    const reduceAmount = (
      paidBy: Record<string, PaymentDetails>,
      splitwith: Record<string, PaymentDetails>
    ) => {
      for (let [id, details] of Object.entries(splitwith)) {
        // user is present in both paidBy & splitwith
        if (id in paidBy) {
          // if the amount is same then settle if not then just reduce the amount
          if (paidBy[id].amount === details.amount) {
            // Settling both
            // console.log(details.name + " -> " + paidBy[id].name +" Amount "+ paidBy[id].amount  )
            delete paidBy[id];
            delete splitwith[id];
          } else {
            let remaining = paidBy[id].amount - details.amount;
            if (remaining > 0) {
              // console.log(details.name + " -> " + paidBy[id].name +" Amount "+ details.amount   )
              paidBy[id].amount = remaining;
              delete splitwith[id];
            } else {
              // console.log(details.name + " -> " + paidBy[id].name +" Amount "+  paidBy[id].amount   )
              details.amount = remaining * -1;
              delete paidBy[id];
            }
          }
        }
      }
    };

    reduceAmount(response.paidBy, response.splitwith);

    // Step 3. create hash map for paid by
    // {amount:[id1,id2] }

    let paidByHash: { [key: string]: string[] } = {};

    const generateHash = (
      obj: Record<string, { amount: string; name: string }>
    ) => {
      for (let [id, details] of Object.entries(obj)) {
        if (details.amount in paidByHash) {
          paidByHash[details.amount] = [...paidByHash[details.amount], id];
        } else {
          paidByHash[details.amount] = [id];
        }
      }
      // console.log(paidByHash); // Log the output
    };

    generateHash(response.paidBy);

    // Step 4. Iterate in split with to find equal amounts and
    // settle them
    const settleEqualBalances = (
      paidByHash: { [key: string]: string[] },  // Mapping of amount to list of user IDs
      splitwith: Record<string, { amount: string; name: string }>, // Users who owe money
      paidBy: Record<string, { amount: string; name: string }> // Users who paid
    ) => {
      for (let [id, details] of Object.entries(splitwith)) {
        if (details.amount in paidByHash) {
          if (paidByHash[details.amount].length === 1) {
            // If the amount is equal and length is 1, settle them
            allSettlements.push({
              user1: id,
              user2: paidByHash[details.amount][0],
              amount: details.amount,
            });
    
            delete paidBy[paidByHash[details.amount][0]]; // Fix: correctly delete user entry
            delete paidByHash[details.amount];
            delete splitwith[id];
          } else {
            let settled_id = paidByHash[details.amount].pop(); // Get last payer
            if (settled_id) {
              allSettlements.push({
                user1: id,
                user2: settled_id,
                amount: details.amount,
              });
              delete splitwith[id]; // Fix: correct key deletion
            }
          }
        }
      }
    };
    
    settleEqualBalances(paidByHash, response.splitwith, response.paidBy);
    // console.log(paidByHash)
    // console.log(response)

    //Step5. Remaining people should settle along

    //Global array to store all settlements

    function splitExpenses(splitDetails: Record<string, { amount: string; name: string }>, paidByHash: { [key: string]: string[] }, paidBy: Record<string, { amount: string; name: string }>) {
      const settlements = {};

      // Initialize settlements tracking with sorted amounts
      const sortedSettlements = Object.entries(splitDetails)
        .map(([id, { amount, name }]) => ({
          id,
          owes: Number(amount),
          settled: false,
        }))
        .sort((a, b) => b.owes - a.owes); // Sort by amount descending
      // console.log(sortedSettlements, 'sorted settlements')
      // Convert paidByHash to sorted array of payments
      const sortedPayments = Object.entries(paidByHash)
        .flatMap(([amount, payers]) => {
          const payerArray = Array.isArray(payers) ? payers : [payers];
          return payerArray.map((payerId) => ({
            payerId,
            amount: Number(amount),
          }));
        })
        .sort((a, b) => b.amount - a.amount); // Sort by amount descending
      // console.log(sortedPayments, 'sorted payments')
      // Process settlements
      sortedSettlements.forEach((settlement) => {
        let remainingToSettle = settlement.owes;

        // Try to find single payer that can cover the full amount first
        const fullPayer = sortedPayments.find(
          (payment) => payment.amount >= remainingToSettle
        );

        if (fullPayer) {
          // Record full settlement
          allSettlements.push({
            user1: settlement.id,
            user2: fullPayer.payerId,
            amount: remainingToSettle,
          });
          fullPayer.amount -= remainingToSettle;
          settlement.settled = true;

          // Remove payer if they have no more funds
          if (fullPayer.amount === 0) {
            sortedPayments.splice(sortedPayments.indexOf(fullPayer), 1);
          }
        } else {
          // If no single payer can cover it, use multiple payers
          while (remainingToSettle > 0 && sortedPayments.length > 0) {
            const payer = sortedPayments[0];
            const amountToSettle = Math.min(remainingToSettle, payer.amount);

            // Record partial settlement
            allSettlements.push({
              user1: settlement.id,
              user2: payer.payerId,
              amount: amountToSettle,
            });

            remainingToSettle -= amountToSettle;
            payer.amount -= amountToSettle;

            // Remove payer if they have no more funds
            if (payer.amount === 0) {
              sortedPayments.shift();
            }
          }

          settlement.settled = remainingToSettle === 0;
        }
      });
    }

    // Usage with your data
    splitExpenses(response.splitwith, paidByHash, response.paidBy);

    if (allSettlements.length == 0) {
      return NextResponse.json(
        { error: "You can't add an expense with yourself" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (prisma) => {
    for(const settlement of allSettlements){
      const {user1, user2, amount} = settlement;
      let friendship = await prisma.friends.findFirst({
        where: {
          OR: [
            {
              user_id1: user1,
              user_id2: user2,
            },
            {
              user_id1: user2,
              user_id2: user1,
            },
          ]
        },
      })

      if(!friendship){
        friendship = await prisma.friends.create({
          data: {
            user_id1: user1,
            user_id2: user2,
            status: "accepted",
            balances: 0,
          },
        });
      }

      const friendship_id = friendship.friendship_id;
      await prisma.friendGroupBalance.upsert({
        where: {
          friendship_id_group_id: {
            friendship_id: friendship_id,
            group_id: parseInt(group_id, 10),
          },
        },
        update: {
          balances: amount,
        },
        create: {
          friendship_id: friendship_id,
          group_id: parseInt(group_id, 10),
          balances: amount,
        },
      });
      
    }
    const newExpense = await prisma.expenses.create({
    data: {
      name,
      total_amount: amount,
      split_type: splitType,
      paid_by: paidBy,
      split_details: allSettlements as unknown as Prisma.JsonArray,
      date: new Date(),
      is_settled: false,
      group_id: parseInt(group_id, 10),
    },
    });

    return newExpense;
  });

    return NextResponse.json(
      {
        message: "Expense created successfully",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}

