import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Screen = 'home' | 'listing' | 'details' | 'cart' | 'checkout' | 'confirmation';

type DeliveryOption = 'home' | 'pickup';

type PaymentMethod = 'card' | 'applepay' | 'cash';

interface StoreInfo {
  id: string;
  name: string;
  city: string;
  distance: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  inventory: number;
  nearbyAvailable: boolean;
}

interface CartItem {
  product: Product;
  qty: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Globmart';
  Math = Math;

  screen: Screen = 'home';
  selectedProduct: Product | null = null;
  selectedCategory: string = 'all';
  searchQuery: string = '';
  selectedStore: StoreInfo = {
    id: 'sf',
    name: 'San Francisco Store',
    city: 'San Francisco, CA',
    distance: '2.4mi',
    status: 'Open until 10PM',
  };

  stores: StoreInfo[] = [
    { id: 'sf', name: 'San Francisco Store', city: 'San Francisco, CA', distance: '2.4mi', status: 'Open until 10PM' },
    { id: 'oak', name: 'Oakland Store', city: 'Oakland, CA', distance: '9.2mi', status: 'Open until 9PM' },
    { id: 'sj', name: 'San Jose Store', city: 'San Jose, CA', distance: '45mi', status: 'Open until 10PM' },
  ];

  products: Product[] = [
    { id: 1, name: 'Organic Avocados (4ct)', category: 'groceries', price: 7.99, rating: 4.8, image: 'https://via.placeholder.com/150', description: 'Fresh California avocados, ripe and ready.', inventory: 16, nearbyAvailable: true },
    { id: 2, name: 'Noise-Cancelling Headphones', category: 'electronics', price: 199.99, rating: 4.4, image: 'https://via.placeholder.com/150', description: 'Premium sound, long battery life.', inventory: 9, nearbyAvailable: true },
    { id: 3, name: 'Modern Sofa', category: 'home', price: 549.00, rating: 4.2, image: 'https://via.placeholder.com/150', description: 'Comfortable mid-century living room sofa.', inventory: 5, nearbyAvailable: false },
    { id: 4, name: 'Denim Jacket', category: 'clothing', price: 79.99, rating: 4.6, image: 'https://via.placeholder.com/150', description: 'Classic fit, premium denim.', inventory: 30, nearbyAvailable: true },
    { id: 5, name: 'Skincare Kit', category: 'personal care', price: 38.50, rating: 4.7, image: 'https://via.placeholder.com/150', description: 'All-in-one daily glow routine.', inventory: 21, nearbyAvailable: true },
    { id: 6, name: 'Bluetooth Speaker', category: 'electronics', price: 89.99, rating: 4.5, image: 'https://via.placeholder.com/150', description: 'Portable, water-resistant and loud.', inventory: 10, nearbyAvailable: true },
    { id: 7, name: 'Organic Bananas (6ct)', category: 'groceries', price: 3.49, rating: 4.3, image: 'https://via.placeholder.com/150', description: 'Sweet, ripe bananas for smoothies and snacks.', inventory: 40, nearbyAvailable: true },
    { id: 8, name: 'Almond Milk (1L)', category: 'groceries', price: 4.29, rating: 4.1, image: 'https://via.placeholder.com/150', description: 'Non-dairy almond milk, unsweetened.', inventory: 28, nearbyAvailable: true },
    { id: 9, name: 'Organic Greek Yogurt', category: 'groceries', price: 2.99, rating: 4.6, image: 'https://via.placeholder.com/150', description: 'High-protein plain Greek yogurt.', inventory: 33, nearbyAvailable: true },
  ];

  recentlyViewed: Product[] = [];
  cart: CartItem[] = [];

  checkoutStep = 0;
  deliveryOption: DeliveryOption = 'home';
  paymentMethod: PaymentMethod = 'card';
  selectedAddress = '123 Market St, San Francisco, CA';

