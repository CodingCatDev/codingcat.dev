import { StripeProduct, StripePrice } from '@/models/stripe.model';
import admin from '@/utils/firebaseAdmin';

export async function getActiveMemberProducts(): Promise<StripeProduct[]> {
  const productDocs = await admin
    .firestore()
    .collection('products')
    .where('active', '==', true)
    .where('role', 'in', ['monthly', 'yearly', 'supporter'])
    .get();

  const products: FirebaseFirestore.DocumentData[] = [];
  for (const productDoc of productDocs.docs) {
    const priceDocs = await admin
      .firestore()
      .collection(`products/${productDoc.id}/prices`)
      .where('active', '==', true)
      .get();

    const prices: StripePrice[] = [];
    for (const priceDoc of priceDocs.docs) {
      const price = priceDoc.data() as StripePrice;
      price.id = priceDoc.id;
      prices.push(price);
    }
    const product = productDoc.data() as StripeProduct;
    product.id = productDoc.id;
    product.prices = prices;
    products.push(product);
  }
  return products as StripeProduct[];
}
