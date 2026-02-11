// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';

// This would connect to a real database in production
let cartItems: any[] = [];

export async function GET(request: NextRequest) {
  // Get cart items
  return NextResponse.json({ items: cartItems, total: cartItems.length });
}

export async function POST(request: NextRequest) {
  try {
    const { productId, quantity = 1 } = await request.json();
    const existingItem = cartItems.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ productId, quantity });
    }
    
    return NextResponse.json({ message: 'Item added to cart', items: cartItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { productId, newQuantity } = await request.json();
    const itemToUpdate = cartItems.find(item => item.productId === productId);
    
    if (itemToUpdate) {
      itemToUpdate.quantity = newQuantity;
      return NextResponse.json({ message: 'Cart updated', items: cartItems });
    } else {
      return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { productId } = await request.json();
    cartItems = cartItems.filter(item => item.productId !== productId);
    return NextResponse.json({ message: 'Item removed from cart', items: cartItems });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove item from cart' }, { status: 500 });
  }
}