  // Address form fields
  addressStreet = '123 Market St';
  addressCity = 'San Francisco';
  addressState = 'CA';
  addressZip = '94102';

  // Card form fields
  cardName = '';
  cardNumber = '';
  cardExpiry = '';
  cardCVV = '';

  productQuantities: { [id: number]: number } = {};
  paymentProcessing = false;

  get filteredProducts() {
    const query = this.searchQuery.trim().toLowerCase();
    return this.products.filter((p) => {
      const matchesCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
      const matchesSearch = !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }

  get cartTotal() {
    return this.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  }

  get cartCount() {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  get progressLabel() {
    return ['Address', 'Payment', 'Review'][this.checkoutStep] || 'Complete';
  }

  get formattedAddress() {
    return `${this.addressStreet}, ${this.addressCity}, ${this.addressState} ${this.addressZip}`;
  }

  get isAddressValid() {
    return this.addressStreet.trim() && this.addressCity.trim() && this.addressState.trim() && this.addressZip.trim();
  }

  get isCardValid() {
    return this.cardName.trim() && this.cardNumber.replace(/\s/g, '').length === 16 && this.cardExpiry && this.cardCVV;
  }

  setScreen(page: Screen, product?: Product) {
    this.screen = page;
    if (product) {
      this.selectedProduct = product;
      this.addToRecentlyViewed(product);
    }
  }

  changeStore(store: StoreInfo) {
    this.selectedStore = store;
    this.screen = 'home';
  }

  setCategory(category: string) {
    this.selectedCategory = category;
    this.setScreen('listing');
  }

  addToRecentlyViewed(product: Product) {
    const exists = this.recentlyViewed.find((p) => p.id === product.id);
    if (!exists) {
      this.recentlyViewed.unshift(product);
      if (this.recentlyViewed.length > 6) this.recentlyViewed.pop();
    }
  }

  getProductQty(product: Product) {
    if (!this.productQuantities[product.id]) {
      this.productQuantities[product.id] = 1;
    }
    return this.productQuantities[product.id];
  }

  setProductQty(product: Product, qty: number) {
    const parsed = Math.max(1, Math.min(99, Math.floor(qty)));
    this.productQuantities[product.id] = parsed;
  }

  addToCart(product: Product | null | undefined, qty = 1) {
    if (!product) return;
    const item = this.cart.find((x) => x.product.id === product.id);
    const addedQty = Math.max(1, Math.min(99, qty));
    if (item) {
      item.qty = Math.min(item.qty + addedQty, 99);
    } else {
      this.cart.push({ product, qty: addedQty });
    }
  }

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter((x) => x.product.id !== item.product.id);
  }

  updateQty(item: CartItem, delta: number) {
    item.qty = Math.max(1, item.qty + delta);
    if (item.qty <= 0) this.removeFromCart(item);
  }

  clearCart() {
    this.cart = [];
  }

  startCheckout() {
    this.screen = 'checkout';
    this.checkoutStep = 0;
  }

  addToCartAndCheckout(product: Product | null | undefined, qty = 1) {
    if (!product) return;
    this.addToCart(product, qty);
    this.startCheckout();
  }

  nextCheckoutStep() {
    if (this.checkoutStep < 2) {
      this.checkoutStep++;
    }
  }

  prevCheckoutStep() {
    if (this.checkoutStep > 0) {
      this.checkoutStep--;
    } else {
      this.screen = 'cart';
    }
  }

  confirmOrder() {
    if (this.paymentMethod === 'card' || this.paymentMethod === 'applepay') {
      this.paymentProcessing = true;
      setTimeout(() => {
        this.paymentProcessing = false;
        this.screen = 'confirmation';
        this.clearCart();
      }, 1400);
    } else {
      this.screen = 'confirmation';
      this.clearCart();
    }
  }

  viewProductDetails(product: Product) {
    this.selectedProduct = product;
    this.addToRecentlyViewed(product);
    this.screen = 'details';
  }
}
