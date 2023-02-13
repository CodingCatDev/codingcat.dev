import { firestore } from '../config/config';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onSubscriptionCreate = functions.firestore
  .document('customers/{customerId}/subscriptions/{subscriptionId}')
  .onCreate(async (snap, context) => {
    const subscription = snap.data();
    const customerId = context.params.customerId;
    const subscriptionId = context.params.subscriptionId;

    console.log(`Subscription ${subscriptionId} was added for ${customerId}`);
    console.log(`Subscription:`, JSON.stringify(subscription));

    if (!subscription) {
      console.log('Subscription missing data');
      return;
    }

    return firestore.doc(`users/${customerId}`).set(
      {
        memberships: admin.firestore.FieldValue.arrayUnion({
          membership: subscription.role === 'supporter' ? false : true,
          membershipType: subscription.role,
          subscriptionId,
        }),
      },
      { merge: true }
    );
  });

export const onSubscriptionCancel = functions.firestore
  .document('customers/{customerId}/subscriptions/{subscriptionId}')
  .onUpdate(async (change, context) => {
    const subscriptionOld = change.before.data();
    const subscription = change.after.data();
    const customerId = context.params.customerId;
    const subscriptionId = context.params.subscriptionId;

    console.log(`Subscription ${subscriptionId} was deleted for ${customerId}`);
    console.log(`Subscription:`, JSON.stringify(subscription));

    if (!subscription) {
      console.log('Subscription missing data');
      return;
    }

    if (
      subscription.canceled_at === subscriptionOld.canceled_at &&
      subscription.canceled_at !== null
    ) {
      console.log('Already updated, ejecting');
    }

    const userDoc = await firestore.doc(`users/${customerId}`).get();
    const user = userDoc.data();

    let removeMembership;
    if (user && user.memberships) {
      console.log(`Found user ${user}`);
      removeMembership = user.memberships.find(
        (m: any) => m.subscriptionId === subscriptionId
      );
    } else {
      console.log('User with memberships not found.');
      return false;
    }
    console.log(`Removing membership`, JSON.stringify(removeMembership));
    return firestore.doc(`users/${customerId}`).set(
      {
        memberships: admin.firestore.FieldValue.arrayRemove(removeMembership),
      },
      { merge: true }
    );
  });
